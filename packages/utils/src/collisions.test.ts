import { describe, expect, test } from 'vitest';

import { Block } from '@gecs/types';

import { isObstacle, isObstruction } from './collisions';

describe('isObstacle()', () => {
  test('"complete" and "obstacle" are obstacles', () => {
    expect(isObstacle(Block.COMPLETE)).toBeTruthy();
    expect(isObstacle(Block.OBSTACLE)).toBeTruthy();
  });
  test('"obstruction" and "none" are not', () => {
    expect(isObstacle(Block.NONE)).toBeFalsy();
    expect(isObstacle(Block.OBSTRUCTION)).toBeFalsy();
  });
});

describe('isObstruction()', () => {
  test('"complete" and "obstruction" are obstructions', () => {
    expect(isObstruction(Block.COMPLETE)).toBeTruthy();
    expect(isObstruction(Block.OBSTRUCTION)).toBeTruthy();
  });
  test('"obstacle" and "none" are not', () => {
    expect(isObstruction(Block.NONE)).toBeFalsy();
    expect(isObstruction(Block.OBSTACLE)).toBeFalsy();
  });
});
