import { describe, expect, test } from 'vitest';
import { Direction, Projection } from '@gecs/types';

import { getRelativeDirection as get } from './directions';

describe('getRelativeDirection() - top-down', () => {
  const [min, max] = [1, 1];
  const anchors = [{ x: 0, y: 0 }];

  for (const anchor of anchors) {
    test(`cardinal directions (anchor ${anchor.x},${anchor.y})`, () => {
      const [minX, maxX] = [anchor.x - min, anchor.x + max];
      const [minY, maxY] = [anchor.y - min, anchor.y + max];
      expect(get(anchor, { x: 0, y: minY })).toBe(Direction.N);
      expect(get(anchor, { x: 0, y: maxY })).toBe(Direction.S);
      expect(get(anchor, { x: maxX, y: 0 })).toBe(Direction.E);
      expect(get(anchor, { x: minX, y: 0 })).toBe(Direction.W);
    });

    test(`...the other ones (anchor ${anchor.x},${anchor.y})`, () => {
      const [minX, maxX] = [anchor.x - min, anchor.x + max];
      const [minY, maxY] = [anchor.y - min, anchor.y + max];
      expect(get(anchor, { x: minX, y: minY })).toBe(Direction.NW);
      expect(get(anchor, { x: minX, y: maxY })).toBe(Direction.SW);
      expect(get(anchor, { x: maxX, y: maxY })).toBe(Direction.SE);
      expect(get(anchor, { x: maxX, y: minY })).toBe(Direction.NE);
    });
  }
});

describe('getRelativeDirection() - isometric', () => {
  const pos = { x: 29, y: 72 };

  const path = [
    { x: 29, y: 72 },
    { x: 29, y: 71 },
    { x: 29, y: 70 },
    { x: 29, y: 69 },
    { x: 28, y: 68 },
    { x: 28, y: 68 }
  ];

  for (const step of path) {
    test(`path (${pos.x},${pos.y} to (${step.x},${step.y})`, () => {
      expect(get(pos, step, Projection.ISOMETRIC)).toBe(Direction.NE);
    });
  }
});
