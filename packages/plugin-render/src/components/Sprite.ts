import type { Schema, Vector2 } from '@gecs/types';
import type * as PIXI from 'pixi.js';

import { Component } from 'gecs';

interface SpriteData {
  key: string | null;
  alpha: number;
  tint: number;
  offset: Vector2;
  anchor: Vector2;
}

export class Sprite extends Component implements SpriteData {
  public static readonly type = 'sprite';
  public static schema: Schema = {
    key: { type: 'string' },
    offset: { type: 'object', properties: { x: { type: 'integer' }, y: { type: 'integer' } } },
    anchor: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' } } },
    tint: { type: 'string', default: '#ffffff' },
    alpha: { type: 'number', default: 1.0 },
    idle: { type: 'string', default: 'idle' },
    animation: { type: 'string', default: 'idle' }
  };

  public pixi: PIXI.Sprite | PIXI.AnimatedSprite | null = null;
  public isLoading: boolean = true;
  public isAnimated: boolean = false;

  // bottom center
  public anchor: Vector2 = { x: 0, y: 1 };
  public offset: Vector2 = { x: 0, y: 0 };
  public dirty: boolean = false;
  public alpha: number = 1;
  public animation: string = 'idle';
  public idle: string = 'idle';

  protected _tint: number = 0xffffff;

  public get tint(): number {
    return this._tint;
  }

  public set tint(color: number | string) {
    const value =
      typeof color === 'string'
        ? parseInt(color.startsWith('#') ? color.slice(1) : color, 16)
        : color;

    if (value !== this._tint) {
      this._tint = value;
    }
  }

  public set key(value: string | null) {
    if (value !== this._key) {
      this.dirty = true;
      this._key = value;
    }
  }

  public get key(): string | null {
    return this._key;
  }

  protected _key: string | null = null;

  public toJSON(): SpriteData {
    return {
      key: this.key,
      tint: this.tint,
      alpha: this.alpha,
      anchor: this.anchor,
      offset: this.offset
    };
  }
}
