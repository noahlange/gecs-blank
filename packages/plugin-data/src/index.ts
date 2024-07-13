import { DataPlugin } from './DataPlugin';

declare global {
  namespace $ {
    export interface Plugins {
      [DataPlugin.type]: DataPlugin;
    }
  }
}

export default DataPlugin;
