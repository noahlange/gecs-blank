import type { Spritesheet } from 'pixi.js';

import { BaseTexture, Texture } from 'pixi.js';

export function removeSpritesheetFromCache(spritesheet: Spritesheet): void {
  const base = spritesheet.baseTexture;
  for (const key in spritesheet.textures) {
    Texture.removeFromCache(key);
  }
  BaseTexture.removeFromCache(base);
}

export function removeSpritesFromCache(spritesheet: string[]): void {
  for (const texture of spritesheet) {
    Texture.removeFromCache(texture);
  }
}

/**
 * Remove a spritesheet and associated textures/base textures from the
 * corresponding caches.
 */
export function removeFromCache(spritesheet: Spritesheet | string[]): void {
  Array.isArray(spritesheet)
    ? removeSpritesFromCache(spritesheet)
    : removeSpritesheetFromCache(spritesheet);
}
