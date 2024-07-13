import type { PluginData } from '@gecs/lib';

import { Plugin } from '@gecs/lib';

import * as components from './components';
import * as entities from './entities';
import { load, render, update } from './systems';
import { AudioManager, ConfigManager, FileSystemManager, LogManager } from './managers';

export class CorePlugin extends Plugin {
  public static readonly type = 'core';

  static {
    for (const cursor of ['NONE', 'DEFAULT', 'POINTER', 'GRAB']) {
      // @ts-expect-error: evil global hack
      globalThis.$.Cursor[cursor] = cursor;
    }
  }

  public $: PluginData = {
    components,
    entities,
    tags: ['TO_DESTROY', 'TO_SERIALIZE', 'IS_ACTIVE', 'IS_STATIC', 'IS_PLAYABLE'],
    systems: [load.on, update.on, update.post, render.post]
  };

  public fs: FileSystemManager = new FileSystemManager(this.ctx);
  public audio: AudioManager = new AudioManager(this.ctx);
  public config: ConfigManager = new ConfigManager(this.ctx);
  public messages: LogManager = new LogManager(this.ctx);

  public queries = {
    duration: this.ctx.query.components(components.Duration)
  };
}
