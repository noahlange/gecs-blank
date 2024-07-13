import type { Context } from 'gecs';

export type BoundCommands = {
  [K in keyof $.Commands]?: $.Commands[K] extends $EvilFunction
    ? (ctx: Context<$.Plugins>, ...args: Parameters<$.Commands[K]>) => ReturnType<$.Commands[K]>
    : never;
};

export type BoundEvents = {
  [K in keyof $.Events]?: $.Events[K] extends $EvilFunction
    ? OfOrArrayOf<
        (ctx: Context<$.Plugins>, ...args: Parameters<$.Events[K]>) => ReturnType<$.Events[K]>
      >
    : never;
};
