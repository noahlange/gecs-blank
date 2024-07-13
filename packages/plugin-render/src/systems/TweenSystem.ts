import type { Identifier, Vector2 } from '@gecs/types';
import type { Context } from 'gecs';

import { Tween } from '@tweenjs/tween.js';

import { Movement, Position } from '@gecs/plugin-core';
import { distance } from '@gecs/utils';

const tweens: Map<Identifier, Promise<unknown>> = new Map();

/**
 * Create and execute a tween.
 * @param a - start point
 * @param b - end point
 * @param duration - tween duration in ms
 * @param onChange - function to be invoked on tick
 * @returns - Promise: resolves to true if it completes, false if it otherwise stops.
 */
function runTween(
  a: Vector2,
  b: Vector2,
  duration: number,
  onChange: (current: Vector2, elapsed: number) => void
): Promise<Vector2> {
  // this object will be updated incrementally—copy the properties so we don't mutate something unintentionally
  const tween = new Tween({ ...a }).to(b, duration);
  return new Promise(resolve =>
    tween.onUpdate(onChange).onComplete(resolve).onStop(resolve).start()
  );
}

export function TweenSystem(ctx: Context<$.Plugins>): void {
  const { tick, timescale } = ctx.$.core.config;
  for (const entity of ctx.query.components(Movement, Position)) {
    const { position, movement } = entity.$;
    if (!movement.active) {
      movement.position.x = position.x;
      movement.position.y = position.y;
    }

    if (movement.active && !tweens.has(entity.id)) {
      const duration =
        (distance(movement.position, position) * (tick / timescale)) / movement.speed;

      const start = { x: movement.position.x, y: movement.position.y };
      const end = { x: position.x, y: position.y };

      const promise = (async () => {
        // run tween, tweaking duration to avoid rounding issues
        await runTween(start, end, duration, (pos, elapsed) => {
          if (elapsed > 0.98) {
            // @todo: hack, but it allows us to avoid a lag between movement steps.
            entity.$.movement.active = false;
          }
          // updating the tween's current (fractional) position
          entity.$.movement.position.x = pos.x;
          entity.$.movement.position.y = pos.y;
        });
        entity.$.movement.active = false;
        tweens.delete(entity.id);
        entity.$.position.x = end.x;
        entity.$.position.y = end.y;
      })();

      tweens.set(entity.id, promise);
      entity.tags.add($.Tag.IS_ANIMATING);
    }
  }
}
