import type { Entity, EntityClass } from 'gecs';

import deepmerge from 'deepmerge';

export function keys<T extends object, K extends keyof T>(object: T): K[] {
  return Object.keys(object) as K[];
}

export function values<T extends object, K extends keyof T>(object: T): T[K][] {
  return Object.values(object);
}

export function entries<T extends object, K extends keyof T>(object: T): [K, T[K]][] {
  return Object.entries(object) as [K, T[K]][];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function filter<T>(value: (T | undefined | null)[]): T[] {
  return value.filter(f => (f ?? null) !== null) as T[];
}

export function set<T>(object: T, path: string, value: unknown): T {
  const parts = path.split('.');
  const prop = parts.pop()!;
  let next: $AnyEvil = object;
  for (const part of parts) {
    next = next[part] ??= {};
  }
  next[prop] = merge(next[prop], value as Record<string, unknown>);
  return object;
}

export function withSign(value: number): string {
  return value >= 0 ? `+${value.toString()}` : value.toString();
}

export function classNames(
  obj: Record<string, unknown> | (string | null | undefined)[]
): string {
  return filter(Array.isArray(obj) ? obj : keys(obj).filter(key => !!obj[key])).join(' ');
}

export function merge<T extends object>(obj: T, ...data: Partial<T>[]): T {
  return data.reduce((a: T, b) => (typeof b === 'object' ? deepmerge(a, b) : b), obj);
}

/**
 * A simple range function with an optional map function. Given numbers `a` and `b` (in an
 * arbitrary order), return `a..b`.
 */
export function range(a: number, b: number): IterableIterator<number>;
export function range<T>(a: number, b: number, fn: (i: number) => T): IterableIterator<T>;
export function* range<T>(a: number, b: number, fn?: (i: number) => T): IterableIterator<T> {
  let i = a;
  while (b > a ? i++ < b : i-- > b) {
    yield (fn?.(i) ?? i) as T;
  }
}

export function isEntityOfType<A extends Entity, B extends EntityClass>(
  a: A,
  b: B
): a is A & InstanceType<B> {
  return a instanceof b;
}

export function arrayOf<T>(o: T | T[]): T[] {
  return Array.isArray(o) ? o.slice() : [o];
}

export async function settled<T>(values: Promise<T>[]): Promise<T[]> {
  const settled = await Promise.allSettled(values);
  return settled.flatMap(item => (item.status === 'fulfilled' ? item.value : []));
}
