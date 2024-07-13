import type { EntityType } from 'gecs';
import type { GameID } from './GameID';
import type { Interact } from './Interact';

import { Component } from 'gecs';

export class Trigger extends Component {
  public static readonly type = 'trigger';
  public children: EntityType<[typeof Interact, typeof GameID]>[] = [];
  public properties: Record<string, unknown> = {};
}
