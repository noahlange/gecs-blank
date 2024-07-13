import type { ObjectPool } from '@pixi-essentials/object-pool';
import type { Context } from 'gecs';

import { ObjectPoolFactory } from '@pixi-essentials/object-pool';
import * as PIXI from 'pixi.js';

import { Manager } from '@gecs/lib';
import { _ } from '@gecs/utils';

import { removeFromCache } from '../utils';

interface Spritesheets {
  [key: string]: PIXI.Spritesheet;
}

export class ResourceManager extends Manager {
  public pool: ObjectPool<PIXI.Sprite>;

  protected sprites: Record<string, PIXI.Sprite> = {};
  protected sheets: Record<string, PIXI.Spritesheet> = {};

  private get plugin() {
    return this.ctx.$.render;
  }

  public addSpritesheets(spritesheets: Spritesheets): void {
    for (const [name, sheet] of _.entries(spritesheets)) {
      const s = Object.assign(sheet, { name });
      this.sheets[name] = s;
    }
  }

  public removeSpritesheet(name: string): void {
    if (name in this.sheets) {
      const sheet = Object.assign(this.sheets[name], { name });
      sheet.destroy();
      removeFromCache(sheet);
      delete this.sheets[name];
    }
  }

  public hasTexture(sheet: string, key: string): boolean {
    return this.getTexture(sheet, key) !== null;
  }

  public getTexture(sheet: string, key: string): PIXI.Texture | null {
    const spritesheet = this.sheets[sheet];
    const textures = spritesheet?.textures ?? {};
    return textures[`${sheet}.${key}`] ?? textures[key] ?? null;
  }

  public setTexture(sheet: string, key: string, texture: PIXI.Texture): void {
    const textures = this.sheets[sheet]?.textures;
    const name = `${sheet}.${key}`;
    if (textures && !(name in textures)) {
      textures[name] = texture;
    }
  }

  protected get app(): PIXI.Application {
    return this.plugin.renderer.app;
  }

  public constructor(ctx: Context<$.Plugins>) {
    super(ctx);
    this.pool = ObjectPoolFactory.build(PIXI.Sprite);
    this.pool.reserve(10_000);
    this.pool.startGC();
  }
}
