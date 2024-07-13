import type { State } from './lib';

import { StatePlugin } from './StatePlugin';

declare global {
  namespace $ {
    export interface Plugins {
      [StatePlugin.type]: StatePlugin;
    }
    export interface Events {
      'state.start': (state: State) => void;
      'state.resume': (state: State) => void;
      'state.update': (state: State) => void;
      'state.stop': (state: State) => void;
    }
  }
}

export default StatePlugin;

export * from './lib';
export * from './utils';
