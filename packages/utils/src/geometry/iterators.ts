import type { Bounds, Dimensions, Vector2 } from '@gecs/types';

type Griddable = Bounds | Dimensions | Vector2;

const isRect = (a: Griddable): a is Bounds => ((a as Bounds)?.x1 ?? null) !== null;

const isPoint = (a: Griddable): a is Vector2 => ((a as Vector2)?.x ?? null) !== null;

const isSize = (a: Griddable): a is Dimensions => ((a as Dimensions).width ?? null) !== null;

function getBounds(a: Griddable, b: Vector2 = { x: 0, y: 0 }): Bounds {
  if (isRect(a)) {
    return a;
  } else if (isSize(a)) {
    return { x1: b.x, y1: b.y, x2: b.x + a.width, y2: b.y + a.height };
  } else if (isPoint(a)) {
    return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
  } else {
    return { x1: 0, y1: 0, x2: 0, y2: 0 };
  }
}

/**
 * Given a rectangle, iterate through each point within.
 * @param rect - bounds
 * @param start - coordinate offset (optional, defaults to `{ x: 0, y: 0 }`)
 */
export function iterateGrid(rect: Bounds, start?: Vector2): IterableIterator<Vector2>;
/**
 * Given a width and height, iterate through each point inside the rectangle.
 * @param size - dimensions
 * @param start - offset (optional, defaults to `{ x: 0, y: 0 }`)
 */
export function iterateGrid(size: Dimensions, start?: Vector2): IterableIterator<Vector2>;
/**
 * Given two points (northwest/southeast), iterate through each point within bounds
 * @param start - start point
 * @param end - end point (excluded)
 */
export function iterateGrid(start: Vector2, end: Vector2): IterableIterator<Vector2>;
export function* iterateGrid(
  a: Dimensions | Vector2 | Bounds,
  b: Vector2 = { x: 0, y: 0 }
): IterableIterator<Vector2> {
  const { x1, x2, y1, y2 } = getBounds(a, b);
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      yield { x, y };
    }
  }
}
