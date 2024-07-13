import { _ } from '@gecs/utils';

interface FileSystem {
  glob(pattern: string): Promise<string[]>;
  readFile(file: string): Promise<string>;
}

interface ContentItem {
  path: string;
  plugin: string;
  content: any;
}

interface PluginMeta {
  name: string;
  version: string;
  dependencies: { name: string; version: string }[];
}

export class ManifestGenerator {
  private static RE_EXTENSION = /(\.\w+)$/;

  private static join(...path: string[]): string {
    return path.join('/');
  }

  private dataDir: string;
  private base: string;
  private fs: FileSystem;

  public async generateManifest(): Promise<unknown> {
    const order = await this.getOrder();
    const scripts = this.readScripts(order);
    const content = this.readContent(order);
    const res = await Promise.all([scripts, content]);
    return this.mergeContent(res.flat());
  }

  public async readContent(order: Record<string, number>): Promise<ContentItem[]> {
    const files = await this.fs.glob(`${this.dataDir}/**/*.json`);
    return _.settled(
      files
        .filter((f: string) => /\.json$/.test(f) && f !== 'meta.json')
        .map(async file => {
          file = file.replace(this.dataDir + '/', '');
          let [plugin] = file.split('/');
          if (!(plugin in order)) {
            plugin = 'overwrite';
            file = [plugin, file].join('/');
          }
          const content = await this.fs.readFile(ManifestGenerator.join(this.dataDir, file));
          const path = file.replace(/\.json$/, '').replace(`${plugin}/`, '');
          return { plugin, path, order: order[plugin], content: JSON.parse(content) };
        })
    ).then(data => data.sort((a, b) => a.order - b.order));
  }

  public async readScripts(order: Record<string, number>): Promise<ContentItem[]> {
    const scripts = await this.fs.glob(`${this.dataDir}/**/*.[tj]s`);
    return scripts
      .map(filename => {
        const [plugin, ...parts] = filename.replace(this.dataDir + '/', '').split('/');
        const path = parts.join('/');
        return {
          plugin,
          // object path in the content manifest
          path: path.replace(ManifestGenerator.RE_EXTENSION, ''),
          order: order[plugin],
          content: {
            id: path,
            title: parts.at(-1),
            src: plugin,
            data: { type: 'url', src: ['', ...parts].join('/') }
          }
        };
      })
      .sort((a, b) => a.order - b.order);
  }

  public mergeContent(items: ContentItem[]): Record<string, unknown> {
    const res = {};
    for (const { path, content } of items) {
      const objs = _.arrayOf(content);
      for (const value of objs) {
        const key = Array.isArray(content) ? `${path}/${value.id}` : path;
        _.set(res, key.replaceAll('/', '.'), { ...value });
      }
    }
    return res;
  }

  public async getOrder(): Promise<Record<string, number>> {
    const meta = (await this.fs
      .readFile(ManifestGenerator.join(this.dataDir, 'meta.json'))
      .then(JSON.parse)) as PluginMeta;
    return meta.dependencies.reduce(
      (priorities, plugin, i) => ({ ...priorities, [plugin.name]: i + 1 }),
      { overwrite: 0 }
    );
  }

  public constructor(fs: FileSystem, base: string) {
    this.fs = fs;
    this.base = base;
    this.dataDir = ManifestGenerator.join(this.base, 'data');
  }
}
