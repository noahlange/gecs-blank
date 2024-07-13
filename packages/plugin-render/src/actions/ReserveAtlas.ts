import { Action } from '@gecs/plugin-core';
import type { Identifier } from '@gecs/types';
import { getAtlasFromTileset, type TilesetData } from 'tiledtils';

export class ReserveAtlas extends Action {
  public *run() {
    const atlases = this.ctx.$.render.atlases;
    const promises = Promise.allSettled(
      this.tilesets.map(async ts => {
        const atlas = await atlases.load(ts.name, getAtlasFromTileset(ts));
        atlas?.reserve(this.id);
      })
    );
    yield* this.await(promises);
  }

  public constructor(
    public id: Identifier,
    public tilesets: TilesetData[]
  ) {
    super();
  }
}
