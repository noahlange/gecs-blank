import { describe, expect, test } from 'vitest';

import { getPathCosts, getPathExtent } from '@gecs/utils';

const path = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 2, y: 2 }
];

const path2 = [
  { x: 18, y: 64 },
  { x: 18, y: 65 },
  { x: 18, y: 66 },
  { x: 18, y: 67 },
  { x: 18, y: 68 },
  { x: 19, y: 69 }
];

describe('getPathCosts', () => {
  test('should return accurate path costs I', () => {
    expect([...getPathCosts(path)]).toStrictEqual([2, 2, 3]);
  });

  test('should return accurate path costs II', () => {
    expect([...getPathCosts(path2)]).toStrictEqual([2, 2, 2, 2, 3]);
  });
});

describe('getPathExtent', () => {
  test('should truncate path at a maximum cost', () => {
    expect(getPathExtent(path2, 4)).toHaveLength(2);
    expect(getPathExtent(path2, 6)).toHaveLength(3);
    expect(getPathExtent(path2, 8)).toHaveLength(4);
    expect(getPathExtent(path2, 10)).toHaveLength(4);
    expect(getPathExtent(path2, 11)).toHaveLength(5);
  });
});
