import type { State } from './lib';
import type { StateClass } from './lib/State';

import { Phase, phase } from 'gecs';

import { Plugin } from '@gecs/lib';

import { StateManager } from './lib/StateManager';
import { StateSystem } from './systems/StateSystem';

export class StatePlugin extends Plugin {
  public static readonly type = 'state';

  public $ = {
    systems: [phase(Phase.ON_UPDATE - 1, StateSystem)]
  };

  public get stack(): readonly State[] {
    return this.manager.stack;
  }

  public get current(): State | null {
    return this.manager.current;
  }

  public paused: boolean = false;
  protected manager = new StateManager(this.ctx);

  public async pause(ms: number): Promise<void> {
    this.paused = true;
    return new Promise(resolve =>
      setTimeout(() => {
        this.paused = false;
        resolve();
      }, ms)
    );
  }

  /**
   * Returns true if the current state is an instance of State.
   * @param State - a State constructor
   */
  public is<T extends StateClass>(State: T): boolean {
    return this.manager.current instanceof State;
  }

  /**
   * Returns true if an instance of a particular State exists in the stack.
   * @param State - a State constructor
   * @returns
   */
  public has<T extends StateClass>(State: T): boolean {
    return this.manager.has(State);
  }

  /**
   * Return the first instance of a state in the stack.
   * @param State - a State constructor
   * @returns
   */
  public get<T extends StateClass>(State: T): InstanceType<T> {
    const res = this.manager.get(State);
    if (!res) {
      throw new Error(`No running state of type '${State.type}.`);
    }
    return res;
  }

  /**
   * Push a new scene onto the stack, pausing the current scene.
   * @param State - a State constructor
   * @param props - initial props for the newly-created state instance
   */
  public push<T extends {} = {}>(State: StateClass<T>, props?: T): Promise<void> {
    return this.manager.push(State, props!);
  }

  /**
   * If the state is currently active, pop it. If it isn't, push it.
   * @param State - State constructor
   */
  public toggle<T extends {} = {}>(State: StateClass<T>, props: T): Promise<void> {
    return this.manager.toggle(State, props);
  }

  /**
   * Stop the current scene and remove it from the stack, resuming whichever
   * scene was running beforehand.
   */
  public pop(): Promise<void> {
    return this.manager.pop();
  }

  /**
   * Stop the current state and push a new state.
   * @remarks
   * This is the same as `push()`, but it removes the current item from the stack.
   */
  public swap<T extends {} = {}>(State: StateClass<T>, props: T): Promise<void> {
    return this.manager.swap(State, props);
  }
}
