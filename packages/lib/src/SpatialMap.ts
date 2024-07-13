import type { Dimensions, Vector2 } from '@gecs/types';
import type { Entity } from 'gecs';

import { isObstacle, isObstruction, isSamePoint } from '@gecs/utils';

import { Vector2Array } from './Vector2Array';

interface SpatialEntity extends Entity {
  $: {
    position: Vector2;
    collision: {
      value: number;
    };
  };
}

export class SpatialMap {
  protected content!: Vector2Array<SpatialEntity[]>;

  public resize(size: Dimensions): void {
    this.content = new Vector2Array(size, []);
  }

  public isObstacle(point: Vector2): boolean {
    const entities = this.content.get(point) ?? [];
    return entities.length === 0 || entities.some(e => isObstacle(e.$.collision?.value));
  }

  public isBlocked(point: Vector2): boolean {
    const entities = this.content.get(point) ?? [];
    return (
      entities.length === 0 ||
      entities.some(
        e => isObstacle(e.$.collision?.value) || isObstruction(e.$.collision?.value)
      )
    );
  }

  public isObstruction(point: Vector2): boolean {
    const entities = this.content.get(point) ?? [];
    return entities.length === 0 || entities.some(e => isObstruction(e.$.collision?.value));
  }

  public get<T extends SpatialEntity>(point: Vector2): T[] {
    return (this.content.get(point) ?? []) as T[];
  }

  public add<T extends SpatialEntity>(entity: T): void {
    this.set(entity.$.position, entity);
  }

  public remove(entity: SpatialEntity): void {
    const point = entity.$.position;
    const all = this.content.get(point) ?? [];
    this.content.set(
      point,
      all.filter(e => entity.id !== e.id)
    );
  }

  public move(entity: SpatialEntity, to: Vector2): void {
    this.remove(entity);
    this.set(to, entity);
  }

  public *entries(): IterableIterator<[Vector2, SpatialEntity]> {
    for (const [point, entities] of this.content.entries()) {
      for (const entity of entities) {
        yield [point, entity];
      }
    }
  }

  public clear(): void {
    this.content.clear();
  }

  public *values(): IterableIterator<SpatialEntity> {
    for (const entities of this.content.values()) {
      yield* entities;
    }
  }

  protected set<T extends SpatialEntity>(point: Vector2, entity: T): void {
    const got = this.content.get(point) ?? [];
    if (!isSamePoint(point, entity.$.position)) {
      entity.$.position.x = point.x;
      entity.$.position.y = point.y;
    }
    this.content.set(point, [...got, entity]);
  }

  public constructor(size: Dimensions) {
    this.resize(size);
  }
}
