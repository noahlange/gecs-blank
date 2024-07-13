import { CompositeTilemap, TileRenderer } from '@pixi/tilemap';
import { update } from '@tweenjs/tween.js';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';

import { Manager } from '@gecs/lib';

import { RenderPlugin } from '../RenderPlugin';

export class RendererManager extends Manager {
  public app!: PIXI.Application<HTMLCanvasElement>;
  public viewport!: Viewport;
  public container!: PIXI.Container;
  public tilemap: CompositeTilemap | null = null;
  public overlays: PIXI.Container = new PIXI.Container();

  protected cursors = {
    pointer: () => this.plugin.resources.getTexture('cursor', 'default')!
  };

  public start() {
    this.createApp();
    this.createStage();
    this.createViewport();

    this.viewport.addChild(this.container);
    this.app.renderer.plugins.tilemap = new TileRenderer(
      this.app.renderer as PIXI.IRenderer as PIXI.Renderer
    );

    // add ticker, informing both Tween.js and gecs on tick.
    this.app.ticker.add(() => {
      update();
      this.ctx.tick(this.app.ticker.deltaMS, Date.now());
    });

    this.mountView(this.app.view);
  }

  private mountView(view: HTMLCanvasElement): void {
    if (typeof RenderPlugin.mount === 'string') {
      document.querySelector(RenderPlugin.mount)?.appendChild(view);
    } else {
      RenderPlugin.mount.appendChild(view);
    }
  }

  private get plugin() {
    return this.ctx.$.render;
  }

  private createApp(): void {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: 1,
      backgroundAlpha: 1,
      backgroundColor: 0x000000,
      antialias: false
    });
  }

  private createStage() {
    this.app.stage.name = 'stage';
    this.app.stage.eventMode = 'static';
    this.app.stage.sortableChildren = true;
    this.container = new PIXI.Container();
    this.container.name = 'foreground';
    this.container.sortableChildren = true;
    this.container.interactiveChildren = true;
    this.container.zIndex = 1;
  }

  private createViewport(): void {
    this.viewport = new Viewport({
      events: this.app.renderer.events,
      screenWidth: this.app.view.width,
      screenHeight: this.app.view.height,
      worldWidth: this.app.view.width,
      worldHeight: this.app.view.height,
      ticker: this.app.ticker,
      disableOnContextMenu: true
    });
    this.viewport.setZoom(1.0, true);
    this.viewport.wheel();
    this.viewport.addChild(this.overlays);
    this.app.stage.addChild(this.viewport);
  }
}
