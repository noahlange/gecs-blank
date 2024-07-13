import type { EntityType } from 'gecs';

import { System } from 'gecs';
import { Graphics } from 'pixi.js';

import { Rectangle } from '@gecs/lib';
import { Size, Position, Movement } from '@gecs/plugin-core';

import { Sprite } from '../components';
import type { Dimensions } from '@gecs/types/src';

function getBox({ width, height }: Dimensions): Graphics {
  const gfx = new Graphics();
  gfx.lineStyle(2, 0xff0000);
  gfx.drawRect(0, 0, width, height);
  gfx.zIndex = 10000;
  return gfx;
}

export class BoundingBoxSystem extends System<$.Plugins> {
  protected boxes: Record<string, Graphics> = {};

  protected $ = {
    toRemove: this.ctx.query.all
      .components(Position, Sprite)
      .all.tags($.Tag.TO_DEBUG)
      .any.tags($.Tag.IS_HIDDEN, $.Tag.TO_DESTROY),
    sprites: this.ctx.query.all
      .components(Position)
      .some.components(Size, Movement)
      .all.tags($.Tag.TO_DEBUG)
      .none.tags($.Tag.IS_HIDDEN, $.Tag.TO_DESTROY, $.Tag.IS_STATIC)
  };

  public tick(): void {
    for (const entity of this.$.toRemove) {
      if (entity.id in this.boxes) {
        this.boxes[entity.id].destroy();
        delete this.boxes[entity.id];
      }
    }

    for (const entity of this.$.sprites) {
      const bounds = this.getBounds(entity);
      if (!(entity.id in this.boxes)) {
        const box = getBox(bounds);
        this.ctx.$.render.renderer.container.addChild(box);
        this.boxes[entity.id] = box;
      } else {
        const box = this.boxes[entity.id];
        box.position.set(bounds.x, bounds.y);
      }
    }
  }

  protected getBounds(entity: EntityType<[typeof Position], [typeof Size]>): Rectangle {
    const isTweening = entity.has(Movement);
    const actual = isTweening ? entity.$.movement.position! : entity.$.position;
    const point = this.ctx.$.render.toScreenPoint(actual);
    const size = entity.$.size ?? { width: 1, height: 1 };

    return new Rectangle({
      x1: point.x,
      y1: point.y,
      x2: point.x + this.ctx.$.render.tileSize.width * size.width,
      y2: point.y + this.ctx.$.render.tileSize.height * size.height
    });
  }
}
