import { Block } from '@gecs/types';

import * as bit from './bit';

export function isObstacle(collision: Block = Block.NONE): boolean {
  return bit.all(Block.OBSTACLE, collision);
}

export function isObstruction(collision: Block = Block.NONE): boolean {
  return bit.all(Block.OBSTRUCTION, collision);
}

export function isEmpty(collision: Block = Block.NONE): boolean {
  return bit.none(Block.OBSTRUCTION + Block.OBSTACLE, collision);
}

export function addObstacle(collision: Block = Block.NONE): number {
  return collision | Block.OBSTACLE;
}

export function addObstruction(collision: Block = Block.NONE): number {
  return collision | Block.OBSTRUCTION;
}

export function removeObstacle(collision: Block = Block.NONE): number {
  return collision ^ Block.OBSTACLE;
}

export function removeObstruction(collision: Block = Block.NONE): number {
  return collision ^ Block.OBSTRUCTION;
}
