import { Component } from 'gecs';

import { type Schema } from '@gecs/types';
import { Block, schema } from '@gecs/types';
import { isObstacle, isObstruction } from '@gecs/utils';

export class Collision extends Component {
  public static readonly type = 'collision';
  public static schema: Schema = {
    value: { type: 'integer', default: Block.NONE, enum: schema.enums.block }
  };

  // can this be moved through?
  public get isObstacle(): boolean {
    return isObstacle(this.value);
  }

  public set isObstacle(value: boolean) {
    this.value = value ? this.value | Block.OBSTACLE : this.value & Block.OBSTACLE;
  }

  // can this be seen through?
  public get isObstruction(): boolean {
    return isObstruction(this.value);
  }

  public set isObstruction(value: boolean) {
    this.value = value ? this.value | Block.OBSTRUCTION : this.value & Block.OBSTRUCTION;
  }

  public value: number = Block.NONE;
}
