import { EventsPlugin } from './EventsPlugin';

declare global {
  namespace $ {
    export interface Plugins {
      [EventsPlugin.type]: EventsPlugin;
    }
    export interface Events {}
  }
}

export default EventsPlugin;
