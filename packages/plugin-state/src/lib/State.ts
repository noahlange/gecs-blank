import type { Context } from 'gecs';

import { nanoid } from 'nanoid';

import { BackgroundState } from './BackgroundState';

export interface StateClass<T extends {} = {}> {
  type: string;
  new (ctx: Context<$.Plugins>): State<T>;
}

/**
 * A State is a game 'mode'. States are arranged in a stack; at any given point,
 * only one State is active. States have a handful of methods: `start()`,
 * `tick()` and `render()` are the most important.
 */
export class State<T extends {} = {}> {
  /**
   * Human-identifiable string used as the state's className in the UI.
   */
  public static readonly type: string;

  public id: string = nanoid(6);
  public props!: T;

  /**
   * A State can provide event listeners that are registered/unregistered on
   * start/end and resume/pause.
   */
  public events: Partial<$.Events> = {};

  protected ctx: Context<$.Plugins>;

  /**
   * Whether or not the state is at the top of the stack.
   */
  public get active(): boolean {
    return this === this.ctx.$.state.current || this instanceof BackgroundState;
  }

  /**
   * Returns a Preact node rendered in the game's UI.
   */
  public render?(): JSX.Element | null;

  /**
   * Runs each tick while the state is active.
   */
  public tick?(d: number, ts: number): OfOrPromiseOf<void>;

  /**
   * Method invoked when the state starts; sometimes takes a `props` argument
   * that provides relevant data for the scene and passed to `state.push()`.
   */
  public start?(): OfOrPromiseOf<void>;

  /**
   * Invoked when the state is popped.
   */
  public stop?(): OfOrPromiseOf<void>;

  /**
   * Invoked when a new state is pushed on top of this one.
   */
  public pause?(): OfOrPromiseOf<void>;

  /**
   * Invoked when a previously-active scene reaches the top of the stack.
   */
  public resume?(): OfOrPromiseOf<void>;

  public constructor(ctx: Context<$.Plugins>) {
    this.ctx = ctx;
  }
}
