/* eslint-disable max-classes-per-file */

import 'vite/client';

declare module '@pixi-essentials/object-pool' {
  export class ObjectPoolFactory {
    public static build<T>(constructor: { new (): T }): ObjectPool<T>;
  }

  class ObjectPool<T> {
    public allocate(): T;
    public release(object: T): void;
    public reserve(count: number): void;
    public startGC(): void;
  }
}
