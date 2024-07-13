import type { Context } from 'gecs';

export abstract class Manager {
  protected ctx: Context<$.Plugins>;
  public constructor(ctx: Context<$.Plugins>) {
    this.ctx = ctx;
  }
}
