import type { Schema, Vector2, Vector3 } from '@gecs/types';

import { Component } from 'gecs';

import { Direction, schema } from '@gecs/types';
import { toChunkPosition } from '@gecs/utils';

export class Position extends Component implements Vector3 {
  public static readonly type = 'position';
  public static readonly schema: Schema = {
    x: { type: 'number' },
    y: { type: 'number' },
    z: { type: 'number' },
    d: { type: 'integer', enum: schema.enums.direction }
  };

  public d: Direction = Direction.N;
  public z: number = 1;
  public x: number = 0;
  public y: number = 0;

  public copy(from: Vector2 | Vector3): void;
  public copy(): Vector3;
  public copy(from?: Vector2 | Vector3) {
    if (from) {
      this.x = from.x;
      this.y = from.y;
      this.z = 'z' in from ? from.z : this.z;
    } else {
      return { x: this.x, y: this.y, z: this.z };
    }
  }

  public toJSON(): { $: Vector2 } {
    return {
      $: { x: this.x, y: this.y }
    };
  }

  public get chunk(): [Vector2, Vector2] {
    return toChunkPosition(this);
  }
}
