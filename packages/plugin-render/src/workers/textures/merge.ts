import { _ } from '@gecs/utils';

export async function fetchImageBitmap(src: string): Promise<ImageBitmap> {
  return fetch(src).then(res => res.blob().then(blob => createImageBitmap(blob)));
}

export async function merge(images: string[]): Promise<ImageBitmap> {
  const bmps = await _.settled(images.map(fetchImageBitmap));
  const w = Math.max(...bmps.map(b => b.width));
  const h = Math.max(...bmps.map(b => b.height));
  const off = new OffscreenCanvas(w, h);
  const ctx = off.getContext('2d');
  if (ctx) {
    for (const bmp of bmps) {
      ctx.drawImage(bmp, 0, 0);
    }
  }
  return off.transferToImageBitmap();
}
