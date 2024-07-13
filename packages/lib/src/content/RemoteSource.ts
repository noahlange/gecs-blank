import type { Identifier } from 'gecs/src/types';
import type { ContentSource } from './ContentSource';
import type { DataObject } from '@gecs/types/src';

export class RemoteSource implements ContentSource {
  protected get base() {
    return `${this.host}/api`;
  }

  public async getAll(file: string, ids?: Identifier[]) {
    const base = `${this.base}/content/${file}`;
    const url = ids ? `${base}/content/?${ids.map(id => `id=${id}`).join('&')}` : base;
    return fetch(url).then(res => res.json());
  }

  public async get(file: string, id: Identifier) {
    const response = await fetch(`${this.base}/content/${file}/${id}`);
    return await response.json();
  }

  public async add(file: string, entry: DataObject): Promise<void> {
    await fetch(`${this.base}/content/${file}`, {
      method: 'POST',
      body: JSON.stringify(entry)
    });
  }

  public files: string[] = [];

  public async start(): Promise<void> {
    const res = await fetch(`${this.base}/files`);
    this.files = await res.json();
  }

  constructor(public host: string) {}
}
