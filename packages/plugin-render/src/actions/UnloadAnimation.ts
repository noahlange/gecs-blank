import { Action, type ActorEntity } from '@gecs/plugin-core';
import { Model } from '../components';

export class UnloadAnimation extends Action {
  public *run() {
    if (this.entity.has(Model)) {
      this.ctx.$.render.animations.unload(this.entity.id);
    }
  }

  public constructor(
    public entity: ActorEntity,
    public animation: string
  ) {
    super();
  }
}
