import { Entity, type Context } from 'gecs';
import { ActionEntity } from '../entities';

export enum ActionStatus {
  PENDING,
  PAUSED,
  ACTIVE,
  SUCCEEDED,
  CANCELED,
  FAILED
}

type ActionResolve<T> = { [Symbol.iterator](): Iterator<void, T> };

interface ActionConstructor<P extends unknown[]> {
  readonly MAX_TTL: number | null;
  new (...args: P): Action;
}

export abstract class Action {
  public static create<P extends unknown[]>(this: ActionConstructor<P>, ...args: P) {
    ActionEntity.create({
      action: { instance: new this(...args) },
      duration: { value: this.MAX_TTL ?? null }
    });
  }

  public static failed(action: Action): boolean;
  public static failed(action: ActionStatus): boolean;
  public static failed(action: Action | ActionStatus): boolean {
    return (action instanceof Action ? action._status : action) === ActionStatus.FAILED;
  }

  public static succeeded(action: Action): boolean;
  public static succeeded(action: ActionStatus): boolean;
  public static succeeded(action: Action | ActionStatus): boolean {
    return (action instanceof Action ? action._status : action) === ActionStatus.SUCCEEDED;
  }

  public static canceled(action: Action): boolean;
  public static canceled(action: ActionStatus): boolean;
  public static canceled(action: Action | ActionStatus): boolean {
    return (action instanceof Action ? action._status : action) === ActionStatus.CANCELED;
  }

  public static readonly MAX_TTL: number | null = null;

  protected static get ctx(): Context<$.Plugins> {
    return Entity.ctx as unknown as Context<$.Plugins>;
  }

  protected get ctx(): Context<$.Plugins> {
    return Entity.ctx as unknown as Context<$.Plugins>;
  }

  private _status = ActionStatus.PENDING;
  private _iterator: IterableIterator<unknown> | null = null;

  public get isActive(): boolean {
    return this._status === ActionStatus.ACTIVE;
  }

  public get isPending(): boolean {
    return this._status === ActionStatus.PENDING;
  }

  public get isPaused(): boolean {
    return this._status === ActionStatus.PAUSED;
  }

  public get isDone(): boolean {
    return this._status >= ActionStatus.SUCCEEDED;
  }

  public start(): void {
    if (this._status === ActionStatus.PAUSED) {
      this._status = ActionStatus.ACTIVE;
    }
  }

  public resume() {
    return this.start();
  }

  public pause() {
    this._status = ActionStatus.PAUSED;
  }

  public failure(message?: string) {
    if (message) console.warn(message);
    this._status = ActionStatus.FAILED;
  }

  public cancel() {
    this._status = ActionStatus.CANCELED;
  }

  public success() {
    this._status = ActionStatus.SUCCEEDED;
  }

  public await<T>(promise: Promise<T>): ActionResolve<T>;
  public await(ms: number): IterableIterator<void>;
  public *await<T>(value: number | Promise<T>): IterableIterator<void> | ActionResolve<T> {
    this.pause();
    if (typeof value === 'number') {
      setTimeout(() => {
        this.resume();
      }, value);
      return void 0;
    } else {
      let res: T | undefined | null = undefined;
      this.pause();
      value
        .then(done => {
          res = done ?? null;
          this.resume();
        })
        .catch(() => {
          res = null;
          this.resume();
        });

      while (res === undefined) yield;

      return res;
    }
  }

  public *[Symbol.iterator]() {
    do {
      if (this.isPending) {
        ActionEntity.create({ action: { instance: this }, duration: { value: null } });
      } else if (this.isDone) {
        return this._status;
      }
      yield;
    } while (true);
  }

  public step() {
    if (this._status === ActionStatus.PAUSED) return;
    this._iterator ??= this.run();
    const done = this._iterator.next().done;
    if (done) this._status = ActionStatus.SUCCEEDED;
    return done;
  }

  public abstract run(): IterableIterator<unknown>;
}
