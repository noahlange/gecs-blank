import { System } from 'gecs';

import { BackgroundState } from '../lib/BackgroundState';

export class StateSystem extends System<$.Plugins> {
  public async tick(dt: number, ts: number): Promise<void> {
    if (this.ctx.$.state.paused) {
      return;
    }

    for (const state of this.ctx.$.state.stack) {
      /**
       * A background state executes every tick; a normal state only executes when it's at the top of the stack.
       */
      if (state === this.ctx.$.state.current || state instanceof BackgroundState) {
        await state.tick?.(dt, ts);
      }
    }
  }
}
