import { describe, expect, test } from 'vitest';
import { iterateGrid } from './iterators';

describe('iterateGrid()', () => {
  describe('should iterate through x/y coordinates...', () => {
    test('...given a size', () => {
      const [width, height] = [5, 5];
      const points = iterateGrid({ width, height });
      expect(Array.from(points)).toHaveLength(width * height);
    });

    test('...within bounds (2 points)', () => {
      const points = iterateGrid({ x: 0, y: 0 }, { x: 2, y: 2 });
      expect(Array.from(points)).toHaveLength(4);
    });

    test('...within bounds (rectangle)', () => {
      const points = iterateGrid({ x1: 0, y1: 0, x2: 2, y2: 2 });
      expect(Array.from(points)).toHaveLength(4);
    });

    test('...should return the same points for the same values', () => {
      const [x, y, w, h] = [0, 0, 2, 2];
      const points = Array.from(iterateGrid({ x: x, y: y }, { x: w, y: h }));
      const bounds = Array.from(iterateGrid({ x1: x, y1: y, x2: w, y2: h }));
      const dimensions = Array.from(iterateGrid({ width: h, height: h }));
      expect(points).toEqual(dimensions);
      expect(points).toEqual(bounds);
      expect(bounds).toEqual(dimensions);
    });
  });
});
