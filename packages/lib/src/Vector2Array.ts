import type { Dimensions, Vector2 } from '@gecs/types';

import { iterateGrid } from '@gecs/utils';

export class Vector2Array<T> implements Dimensions {
  public readonly width: number;
  public readonly height: number;

  protected items: T[];
  protected filler: T | null = null;

  public is(point: Vector2, value: T): boolean {
    const index = this.getIndex(point);
    return this.items[index] === value;
  }

  public has(point: Vector2): boolean {
    const i = this.getIndex(point);
    return !!this.items[i];
  }

  public delete(point: Vector2): void {
    const i = this.getIndex(point);
    delete this.items[i];
  }

  public get(point: Vector2): T | undefined;
  public get(point: Vector2, defaultValue: T | (() => T)): T;

  /**
   * Return the contents of { x, y } or `defaultValue` if no contents exist.
   * If defaultValue is a function (usually for an expensive operation that
   * shouldn't be invoked inline), return its return value—otherwise return
   * the value itself.
   */
  public get(point: Vector2, defaultValue?: T | (() => T)): T | undefined {
    return (
      this.items[point.x * this.height + point.y] ??
      (defaultValue && typeof defaultValue === 'function'
        ? (defaultValue as () => T)()
        : defaultValue)
    );
  }

  public set(point: Vector2, value: T): void {
    const i = this.getIndex(point);
    this.items[i] = value;
  }

  public clear(): void {
    this.items = new Array(this.width * this.height);
  }

  public fill(value: T): void {
    this.filler = value;
    this.items.fill(value);
  }

  public clone(): Vector2Array<T> {
    const res = new Vector2Array<T>(this, this.filler);
    res.items = this.items.slice().map(item => ({ ...item }));
    return res;
  }

  public *keys(): Iterable<Vector2> {
    for (const [point] of this.entries()) {
      yield point;
    }
  }

  public *values(): Iterable<T> {
    for (const [, value] of this.entries()) {
      yield value;
    }
  }

  public *entries(): Iterable<[Vector2, T]> {
    const count = this.width * this.height;
    for (let i = 0; i < count; i++) {
      const v = this.items[i];
      if (v !== undefined) {
        yield [this.getPoint(i), v];
      }
    }
  }

  public toJSON(): { width: number; height: number; entries: [Vector2, T][] } {
    return {
      width: this.width,
      height: this.height,
      entries: Array.from(this.entries())
    };
  }

  public toString(): string {
    let str = '';
    for (const point of iterateGrid(this)) {
      str += this.get(point) ?? ' ';
      if (point.x === this.width) {
        str += '\n';
      }
    }
    return str;
  }

  protected getIndex(point: Vector2): number {
    return point.x * this.height + point.y;
  }

  protected getPoint(index: number): Vector2 {
    const x = Math.floor(index / this.height);
    const y = index - x * this.height;
    return { x, y };
  }

  public constructor(size: Dimensions, fill: T | null = null) {
    this.width = size.width;
    this.height = size.height;
    this.items = new Array(this.width * this.height);
    if (fill !== null) {
      this.fill(fill);
    }
  }
}
