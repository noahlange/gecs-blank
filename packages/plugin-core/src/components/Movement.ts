import { Component } from 'gecs';
import type { Vector2 } from '@gecs/types';

export class Movement extends Component {
  public static readonly type = 'movement';
  public position: Vector2 = { x: 0, y: 0 };
  public active: boolean = false;
  public speed: number = 1;
}
