import type { DataObject, Identifier } from '@gecs/types';

import { IDBSource, Plugin, type ContentSource } from '@gecs/lib';

import { ScriptManager } from './lib/ScriptManager';

export class DataPlugin extends Plugin {
  public static readonly type = 'data';
  protected content: ContentSource = new IDBSource();
  protected scripts = new ScriptManager(this.ctx);

  public async get<T extends DataObject>(file: string, ids: Identifier[]): Promise<T[]>;
  public async get<T extends DataObject>(file: string, id: Identifier): Promise<T>;
  public async get<T extends DataObject>(file: string): Promise<T[]>;
  public async get<T extends DataObject>(
    file: string,
    id?: Identifier | Identifier[]
  ): Promise<T | T[]> {
    if (id) {
      return Array.isArray(id)
        ? (this.content.getAll(file, id) as Promise<T[]>)
        : (this.content.get(file, id) as Promise<T>);
    }
    return this.content.getAll(file) as Promise<T[]>;
  }

  public getScript(name: string): Promise<$EvilFunction> {
    return this.scripts.getCompiled(name.replace(/^(?:scripts)\./gim, ''));
  }

  public async runScript(name: string): Promise<void> {
    return this.getScript(name).then(fn => fn());
  }

  public add<T extends DataObject>(file: string, entry: T): Promise<void> {
    return this.content.add(file, entry);
  }

  public get files(): string[] {
    return this.content.files;
  }

  public async start(): Promise<void> {
    // load content
    await this.content.start();
    await this.scripts.load();
  }
}
