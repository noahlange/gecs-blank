import type { Identifier } from '@gecs/types';
import type { WorkerRunner } from '@gecs/utils';
import type { Atlas as AtlasData } from 'tiledtils';
import type { RenderPlugin } from '../RenderPlugin';

import * as PIXI from 'pixi.js';
import { loadSpritesheetFromTexture } from 'tiledtils/pixi';

import { Manager } from '@gecs/lib';
import { _, createWorker } from '@gecs/utils';

import mergeWorkerUrl from '../workers/textures?worker&url';
import { Atlas, type BaseAtlas } from '../lib/Atlas';

export class AtlasManager extends Manager {
  protected atlases: Record<string, BaseAtlas> = {};
  protected failed: Set<string> = new Set();
  protected loading: Set<string> = new Set();
  protected flatten: WorkerRunner<string[], ImageBitmap> = createWorker(mergeWorkerUrl, true);

  public get isLoading() {
    return this.loading.size > 0;
  }

  public get plugin(): RenderPlugin {
    return this.ctx.$.render;
  }

  public has(id: string): boolean {
    return id in this.atlases || this.loading.has(id) || this.failed.has(id);
  }

  public get(id: string) {
    return this.atlases[id];
  }

  public release(id: Identifier): void {
    for (const [key, atlas] of Object.entries(this.atlases)) {
      atlas.release(id);
      if (atlas.unused) {
        atlas.unload();
        this.plugin.log(`release atlas "${atlas.name}"`);
        this.plugin.resources.removeSpritesheet(atlas.name);
        delete this.atlases[key];
      }
    }
  }

  public async load(name: string, data?: AtlasData): Promise<Atlas | null> {
    if (!name) return null;
    if (!this.loading.has(name)) {
      await this.addAtlas(name, data);
      this.loading.delete(name);
    }
    return (this.atlases[name] as Atlas) ?? null;
  }

  public reserve(id: Identifier, atlas: string): void {
    this.atlases[atlas]?.reserve(id);
  }

  protected async addAtlas(name: string, data: AtlasData | null = null): Promise<void> {
    // if the user hasn't passed any explicit data
    this.loading.add(name);
    try {
      const content = data ?? (await this.ctx.$.data.get<AtlasData>('atlas', name));
      this.atlases[name] = await this.loadAtlas(name, content);
      this.plugin.log(`%cAtlasManager`, 'color:grey;', `reserve "${name}"`);
    } catch (e) {
      this.plugin.log(`%cAtlasManager`, 'color:red', `reserve "${name}"`);
      this.failed.add(name);
    } finally {
      this.loading.delete(name);
    }
  }

  protected async loadAtlas(name: string, atlas: AtlasData): Promise<Atlas> {
    const images = _.arrayOf(atlas.meta.image);
    const flattened = await this.flattenImages(images);
    if (flattened !== null) {
      this.plugin.resources.addSpritesheets({
        [atlas.meta.name]: await loadSpritesheetFromTexture(flattened, atlas)
      });
    }
    return new Atlas(name, atlas);
  }

  protected async flattenImages(names: string[]): Promise<PIXI.Texture | null> {
    if (names.length > 1) {
      // flatten the images into a single bitmap
      return PIXI.Texture.from(await this.flatten.run(names));
    }
    return names.length ? PIXI.Texture.fromURL(names[0]) : null;
  }
}
