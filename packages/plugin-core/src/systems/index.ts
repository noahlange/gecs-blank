import { Phase, phase } from 'gecs';

import { AudioSystem } from './AudioSystem';
import { CleanupSystem } from './CleanupSystem';
import { DurationCleanupSystem, DurationTickSystem } from './DurationSystem';
import { InputSystem } from './InputSystem';
import { ActionSystem } from './ActionSystem';

export const load = {
  on: phase(Phase.ON_LOAD, InputSystem)
};

export const update = {
  on: phase(Phase.ON_UPDATE, AudioSystem, ActionSystem),
  post: phase(Phase.POST_UPDATE, DurationTickSystem)
};

export const render = {
  post: phase(999, DurationCleanupSystem, CleanupSystem)
};
