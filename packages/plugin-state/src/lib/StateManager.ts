import type { State, StateClass } from './State';

import { Manager } from '@gecs/lib';

import { BackgroundState } from './BackgroundState';

type Eventries = [keyof $.Events, $.Events[keyof $.Events]][];

export class StateManager extends Manager {
  public static readonly type = 'state';

  protected static getStateName(State: StateClass): string {
    return State.type ?? State.name;
  }

  public stack: State[] = [];
  public current: State | null = null;
  protected stateListeners: Record<string, Partial<Record<keyof $.Events, string[]>>> = {};

  /**
   * Returns true if an instance of a particular state exists in the stack.
   * @param State - a State constructor
   * @returns
   */
  public has<T extends StateClass>(State: T): boolean {
    return this.stack.some(stack => stack instanceof State);
  }

  /**
   * Return the first instance of a state in the stack.
   * @param State - a State constructor.
   * @returns
   */
  public get<T extends StateClass>(State: T): InstanceType<T> | null {
    return (this.stack.find(s => s instanceof State) as InstanceType<T>) ?? null;
  }

  /**
   * Push a new scene onto the stack, pausing the current scene.
   * @param State
   * @param props
   */
  public async push<T extends {} = {}>(State: StateClass<T>, props: T): Promise<void> {
    if (this.current) {
      // remove event listeners if the state isn't running in the background
      if (!(this.current instanceof BackgroundState)) {
        this.removeEventListeners(this.current);
      }
      // ...and pause it.
      await this.current.pause?.();
    }

    await this.begin(State, props);
  }

  /**
   * If the state is currently active, pop it. If it isn't, push it.
   * @param State - State constructor
   */
  public async toggle<T extends {} = {}>(State: StateClass<T>, props: T): Promise<void> {
    return this.current instanceof State ? this.pop() : this.push(State, props);
  }

  /**
   * Stop the current scene and remove it from the stack, resuming whichever
   * scene was running beforehand.
   */
  public async pop(): Promise<void> {
    await this.end();
    await this.resume();
  }

  /**
   * Stop the current state and push a new state.
   * @remarks
   * This is the same as `push()`, but it removes the current item from the stack.
   */
  public async swap<T extends {} = {}>(State: StateClass<T>, props: T): Promise<void> {
    await this.end();
    await this.begin(State, props);
  }

  protected async begin<T extends {} = {}>(State: StateClass<T>, props: T): Promise<void> {
    this.ctx.$.state.log(
      `%cStateManager`,
      'color:gray;',
      `start "${StateManager.getStateName(State)}"`
    );
    this.current = new State(this.ctx);
    this.current.props = props;
    this.addEventListeners(this.current);
    this.stack.push(this.current);
    // start the new scene
    this.current.start?.();
    this.ctx.$.events.emit('state.start', this.current);
  }

  protected async end(): Promise<void> {
    this.ctx.$.state.log(
      `stop   "${StateManager.getStateName(this.current?.constructor as StateClass)}"`
    );
    // if a state is running, pop it an' stop it
    if (this.current) {
      this.current.stop?.();
      this.stack.pop();
      // remove its event listeners
      this.removeEventListeners(this.current);
      this.ctx.$.events.emit('state.stop', this.current);
    }
  }

  protected async resume(): Promise<void> {
    // resume the current scene (if it exists)
    const scene = this.stack[this.stack.length - 1];
    this.current = scene ?? null;
    if (this.current) {
      const curr = this.current.constructor as StateClass;
      this.ctx.$.state.log(`resume "${StateManager.getStateName(curr)}"`);
      // if it isn't a background state, we removed its event listeners when it was paused
      if (!(this.current instanceof BackgroundState)) {
        this.addEventListeners(this.current);
      }
      await this.current.resume?.();
      this.ctx.$.events.emit('state.resume', this.current);
    }
  }

  protected addEventListeners(state: State): void {
    const events: Partial<$.Events> = state.events ?? {};
    const handles = (this.stateListeners[state.id] ??= {});
    for (const [key, handler] of Object.entries(events) as Eventries) {
      const handle = this.ctx.$.events.on(key, handler!);
      handles[key] = (handles[key] ?? []).concat(handle!);
    }
    this.stateListeners[state.id] = handles;
  }

  protected removeEventListeners(state: State): void {
    for (const handles of Object.values(this.stateListeners[state.id])) {
      for (const handle of handles ?? []) {
        this.ctx.$.events.off(handle);
      }
    }
  }
}
