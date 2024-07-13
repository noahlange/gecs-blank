import { describe, expect, test } from 'vitest';
import { getNeighbors } from './vectors';

describe('getNeighbors()', () => {
  describe('return neighboring points', () => {
    test('given a point', () => {
      const points = (() => {
        const res = [];
        for (let y = -1; y <= 1; y++) {
          for (let x = -1; x <= 1; x++) {
            if (x || y) {
              res.push({ x, y });
            }
          }
        }
        return res;
      })();

      expect(getNeighbors({ x: 0, y: 0 })).toEqual(points);
    });
    test('...within a given radius', () => {
      const points = (() => {
        const res = [];
        for (let y = -2; y <= 2; y++) {
          for (let x = -2; x <= 2; x++) {
            if (x || y) {
              res.push({ x, y });
            }
          }
        }
        return res;
      })();

      expect(getNeighbors({ x: 0, y: 0 }, 2)).toEqual(points);
    });
  });
});
