import type { Bounds, Vector2 } from '@gecs/types';
import type { Position, Size } from '@gecs/plugin-core';
import type { EntityType } from 'gecs';

export function intersects(a: Bounds | null = null, b: Bounds | null = null): boolean {
  return !!(
    a &&
    b &&
    Math.max(a.x1, b.x1) < Math.min(a.x2, b.x2) &&
    Math.max(a.y1, b.y1) < Math.min(a.y2, b.y2)
  );
}

function getBounds(entity: EntityType<[typeof Position], [typeof Size]>): Bounds {
  const { position: point, size } = entity.$;
  const { width, height } = size ?? { width: 1, height: 1 };
  return { x1: point.x, y1: point.y, x2: point.x + width, y2: point.y + height };
}

export function entityIntersects(
  entity: EntityType<[typeof Position], [typeof Size]>,
  point: Vector2,
  radius = 1
): boolean {
  return intersects(getBounds(entity), {
    x1: point.x - radius,
    y1: point.y - radius,
    x2: point.x + radius,
    y2: point.y + radius
  });
}

export function delta(a: Vector2, b: Vector2): Vector2 {
  return { x: b.x - a.x, y: b.y - a.y };
}

export * from './iterators';
export * from './vectors';
export * from './directions';
export * from './lines';
export * from './aoe';
