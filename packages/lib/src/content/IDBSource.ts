import type { DataObject, Identifier } from '@gecs/types';
import type { IDBPDatabase } from 'idb';

import { deleteDB, openDB } from 'idb/with-async-ittr';
import { nanoid } from 'nanoid';

import { _ } from '@gecs/utils';
import type { ContentSource } from './ContentSource';

export class IDBSource implements ContentSource {
  protected db!: IDBPDatabase;
  protected content: $AnyOK;

  public async add(file: string, entry: DataObject): Promise<void> {
    const id = entry.id ?? nanoid();
    this.db.add(file, entry, id);
  }

  public get files(): string[] {
    return Object.keys(this.content).filter(file => file !== 'meta');
  }

  public async getAll<T extends DataObject>(file: string, ids?: Identifier[]): Promise<T[]> {
    if (Array.isArray(ids) && ids.length) {
      const t = this.db.transaction(file, 'readonly');
      const store = t.objectStore(file);
      const res = await _.settled(ids.map(id => store.get(id)));
      await t.done;
      return res;
    } else if (!ids) {
      return this.db.getAll(file);
    }
    return [];
  }

  public async get<T extends DataObject>(file: string, key: Identifier): Promise<T> {
    return this.db.get(file, key);
  }

  public async load(): Promise<void> {
    const txs = [];
    for (const storeName in this.content) {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      for (const id in this.content[storeName]) {
        store.add(this.content[storeName][id] ?? {}, id);
      }
      txs.push(tx.done);
    }
    await Promise.all(txs);
  }

  public unload(): void {
    return this.db.close();
  }

  public async connect(): Promise<void> {
    this.db = await openDB('game', 1);
  }

  public async create(): Promise<void> {
    const content = (this.content = await fetch('/content.json').then(res => res.json()));
    await deleteDB('game');
    this.db = await openDB('game', 1, {
      upgrade(database) {
        for (const store in content ?? {}) {
          database.createObjectStore(store);
        }
      }
    });
  }

  async start() {
    await this.create();
    await this.load();
  }
}
