import type { Vector2 } from '@gecs/types';
import type { Context } from 'gecs';

import { isSamePoint } from '@gecs/utils';

// we don't want to recalculate FOV if the view hasn't changed
let prev: Record<string, Vector2> = {};

export function ViewSystem(ctx: Context<$.Plugins>): void {
  const fov = ctx.$.render.fov;
  if (!fov) {
    return;
  }

  const curr: Record<string, Vector2> = {};

  const views = Array.from(ctx.$.render.queries.views).sort(
    (a, b) => (a.is($.Tag.IS_CAMERA) ? 1 : 0) - (b.is($.Tag.IS_CAMERA) ? 1 : 0)
  );

  for (const view of views) {
    const id = view.id;
    const pos = view.$.position;

    // for the time being, we'll only recalculate FOVs for views have actually moved
    if (!view.is($.Tag.IS_PLAYABLE) && isSamePoint(pos, prev[view.id])) {
      curr[id] = prev[id];
      continue;
    }

    // recalculate FOV
    view.$.view.visible = fov.calculateArray(pos, 5).map(i => i.pos);
    // and update last position
    curr[id] = { x: pos.x, y: pos.y };
  }

  prev = curr;
}
