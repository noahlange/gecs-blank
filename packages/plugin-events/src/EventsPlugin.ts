import type { PluginData } from '@gecs/lib';
import type { EventsMap, Unsubscribe } from 'nanoevents';

import { createNanoEvents } from 'nanoevents';
import { nanoid } from 'nanoid';

import { Plugin } from '@gecs/lib';

import { PluginSystem } from './systems/PluginSystem';

type EventHandle = string;

export class EventsPlugin<T extends EventsMap = $.Events> extends Plugin {
  public static readonly type = 'events';

  public $: PluginData = {
    systems: [PluginSystem, ctx => ctx.$.events.tick()]
  };

  protected queue: [keyof T, Parameters<T[keyof T]>][] = [];
  protected emitter = createNanoEvents<T>();
  protected unsubscriptions: Partial<Record<string, Unsubscribe>> = {};
  protected byEvent: Partial<Record<keyof T, EventHandle[]>> = {};

  /**
   * Add an event listener for a specific event
   */
  public on<K extends keyof T>(event: K, callback: T[K]): EventHandle {
    const fn = ((...args: $AnyOK[]) => (callback(...args), this.ctx.manager.tick())) as T[K];
    const handle = nanoid();
    this.unsubscriptions[handle] = this.emitter.on(event, fn);
    this.byEvent[event] = (this.byEvent[event] ??= [] as EventHandle[]).concat(handle);
    return handle;
  }

  /**
   * Remove all listeners for an event.
   */
  public off<K extends keyof T>(event: K): void;
  /**
   * Remove an event with the given handle.
   */
  public off(handle: EventHandle): void;
  public off<K extends keyof T>(event: K | EventHandle): void {
    const handles = this.byEvent[event] ?? [event as string];
    for (const handle of handles) {
      this.unsubscriptions[handle]?.();
    }
  }

  /**
   * Queue an event to be emitted on the next tick.
   */
  public emit<K extends keyof T>(event: K, ...args: Parameters<T[K]>): void {
    this.queue.push([event, args]);
  }

  /**
   * Emit all queued events and clear the queue.
   */
  public tick() {
    const events = this.queue.slice();
    this.queue = [];
    for (const [event, args] of events) {
      this.emitter.emit(event, ...args);
    }
  }
}
