import type { ScreenVector2 } from '@gecs/types';
import type EventsPlugin from '@gecs/plugin-events';
import type { EntityType } from 'gecs';
import type { GameID, Interact, Position, Text, Trigger } from './components';
import type { ActorEntity } from './entities';

import { CorePlugin } from './CorePlugin';

export enum MetaButton {
  META = 0b0001,
  ALT = 0b0010,
  CTRL = 0b0100,
  SHIFT = 0b1000
}

export enum PointerButton {
  M1 = 0b001,
  M2 = 0b010,
  M3 = 0b100
}

interface InputEvent {
  meta: number;
  ts: number;
}

export interface InputWheelEvent extends InputEvent {
  type: 'wheel';
  deltaX: number;
  deltaY: number;
}

export interface InputPointerEvent extends InputEvent {
  type: 'move' | 'm1' | 'm2' | 'm3';
  screen: ScreenVector2;
}

export interface InputButtonEvent extends InputEvent {
  type: 'press' | 'down' | 'up';
  key: string;
}

export type Interactor = EntityType<
  [typeof Interact, typeof GameID],
  [typeof Position, typeof Text]
>;

export type Interactive = EntityType<
  [typeof Interact, typeof Trigger, typeof GameID],
  [typeof Position, typeof Text]
>;

declare global {
  namespace $ {
    export interface Plugins {
      [CorePlugin.type]: CorePlugin;
      [EventsPlugin.type]: EventsPlugin;
    }

    export enum Tag {
      TO_DESTROY = 'TO_DESTROY',
      IS_PLAYABLE = 'IS_PLAYABLE',
      TO_SERIALIZE = 'TO_SERIALIZE',
      // active in the current world context
      IS_ACTIVE = 'IS_ACTIVE',
      IS_CAMERA = 'IS_CAMERA',
      IS_ANIMATED = 'IS_ANIMATED'
    }

    export enum Cursor {
      NONE = 'NONE',
      DEFAULT = 'DEFAULT',
      POINTER = 'POINTER',
      GRAB = 'GRAB',
      DOOR = 'DOOR',
      MOVE = 'MOVE'
    }

    export interface Events {
      'core.input.button': (event: InputButtonEvent) => void;
      'core.input.wheel': (event: InputWheelEvent) => void;
      'core.input.pointer': (event: InputPointerEvent) => void;
      'game.interact.actor': (actor: ActorEntity, entity: Interactor) => void;
      'game.interact.trigger': (actor: ActorEntity, entity: Interactive) => void;
    }
  }
}

export default CorePlugin;

export * from './components';
export * from './entities';
export * from './lib/Action';

export * as utils from './utils';
export { MessageType, type LogMessage } from './managers/LogManager';
