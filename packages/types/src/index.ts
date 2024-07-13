/// <reference types="vite/client" />

declare global {
  // eslint-disable-next-line
  type $AnyOK = any;
  type $AnyEvil = $AnyOK;
  type $EvilFunction = (...args: $AnyOK[]) => $AnyOK;
  type OfOrArrayOf<T> = T | T[];
  type OfOrPromiseOf<T> = T | Promise<T>;
  type UnwrapIterable<T> = T extends Iterable<infer R> ? R : never;
  interface ConstructorType<T extends new (...args: $AnyOK[]) => $AnyOK> {
    new (args: ConstructorParameters<T>): T;
  }

  const __brand__: unique symbol;

  // eslint-disable-next-line
  namespace $ {
    export interface Events {}
    export interface Commands {}
    export interface Plugins {}
    export interface Actions {}

    export enum Cursor {}
    export enum Tag {}
    export enum Action {}
  }
}

globalThis.$ = { Tag: {}, Action: {}, Cursor: {} };

export * from './misc';
export * from './enums';
export * from './bound';
export * as schema from './schema';
