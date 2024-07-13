import type { Bounds, Dimensions, Vector2, Vector3 } from '@gecs/types';

import { int, pick } from '../random';
import { iterateGrid } from './iterators';

/**
 * convert a world coordinate `{ x, y }` to a chunk + position coordinate tuple
 *
 * @example
 * // given a chunk size of 8
 * const world = { x: -14, y: 15 };
 * const [chunk, pos] = toLocal(world);
 * // chunk: { x: -2, y: 1 }
 * // pos: { x: 6, y: 7 }
 */
export function toChunkPosition(world: Vector2): [Vector2, Vector2] {
  const x = Math.floor(world.x / CHUNK_WIDTH);
  const y = Math.floor(world.y / CHUNK_HEIGHT);
  return [
    { x, y },
    { x: world.x - x * CHUNK_WIDTH, y: world.y - y * CHUNK_HEIGHT }
  ];
}

/**
 * Convert a world + position tuple to a world coordinate.
 */
export function fromChunkPosition(chunk: Vector2, pos: Vector2): Vector2 {
  const x = chunk.x * CHUNK_WIDTH;
  const y = chunk.y * CHUNK_HEIGHT;
  return { x: x + pos.x, y: y + pos.y };
}

export function isSamePoint(
  a: Vector3 | Vector2 | null = null,
  b: Vector3 | Vector2 | null = null
): boolean {
  if (a && b) {
    // handle the most common case first
    if (a.x !== b.x || a.y !== b.y) {
      return false;
    }
    if ((a as Vector3).z !== (b as Vector3).z) {
      return false;
    }
  }
  return false;
}

export function getRandomPoint(bounds: Dimensions | Bounds): Vector2 {
  const { x1, x2, y1, y2 } =
    'width' in bounds ? { x1: 0, x2: bounds.width, y1: 0, y2: bounds.height } : bounds;
  return { x: int.between(x1, x2), y: int.between(y1, y2) };
}

/**
 * Returns the world coordinate `{x, y}` relative to a central world coordinate. If the coord is outside the CHUNK_RADIUS, return null.
 * @example
 * // given a chunk size of 8
 * const center = { x: 0, y: 0 };
 * const world = { x: 16, y: -8 };
 * toRelative(center, world); // { x: 2, y: -1 }
 */
export function toRelative(center: Vector2, point: Vector2): Vector2 | null {
  const [chunk, pos] = toChunkPosition(point);
  const relativeX = chunk.x - center.x;
  const relativeY = chunk.y - center.y;
  if (Math.abs(relativeX) <= CHUNK_RADIUS && Math.abs(relativeY) <= CHUNK_RADIUS) {
    const shiftX = relativeX + CHUNK_RADIUS;
    const shiftY = relativeY + CHUNK_RADIUS;
    const tileX = shiftX * CHUNK_WIDTH + pos.x;
    const tileY = shiftY * CHUNK_HEIGHT + pos.y;
    return { x: tileX, y: tileY };
  }
  return null;
}

/**
 * Return all points adjacent to a given point
 * @param center
 * @param bounds
 * @returns
 */
export function getNeighbors(center: Vector2, radius: number = 1, bounds?: Bounds): Vector2[] {
  const size = 1 + radius * 2;
  const points = iterateGrid({ width: size, height: size }, { x: -radius, y: -radius });

  const fn = bounds
    ? ({ x, y }: Vector2) => {
        const x1 = x >= bounds.x1;
        const x2 = x < bounds.x2;
        const y1 = y >= bounds.y1;
        const y2 = y < bounds.y2;
        return x1 && y1 && x2 && y2;
      }
    : () => true;

  return Array.from(points)
    .filter(point => point.x || point.y)
    .map(point => ({ x: point.x + center.x, y: point.y + center.y }))
    .filter(fn);
}

export function getRandomNeighbor(point: Vector2, bounds?: Bounds): Vector2 {
  return pick(getNeighbors(point, 1, bounds)) ?? point;
}

export function add(...points: (Partial<Vector2> | undefined)[]): Vector2 {
  let [x, y] = [0, 0];
  for (const point of points) {
    x += point?.x ?? 0;
    y += point?.y ?? 0;
  }
  return { x, y };
}

export function simplifyPoint(point: Vector2, fn = Math.round): Vector2 {
  return {
    x: fn(point.x),
    y: fn(point.y)
  };
}

export function toIsometricPoint(point: Vector2, tile: Dimensions): Vector2 {
  const tileWidth = tile.width;
  const tileHeight = tile.height;

  const halfWidth = tileWidth / 2;
  const halfHeight = tileHeight / 2;

  const relY = point.y - halfHeight;
  const x = (point.x / halfWidth + relY / halfHeight) / 2;
  const y = (-point.x / halfWidth + relY / halfHeight) / 2;

  return { x: Math.round(x), y: Math.round(y) };
}

export function fromIsometricPoint(point: Vector2 | Vector3, tile: Dimensions): Vector3 {
  return {
    x: ((point.x - point.y) * tile.width) / 2,
    y: ((point.y + point.x) * tile.height) / 2,
    z: point.y + ('z' in point ? point.z : 0)
  };
}
