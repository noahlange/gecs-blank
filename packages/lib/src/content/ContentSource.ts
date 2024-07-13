import type { DataObject, Identifier } from '@gecs/types';

export interface ContentSource {
  add(file: string, entry: DataObject): Promise<void>;
  getAll<T extends DataObject>(file: string, ids?: Identifier[]): Promise<T[]>;
  get<T extends DataObject>(file: string, id: Identifier): Promise<T>;
  start: () => Promise<void>;
  get files(): string[];
}
