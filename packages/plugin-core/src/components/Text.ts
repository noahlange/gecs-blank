import type { Schema } from '@gecs/types';

import { Component } from 'gecs';

export class Text extends Component {
  public static readonly type = 'text';
  public static readonly schema: Schema = {
    title: { type: 'string' },
    value: { type: 'string' },
    sub: { type: 'boolean' }
  };

  /**
   * Human-readable name of the attached entity or text string.
   */
  public title: string = '';

  /**
   * Text string content.
   */
  public value: string = '';

  /**
   * Whether or not the value should be run through subwriter before display.
   */
  public sub: boolean = false;
}
