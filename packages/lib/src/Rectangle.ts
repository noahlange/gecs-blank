import type { Bounds, Dimensions, Vector2 } from '@gecs/types';

import { intersects, iterateGrid } from '@gecs/utils';

export class Rectangle implements Bounds, Vector2, Dimensions {
  public static difference(r: Bounds, s: Bounds): Bounds[] {
    const a = Math.min(r.x1, s.x1);
    const b = Math.max(r.x1, s.x1);
    const c = Math.min(r.x2, s.x2);
    const d = Math.max(r.x2, s.x2);

    const e = Math.min(r.y1, s.y1);
    const f = Math.max(r.y1, s.y1);
    const g = Math.min(r.y2, s.y2);
    const h = Math.max(r.y2, s.y2);

    // X = intersection, 0-7 = possible difference areas
    // h +-+-+-+
    // . |5|6|7|
    // g +-+-+-+
    // . |3|X|4|
    // f +-+-+-+
    // . |0|1|2|
    // e +-+-+-+
    // . a b c d

    // we'll always have rectangles 1, 3, 4 and 6
    const result: Bounds[] = [
      { x1: b, x2: c, y1: e, y2: f },
      { x1: a, x2: b, y1: f, y2: g },
      { x1: c, x2: d, y1: f, y2: g },
      { x1: b, x2: c, y1: g, y2: h }
    ];

    // decide which corners
    if ((r.x1 == a && r.y1 == e) || (s.x1 == a && s.y1 == e)) {
      // corners 0 and 7
      result.push({ x1: a, x2: b, y1: e, y2: f }, { x1: c, x2: d, y1: g, y2: h });
    } else {
      // corners 2 and 5
      result.push({ x1: c, x2: d, y1: e, y2: f }, { x1: a, x2: b, y1: g, y2: h });
    }

    return result;
  }

  public x1: number;
  public y1: number;
  public x2: number;
  public y2: number;

  public get cx(): number {
    return (this.x1 + this.x2) / 2;
  }

  public get cy(): number {
    return (this.y1 + this.y2) / 2;
  }

  public get x(): number {
    return this.x1;
  }

  public get y(): number {
    return this.y1;
  }

  public get width(): number {
    return this.x2 - this.x1;
  }

  public get height(): number {
    return this.y2 - this.y1;
  }

  public get bounds(): Bounds {
    return { x1: this.x1, y1: this.y1, x2: this.x2, y2: this.y2 };
  }

  public get center(): Vector2 {
    return {
      x: Math.floor((this.x1 + this.x2) / 2),
      y: Math.floor((this.y1 + this.y2) / 2)
    };
  }

  public intersects(rect: Bounds): boolean {
    return intersects(this, rect);
  }

  public *points(): IterableIterator<Vector2> {
    for (const point of iterateGrid(this)) {
      yield point;
    }
  }

  public contains(point: Vector2): boolean {
    const x1 = point.x >= this.x1;
    const x2 = point.x < this.x2;
    const y1 = point.y >= this.y1;
    const y2 = point.y < this.y2;

    return x1 && y1 && x2 && y2;
  }

  public constructor(rect: Bounds | Dimensions) {
    const { x1, x2, y1, y2 } =
      'width' in rect ? { x1: 0, y1: 0, x2: rect.width, y2: rect.height } : rect;

    [this.x1, this.x2] = [x1, x2].sort((a, b) => a - b);
    [this.y1, this.y2] = [y1, y2].sort((a, b) => a - b);
  }
}
