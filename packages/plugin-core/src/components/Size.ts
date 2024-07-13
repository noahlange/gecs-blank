import type { Schema, Dimensions } from '@gecs/types';

import { Component } from 'gecs';

export class Size extends Component implements Dimensions {
  public static readonly type = 'size';
  public static readonly schema: Schema = {
    width: { type: 'integer', default: 0 },
    height: { type: 'integer', default: 0 }
  };

  public width: number = 0;
  public height: number = 0;
}
