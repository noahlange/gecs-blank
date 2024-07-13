import type { Schema } from '@gecs/types';

import { Component } from 'gecs';

export class Interact extends Component {
  public static readonly type = 'interact';
  public static readonly schema: Schema = {
    disabled: { type: 'boolean' },
    cursor: { type: 'string' }
  };

  public cursor: $.Cursor = $.Cursor.DEFAULT;
  public disabled: boolean = false;
}
