import { UIPlugin } from './UIPlugin';

declare global {
  namespace $ {
    export interface Plugins {
      [UIPlugin.type]: UIPlugin;
    }
  }
}

export default UIPlugin;

export { Game, useGameContext, GameContext } from './ui';
