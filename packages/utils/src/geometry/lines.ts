import type { Vector2 } from '@gecs/types';

export function distance(a: Vector2, b: Vector2): number {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

/**
 * Bresenham's line algorithm. Ported from the pseudocode on Wikipedia.
 * @param a Start point.
 * @param b End point.
 * @returns Array of points in line from `a` to `b`.
 */
export function getLine(a: Vector2, b: Vector2): Vector2[] {
  const [x0, y0, x1, y1] = [a.x, a.y, b.x, b.y];
  const [dx, dy] = [Math.abs(x1 - x0), -Math.abs(y1 - y0)];
  const [sx, sy] = [x0 < x1 ? 1 : -1, y0 < y1 ? 1 : -1];

  let [x, y, e] = [x0, y0, dx + dy];
  const points: Vector2[] = [];

  while (!(x === x1 && y === y1)) {
    points.push({ x, y });

    const e2 = 2 * e;

    if (e2 >= dy) {
      if (x === x1) {
        break;
      }
      e += dy;
      x += sx;
    }

    if (e2 <= dx) {
      if (y === y1) {
        break;
      }
      e += dx;
      y += sy;
    }
  }

  points.push({ x, y });
  return points;
}
export function* getPathCosts(path: Vector2[]): IterableIterator<number> {
  for (let i = 0; i < path.length - 1; i++) {
    yield Math.round(distance(path[i], path[i + 1]) * 2);
  }
}

export function getPathCost(path: Vector2[]): number {
  return [...getPathCosts(path)].reduce((a, b) => a + b, 0);
}

export function getPathExtent(path: Vector2[], maxCost: number): Vector2[] {
  let [sum, i] = [0, 0];
  for (const cost of getPathCosts(path)) {
    sum += cost;
    if (sum > maxCost) {
      break;
    } else {
      i++;
    }
  }
  return path.slice(0, i + 1);
}
