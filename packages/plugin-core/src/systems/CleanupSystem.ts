import type { Identifier } from '@gecs/types';

import { System } from 'gecs';

import { Interact, Trigger } from '@gecs/plugin-core';

export class CleanupSystem extends System<$.Plugins> {
  public $ = {
    cleanup: this.ctx.query.tags($.Tag.TO_DESTROY),
    triggers: this.ctx.query.components(Interact).tags($.Tag.TO_DESTROY)
  };

  public prev: Set<Identifier> = new Set();

  public cleanupTriggers() {
    const toDestroy = new Set(this.$.triggers);
    for (const entity of this.ctx.query.components(Interact, Trigger)) {
      for (const child of entity.$.trigger.children.filter(child => toDestroy.has(child))) {
        entity.$.trigger.children.splice(entity.$.trigger.children.indexOf(child), 1);
      }
    }
    toDestroy.clear();
  }

  public warnEntities() {
    for (const entity of this.$.cleanup) {
      if (this.prev.has(entity.id)) {
        console.warn(`failed to delete entity ${entity.id}`);
      }
    }
    this.prev.clear();
  }

  public cleanupEntities() {
    this.prev = new Set<Identifier>();
    for (const entity of this.$.cleanup) {
      this.prev.add(entity.id);
      entity.destroy();
    }
  }

  public tick(): void {
    this.cleanupTriggers();
    this.warnEntities();
    this.cleanupEntities();
    this.ctx.$.core.audio.clear();
  }
}
