import type { ActionSpriteConfig } from '@gecs/action-sprite/src';
import { Action, type ActorEntity } from '@gecs/plugin-core';
import type { Identifier } from '@gecs/types';
import { Model } from '../components';

export interface AnimationConfig {
  id: Identifier;
  data: { animation: ActionSpriteConfig };
}

export class LoadAnimation extends Action {
  public *run() {
    if (this.entity.has(Model)) {
      const options = yield* this.await(
        this.ctx.$.data.get<AnimationConfig>('animations', this.animation)
      );
      this.ctx.$.render.animations.load(this.entity.id, this.animation, {
        ...options.data.animation,
        modelPath: this.entity.$.model.path
      });
    }
  }

  public constructor(
    public entity: ActorEntity,
    public animation: string
  ) {
    super();
  }
}
