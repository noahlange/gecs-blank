import type DataPlugin from '@gecs/plugin-data';
import type DevPlugin from '@gecs/plugin-dev';
import type EventsPlugin from '@gecs/plugin-events';

import { RenderPlugin } from './RenderPlugin';
import type StatePlugin from '@gecs/plugin-state';

declare global {
  namespace $ {
    export interface Plugins {
      [RenderPlugin.type]: RenderPlugin;
      [DataPlugin.type]: DataPlugin;
      [DevPlugin.type]: DevPlugin;
      [EventsPlugin.type]: EventsPlugin;
      [StatePlugin.type]: StatePlugin;
    }

    export interface Events {}

    export enum Tag {
      IS_CLICKED = 'IS_CLICKED',
      IS_LAYERED = 'IS_LAYERED',
      // static backgrounds/tilemaps
      IS_STATIC = 'IS_STATIC',
      // to be unrendered
      IS_HIDDEN = 'IS_HIDDEN',
      IS_ANIMATING = 'IS_ANIMATING'
    }
  }
}

export default RenderPlugin;

export * from './components';
export * from './lib';
export * from './actions';
export type * from './managers';
