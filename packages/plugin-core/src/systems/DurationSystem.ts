import type { Context } from 'gecs';

import { System } from 'gecs';

/**
 * Invoked at an interval—not every tick.
 */
export class DurationTickSystem extends System<$.Plugins> {
  protected ms: number = 0;

  public tick(dt: number): void {
    const scale = this.ctx.$.core.config.timescale;
    this.ms += dt;
    if (this.ms > scale * this.ctx.$.core.config.tick) {
      this.ms = 0;
      for (const entity of this.ctx.$.core.queries.duration) {
        if (entity.$.duration.active) {
          entity.$.duration.tick();
        }
      }
    }
  }
}

/**
 * Each tick, flag timed-out entities for deletion.
 */
export function DurationCleanupSystem(ctx: Context<$.Plugins>): void {
  for (const entity of ctx.$.core.queries.duration) {
    if (!entity.$.duration.active) {
      entity.tags.add($.Tag.TO_DESTROY);
    }
  }
}
