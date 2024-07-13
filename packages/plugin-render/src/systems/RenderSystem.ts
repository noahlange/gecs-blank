import type { Identifier, Dimensions, Vector2, Vector3 } from '@gecs/types';
import type { EntityType } from 'gecs';
import type { Texture } from 'pixi.js';

import { System } from 'gecs';

import { Position, Movement, Text } from '@gecs/plugin-core';
import { isSamePoint } from '@gecs/utils';

import { Sprite } from '../components';

type Spriteable = EntityType<[typeof Sprite, typeof Position], [typeof Movement, typeof Text]>;

export class RenderSystem extends System<$.Plugins> {
  public get renderer() {
    return this.ctx.$.render.renderer;
  }

  public get resources() {
    return this.ctx.$.render.resources;
  }

  protected $ = {
    toRemove: this.ctx.query.all
      .components(Position, Sprite)
      .any.tags($.Tag.IS_HIDDEN, $.Tag.TO_DESTROY)
      .none.tags($.Tag.IS_STATIC),
    sprites: this.ctx.query.all
      .components(Position, Sprite)
      .some.components(Movement, Text)
      .none.tags($.Tag.IS_HIDDEN, $.Tag.TO_DESTROY, $.Tag.IS_STATIC)
  };

  protected positions: Record<Identifier, Vector2 | null> = {};

  public getZ(pos: Vector3): number {
    if ('world' in this.ctx.$) {
      const level = (this.ctx.$.world as $AnyEvil).level as Dimensions;
      const x = pos.x * level.height;
      const z = pos.z;
      return x + pos.y + z;
    }
    return pos.y + pos.z;
  }

  public updateSprites(): void {
    for (const entity of this.$.sprites) {
      // if no texture is specified, move along
      if (entity.$.sprite.key) {
        // otherwise create/update the sprite
        this.updateSprite(entity);
      }
    }
  }

  public tick(): void {
    // as we remove sprites, stick them back in the pool
    for (const entity of this.$.toRemove) {
      if (entity.$.sprite.pixi) {
        this.resources.pool.release(entity.$.sprite.pixi);
        entity.$.sprite.pixi.visible = false;
        entity.$.sprite.pixi = null;
      }
    }
    // as we update sprites, pull them from the pool
    this.updateSprites();
    this.cleanUpSprites();
  }

  protected cleanUpSprites(): void {
    for (const { id, $ } of this.$.toRemove) {
      delete this.positions[id];
      if ($.sprite.pixi) {
        this.resources.pool.release($.sprite.pixi);
      }
    }
  }

  protected updateSprite(entity: Spriteable): void {
    const { sprite, movement, position } = entity.$;
    if (!sprite.key) return;
    const [name, key] = sprite.key.split('.');
    let texture: Texture | null = null;
    if (!sprite.pixi) {
      const pixi = this.resources.pool.allocate();
      texture = this.resources.getTexture(name, key);
      if (texture?.valid) {
        sprite.isLoading = false;
        sprite.pixi = pixi;
        sprite.dirty = pixi.visible = true;
        pixi.texture = texture;
        pixi.name =
          entity.$.text?.title ??
          (entity.constructor.name !== '_a'
            ? entity.constructor.name + '.' + entity.id.toString()
            : void 0) ??
          sprite.key;

        this.renderer.container.addChild(pixi);
      }
    }

    if (!sprite.pixi) {
      // if we still don't have a valid PIXI object, return
      return;
    } else if (
      entity.$.movement?.active ||
      !isSamePoint(movement?.position ?? position, this.positions[entity.id])
    ) {
      // unset the cached position if the entity has moved
      this.positions[entity.id] = null;
    }

    if (sprite.tint !== sprite.pixi.tint) {
      sprite.pixi.tint = sprite.tint;
    }

    if (sprite.alpha !== sprite.pixi.alpha) {
      sprite.pixi.alpha = sprite.alpha;
    }

    if (!isSamePoint(sprite.pixi.anchor, sprite.anchor)) {
      sprite.pixi.anchor.set(sprite.anchor.x, sprite.anchor.y);
    }

    if (sprite.dirty) {
      texture ??= this.resources.getTexture(name, key);
      if (texture?.valid) {
        sprite.pixi.texture = texture;
        entity.$.sprite.dirty = false;
        sprite.isLoading = false;
      }
    }

    if (this.positions[entity.id] === null) {
      const actual = entity.$.movement?.position ?? entity.$.position;
      const screen = this.ctx.$.render.toScreenPoint(actual);

      sprite.pixi.position.set(
        screen.x + entity.$.sprite.offset.x,
        screen.y + entity.$.sprite.offset.y
      );

      sprite.pixi.zIndex = this.getZ({
        x: Math.floor(actual.x),
        y: Math.round(actual.y),
        z: entity.$.position.z
      });

      // update position cache
      this.positions[entity.id] = { x: actual.x, y: actual.y };
    }
  }
}
