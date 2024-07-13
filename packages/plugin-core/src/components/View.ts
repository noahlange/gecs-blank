import type { Vector2 } from '@gecs/types';

import { Component } from 'gecs';

export class View extends Component {
  public static readonly type = 'view';
  public range = 10;
  public visible: Vector2[] = [];
}
