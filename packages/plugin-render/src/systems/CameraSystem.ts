import type { Vector2 } from '@gecs/types';

import { System } from 'gecs';
import * as PIXI from 'pixi.js';

import { Position } from '@gecs/plugin-core';

import { Sprite } from '../components';

export class CameraSystem extends System<$.Plugins> {
  protected target!: PIXI.Container;
  protected offset: Vector2 = { x: 0, y: -48 };
  protected following: boolean = false;

  protected get viewport() {
    return this.ctx.$.render.renderer.viewport;
  }

  protected $ = {
    camera: this.ctx.query.tags($.Tag.IS_CAMERA).components(Position).some.components(Sprite)
  };

  public tick(): void {
    if (!this.viewport) {
      return;
    }

    const entity = this.$.camera.first();

    if (entity) {
      if (entity?.$.sprite?.pixi) {
        const pixi = entity.$.sprite.pixi;
        this.target.position.set(pixi.x + this.offset.x, pixi.y + this.offset.y);
      } else {
        const pos = this.ctx.$.render.toScreenPoint(entity?.$.position);
        this.target.position.set(pos.x, pos.y);
      }

      if (!this.following) {
        this.following = true;
        this.viewport.follow(this.target);
      }
    } else {
      this.viewport.plugins.remove('follow');
      this.following = false;
    }
  }

  public stop(): void {
    this.target?.destroy();
  }

  public start(): void {
    this.target = new PIXI.Container();
    this.viewport.addChild(this.target);
  }
}
