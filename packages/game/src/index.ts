import { GamePlugin } from '@/game';
import { Context, type PluginClass } from 'gecs';

import CorePlugin from '@gecs/plugin-core';
import DataPlugin from '@gecs/plugin-data';
import EventsPlugin from '@gecs/plugin-events';
import RenderPlugin from '@gecs/plugin-render';
import StatePlugin from '@gecs/plugin-state';
import UIPlugin from '@gecs/plugin-ui';

declare global {
  namespace $ {
    enum Cursor {}
    enum Tag {}
    interface Plugins {}
    interface Events {}
  }
}

const plugins: PluginClass<$.Plugins>[] = [
  GamePlugin,
  CorePlugin,
  DataPlugin,
  EventsPlugin,
  RenderPlugin,
  StatePlugin,
  UIPlugin
];

export class GameContext extends Context.with(...plugins) {}
