import { Action, Position } from '@gecs/plugin-core';
import { CompositeTilemap } from '@pixi/tilemap';
import { Sprite } from '../components';

export class DrawStaticTiles extends Action {
  protected tilemap: CompositeTilemap | null = null;

  protected $ = {
    sprites: this.ctx.query.all
      .components(Position, Sprite)
      .all.tags($.Tag.IS_STATIC)
      .none.tags($.Tag.IS_HIDDEN, $.Tag.TO_DESTROY)
  };

  public *run() {
    const current = this.ctx.$.render.renderer.tilemap;
    current?.clear();
    const tilemap = current ?? new CompositeTilemap();
    while (this.ctx.$.render.atlases.isLoading) yield;
    const failed = new Set();
    for (const entity of this.$.sprites) {
      if (entity.$.sprite.key) {
        const [name, key] = entity.$.sprite.key.split('.');
        const texture = this.ctx.$.render.resources.getTexture(name, key);
        if (texture?.valid) {
          const screen = this.ctx.$.render.toScreenPoint(entity.$.position);
          tilemap.tile(
            texture,
            screen.x + entity.$.sprite.offset.x,
            screen.y + entity.$.sprite.offset.y
          );
        } else {
          failed.add(`${name}.${key}`);
        }
      }
    }

    if (failed.size) {
      console.warn(Array.from(failed).join(', '));
    }

    if (!current) {
      this.ctx.$.render.renderer.tilemap = tilemap;
      this.ctx.$.render.renderer.viewport.addChildAt(tilemap, 0);
    }
  }
}
