import { System } from 'gecs';

type Eventries = [keyof $.Events, $.Events[keyof $.Events]];

/**
 * Register event listeners attached to plugins.
 */
export class PluginSystem extends System<$.Plugins> {
  public start() {
    for (const plugin of Object.values(this.ctx.$)) {
      const events: Partial<$.Events> = plugin.$?.events ?? {};
      for (const [key, fn] of Object.entries(events) as Eventries[]) {
        this.ctx.$.events.on(key as keyof $.Events, fn);
      }
    }
  }
}
