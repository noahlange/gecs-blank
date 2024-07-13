import type { TiledData, TilesetData } from 'tiledtils';

export * from './removeFromCache';

export function importTilesets(tilemap: TiledData): Promise<TilesetData[]> {
  return Promise.all(
    tilemap.tilesets.map(tileset =>
      tileset.source
        ? import(/* @vite-ignore */ tileset.source).then(m => m.default)
        : Promise.resolve(tileset)
    ) ?? []
  );
}
