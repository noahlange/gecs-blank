import type {
  ComponentClass,
  Context,
  EntityClass,
  PluginData as GecsPluginData,
  SystemType
} from 'gecs';

import { Plugin as GecsPlugin } from 'gecs';

import { Logger } from './Logger';

export interface PluginClass {
  readonly type: string;
  new (context: Context<$.Plugins>): Plugin;
}

export interface PluginData extends GecsPluginData<$.Plugins> {
  entities?: EntityClass[] | Record<string, EntityClass>;
  components?: ComponentClass[] | Record<string, ComponentClass>;
  tags?: string[];
  events?: Partial<$.Events>;
  state?: Record<string, unknown>;
  systems?: SystemType<$.Plugins>[];
  commands?: Partial<$.Commands>;
}

export class Plugin extends GecsPlugin<$.Plugins> {
  public static logger = new Logger();
  public static current: string | null = null;

  public declare $?: PluginData;
  public declare ctx: Context<$.Plugins>;

  protected name: string = this.constructor.name.replace(/Plugin$/, '');

  public log(...args: $AnyEvil[]): void {
    Plugin.logger.log(this.name, ...args);
  }
}
