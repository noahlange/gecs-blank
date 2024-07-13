import { ActionSprite, type ActionSpriteConfig } from '@gecs/action-sprite';
import { Manager } from '@gecs/lib';
import type { Identifier } from '@gecs/types';
import { nanoid } from 'nanoid';

export class AnimationManager extends Manager {
  private sprites: Record<Identifier, ActionSprite> = {};

  public async load(id: Identifier, animation: string, options: ActionSpriteConfig) {
    if (id in this.sprites) this.sprites[id].destroy();
    const sprite = (this.sprites[id] = new ActionSprite(nanoid(), options));
    sprite.load(animation);
  }

  public play(id: Identifier, animation: string) {
    return this.sprites[id].play(animation);
  }

  public unload(id: Identifier) {
    this.sprites[id].destroy();
    delete this.sprites[id];
  }
}
