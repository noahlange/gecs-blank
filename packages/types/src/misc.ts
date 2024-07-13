import type { DataType, Entity, EntityClass } from 'gecs';
import type { JSONSchema7Definition } from 'json-schema';

export type Identifier = string | number;
export type Identifiable<T> = { id: Identifier } & T;
export type EntityData<T extends Entity> = T extends Entity<infer R> ? R : never;
export type DataObject = UIO & { src?: string };

export interface Prefab<T extends EntityClass = EntityClass> {
  id?: string;
  entity: T;
  tags: string[];
  data: DataType<T>;
  events?: Record<string, string>;
  extends?: string[];
}

export interface NamedPrefab<
  T extends EntityClass & { name: string } = EntityClass & { name: string }
> {
  id?: string;
  extends?: string[];
  entity: T['name'];
  tags: string[];
  data: DataType<T>;
}

export interface JSONPrefab {
  id: string;
  entity: string;
  tags: string[];
  data: Record<string, $AnyEvil>;
  extends?: string[];
  src?: string;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Bounds {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

// unknown identifiable object
export type UIO = { id: Identifier } & (Record<string, unknown> | object);

export interface Schema {
  [key: string]: JSONSchema7Definition;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface Vector3 extends Vector2 {
  z: number;
}

export interface ScreenVector2 extends Vector2 {
  [__brand__]: 'screen';
}

export interface ScreenVector3 extends Vector3 {
  [__brand__]: 'screen';
}
