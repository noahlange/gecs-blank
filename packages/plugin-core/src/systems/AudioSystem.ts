import type { Vector2 } from '@gecs/types';
import type { EntityType } from 'gecs';

import { System } from 'gecs';

import { Audio, Movement, Position } from '@gecs/plugin-core';
import { distance } from '@gecs/utils';
import { AudioManager } from '../managers/AudioManager';

export class AudioSystem extends System<$.Plugins> {
  protected center: Vector2 | null = null;
  protected $ = {
    sounds: this.ctx.query.components(Audio).some.components(Position),
    camera: this.ctx.query.components(Position).some.components(Movement).tags($.Tag.IS_CAMERA)
  };

  public async tick(dt: number): Promise<void> {
    const camera = this.$.camera.first();
    if (!camera) {
      return;
    }

    // camera position, tweening if we can to avoid big volume steps
    this.center = camera.$.movement?.position ?? camera.$.position;

    for (const entity of this.$.sounds) {
      const { $ } = entity;
      if (!$.audio?.path) {
        continue;
      }
      const [path, x = 0, y = 0] = $.audio.path.split(',');

      $.audio.path = path;
      const volume = entity.$.position
        ? this.getDistanceVolume(entity, { x: +(x ?? 0), y: +(y ?? 0) })
        : $.audio.volume;

      if (volume < AudioManager.MIN_VOLUME_THRESHOLD) {
        if ($.audio.isPlaying) {
          $.audio.stop();
        }
      } else {
        if ($.audio.isPlaying) {
          $.audio.time += dt;
        } else if ($.audio.autoplay) {
          $.audio.play();
        }
      }

      this.ctx.$.core.audio.tick(entity, volume);
    }
  }

  protected getDistanceVolume(
    entity: EntityType<[typeof Audio], [typeof Position]>,
    offset: Vector2 = { x: 0, y: 0 }
  ): number {
    const { x, y } = { x: entity.$.position?.x ?? 0, y: entity.$.position?.y ?? 0 };
    // optionally with a positional offset (default 0, 0)
    const d = this.center ? distance({ x: offset.x + x, y: offset.y + y }, this.center) : 1;
    return entity.$.audio.volume / ((this.center ? d * entity.$.audio.decay : 1) ** 2 || 1);
  }
}
