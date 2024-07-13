import { Manager } from '@gecs/lib';

export interface ConfigBackend {
  get(key: string): $AnyOK;
  set(key: string, value: $AnyOK): void;
}

export class ConfigManager extends Manager {
  public debug: boolean = false;
  // base tick duration
  public tick = 300;
  // tick duration multiplier
  public timescale = 1;
  public volume: number = 1.0;
  public resolution: number = 1;

  // height in iso, width/height in ortho
  public tileSize: number = 32;

  protected backend!: ConfigBackend;

  protected parseQueryParams(): void {
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of params.entries()) {
      (this as $AnyEvil)[key] = value;
    }
  }
}
