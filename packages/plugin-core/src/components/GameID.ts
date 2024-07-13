import { Component } from 'gecs';
import type { Identifier } from '@gecs/types';

/**
 * The functional equivalent of the Creation Engine's RefID.
 */
export class GameID extends Component {
  public static readonly type = 'gid';
  public value!: Identifier;
  public eid?: string;
}
