import type { Identifier } from 'gecs/src/types';
import { Duration } from '../components';
import { ActionData } from '../components/Action';
import { Action, ActionStatus } from '../lib/Action';
import { System } from 'gecs';

type ActionInstance = InstanceType<typeof Action>;

export class ActionSystem extends System<$.Plugins> {
  protected actions: Map<Identifier, ActionInstance> = new Map();

  protected $ = {
    actions: this.ctx.query.components(ActionData, Duration)
  };

  public tick() {
    for (const entity of this.$.actions) {
      // start new actions
      if (entity.$.action.status === ActionStatus.PENDING) {
        this.actions.set(entity.id, entity.$.action.instance);
      }

      this.actions.get(entity.id)?.step();

      // flag expired actions for deletion
      if (entity.$.action.status >= ActionStatus.SUCCEEDED) {
        entity.$.action.instance = null!;
        // entity.tags.add($.Tag.TO_DESTROY);
        this.actions.delete(entity.id);
      }
    }
  }
}
