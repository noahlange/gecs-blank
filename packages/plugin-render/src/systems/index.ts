import { Phase, phase } from 'gecs';

import { BoundingBoxSystem } from './BoundingBoxSystem';
import { CameraSystem } from './CameraSystem';
import { RenderSystem } from './RenderSystem';
import { TweenSystem } from './TweenSystem';
import { ViewSystem } from './ViewSystem';

export const render = {
  pre: phase(Phase.PRE_RENDER, ViewSystem, TweenSystem, CameraSystem),
  on: phase(Phase.ON_RENDER, RenderSystem, BoundingBoxSystem)
};
