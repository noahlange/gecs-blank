import { nanoid } from 'nanoid';
import { Atlas } from './Atlas';
import type { Context } from 'gecs';
import { Spritesheet, Texture } from 'pixi.js';

export class VirtualAtlas extends Atlas {
  protected sources: Record<string, string> = {};

  public async remove(source: string) {
    const id = this.sources[source];
    this.ctx.$.render.resources.setTexture(this.name, id, Texture.EMPTY);
  }

  public async add(source: string): Promise<string> {
    const id = (this.sources[source] = nanoid(4));
    const res = await Texture.fromURL(source);
    this.ctx.$.render.resources.setTexture(this.name, id, res);
    return id;
  }

  constructor(protected ctx: Context<$.Plugins>) {
    super(nanoid(4), null!);
    this.spritesheet = new Spritesheet(Texture.EMPTY, { meta: { scale: '1.0' }, frames: {} });
    this.ctx.$.render.resources.addSpritesheets({ [this.name]: this.spritesheet });
  }
}
