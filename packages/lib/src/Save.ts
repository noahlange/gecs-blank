import { _ } from '@gecs/utils';
import type { Context } from 'gecs';

export class Save {
  public async save() {
    const data: Record<string, unknown> = {};
    for (const [name, plugin] of _.entries(this.ctx.$)) {
      if (plugin.save) {
        data[name as string] = await plugin.save();
      }
    }
    return data;
  }

  public async load(data: Record<string, unknown> = {}) {
    for (const [name, plugin] of _.entries(this.ctx.$)) {
      if (plugin.load) {
        await plugin.load(data[name]);
      }
    }
  }

  public async toString(): Promise<string> {
    return JSON.stringify(await this.save());
  }

  public async toBuffer(): Promise<ArrayBuffer> {
    return new Blob([await this.toString()]).arrayBuffer();
  }

  public constructor(protected ctx: Context<$.Plugins>) {}
}
