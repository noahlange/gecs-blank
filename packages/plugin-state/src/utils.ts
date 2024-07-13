import type { State } from './lib';

/**
 * Mark a given function as forcing a Preact re-render
 */
export function update<T extends State, V extends T[keyof T] & ((...args: $AnyOK[]) => $AnyOK)>(
  target: T,
  key: string | symbol,
  property: TypedPropertyDescriptor<V>
): TypedPropertyDescriptor<V> {
  const original = property.value as V;
  const value = function (this: State, ...args: Parameters<V>): ReturnType<V> {
    const res = original.apply(this, args);
    if (res instanceof Promise) {
      return res.then(async val => {
        this.ctx.$.events.emit('state.update', this);
        return val;
      }) as ReturnType<V>;
    } else {
      this.ctx.$.events.emit('state.update', this);
      return res;
    }
  } as V;

  property.value = value;

  return property;
}
