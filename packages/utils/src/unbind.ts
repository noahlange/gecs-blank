import type { BoundCommands, BoundEvents } from '@gecs/types';
import type { Context } from 'gecs';

import { entries } from './misc';

function unbind(commands: BoundCommands, ctx: Context<$.Plugins>): Partial<$.Commands>;
function unbind(events: Partial<BoundEvents>, ctx: Context<$.Plugins>): Partial<$.Events>;
function unbind(
  fns: BoundCommands | Partial<BoundEvents>,
  ctx: Context<$.Plugins>
): Partial<$.Commands> | Partial<$.Events> {
  const res: $AnyEvil = {};
  for (const [key, value] of entries(fns)) {
    const fns = Array.isArray(value) ? value : [value];
    res[key] = (...args: $AnyEvil[]): $AnyEvil => {
      for (const fn of fns) {
        (fn as $AnyEvil)(ctx, ...args);
      }
    };
  }
  return res;
}

export { unbind };
