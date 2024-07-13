import type { Identifier } from '@gecs/types';
import type { Spritesheet, Texture } from 'pixi.js';
import type { Atlas as AtlasData } from 'tiledtils';

export interface BaseAtlas {
  readonly name: string;
  readonly unused: boolean;
  get(key: string): Texture;
  unload(): void;
  reserve(id: Identifier): void;
  release(id: Identifier): void;
}

export class Atlas implements BaseAtlas {
  public failed: boolean = false;
  protected handles: Set<Identifier> = new Set();
  protected spritesheet!: Spritesheet;

  public get unused() {
    return this.handles.size > 0;
  }

  public get(key: string) {
    return this.spritesheet.textures[key];
  }

  public unload() {
    if (this.handles.size) {
      throw new Error('');
    }
    this.spritesheet.destroy();
  }

  public release(id: Identifier) {
    this.handles.delete(id);
  }

  public reserve(id: Identifier) {
    this.handles.add(id);
  }

  public constructor(
    public readonly name: string,
    public data: AtlasData
  ) {}
}
