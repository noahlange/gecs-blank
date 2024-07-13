import { FOV } from 'malwoden';
import * as PIXI from 'pixi.js';

import { Plugin, type PluginData } from '@gecs/lib';
import { Movement, Position, View } from '@gecs/plugin-core';
import {
  Projection,
  type Dimensions,
  type ScreenVector3,
  type Vector2,
  type Vector3
} from '@gecs/types';
import { toIsometricPoint, fromIsometricPoint } from '@gecs/utils';

import * as components from './components';
import { AtlasManager, RendererManager, ResourceManager } from './managers';
import { render } from './systems';
import { AnimationManager } from './managers/AnimationManager';

const { Sprite } = components;

export class RenderPlugin extends Plugin {
  public static readonly type = 'render';
  public static mount: string | HTMLElement = '#root';

  public $: PluginData = {
    components,
    systems: [render.pre, render.on],
    tags: ['IS_CAMERA', 'IS_STATIC', 'IS_HIDDEN', 'IS_ANIMATING', 'IS_CLICKED', 'IS_ANIMATED']
  };

  public fov = new FOV.PreciseShadowcasting({ lightPasses: () => false, topology: 'four' });
  public atlases = new AtlasManager(this.ctx);
  public renderer = new RendererManager(this.ctx);
  public resources = new ResourceManager(this.ctx);
  public animations = new AnimationManager(this.ctx);
  public projection = Projection.ISOMETRIC;

  public queries = {
    views: this.ctx.query.components(Position, View).some.tags($.Tag.IS_CAMERA),
    animated: this.ctx.query
      .components(Sprite, Position)
      .some.components(Movement)
      .all.tags($.Tag.IS_ANIMATED),
    camera: this.ctx.query
      .components(Position)
      .some.components(Sprite)
      .all.tags($.Tag.IS_CAMERA),
    visible: this.ctx.query.components(Position, Sprite).none.tags($.Tag.IS_HIDDEN)
  };

  public get tileSize(): Dimensions {
    const size = this.ctx.$.core.config.tileSize;
    return {
      width: (this.projection === Projection.ISOMETRIC ? 2 : 1) * size,
      height: size
    };
  }

  public async screenshot(): Promise<Blob | null> {
    const r = this.renderer;
    const { width, height } = r.app.view;
    const region = new PIXI.Rectangle(0, 0, width, height);
    const filter = new PIXI.BlurFilter(5, 5);
    (r.container.filters ??= []).push(filter);

    const e = r.app.renderer.generateTexture(r.viewport, { region });
    const canvas: HTMLCanvasElement = r.app.renderer.plugins.extract.canvas(e);
    r.container.filters.splice(r.container.filters.indexOf(filter), 1);
    return new Promise<Blob | null>(r => canvas.toBlob(r));
  }

  public async start() {
    this.renderer.start();
  }

  public get zoom(): number {
    return this.renderer.viewport?.scale.x ?? 1;
  }

  /**
   * Given a local position coordinate, return the corresponding screen location.
   */
  public toScreenPoint(point: Vector2 | Vector3): ScreenVector3 {
    switch (this.ctx.$.render.projection) {
      case Projection.ISOMETRIC: {
        return fromIsometricPoint(point, this.tileSize) as ScreenVector3;
      }
      case Projection.ORTHOGRAPHIC:
      default: {
        const { width, height } = this.tileSize;
        return { x: point.x * width, y: point.y * height, z: 0 } as ScreenVector3;
      }
    }
  }

  /**
   * Given a position in the viewport, return the world position represented.
   */
  public toWorldPoint(point: Vector2): Vector2 {
    switch (this.projection) {
      case Projection.ISOMETRIC: {
        return toIsometricPoint(point, this.tileSize);
      }
      case Projection.ORTHOGRAPHIC:
      default: {
        const { width, height } = this.tileSize;
        return {
          x: Math.floor(point.x / width),
          y: Math.floor(point.y / height)
        };
      }
    }
  }
}

export * from './components';
