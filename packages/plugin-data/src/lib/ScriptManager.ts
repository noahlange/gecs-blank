import type { DataObject } from '@gecs/types';

import { Manager } from '@gecs/lib';

interface ScriptObj {
  src: string;
  type: 'url' | 'text';
}

type DataScript = DataObject & { data: ScriptObj };

export class ScriptManager extends Manager {
  protected src: Record<string, ScriptObj> = {};

  public async getCompiled(name: string): Promise<$EvilFunction> {
    if (name in this.src) {
      const { type, src } = this.src[name];
      const text = type === 'text' ? src : await fetch(src).then(res => res.text());
      return new Function(`return ${text};`)();
    }
    throw new Error(`No such script "${name}"`);
  }

  public async load(): Promise<void> {
    const scripts: DataScript[] = await this.ctx.$.data
      .get<DataScript>('scripts')
      .catch(() => []);

    this.src = scripts.reduce(
      (res, prefab) => ({
        ...res,
        ['/' + prefab.id]: {
          type: prefab.data.type,
          src: this.getFileURL(prefab.src!, prefab.data.src)
        }
      }),
      {}
    );
  }

  /**
   * Resolve a file belonging to a specific plugin to a fetchable URL.
   */
  protected getFileURL(plugin: string, filename: string): string {
    return ['data', plugin, filename].map(str => str.replace('/', '')).join('/');
  }
}
