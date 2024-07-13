import { Plugin, type PluginData } from '@gecs/lib';

export class GamePlugin extends Plugin {
  public static readonly type = 'game';
  public $: PluginData = {
    components: {},
    entities: {},
    events: {},
    commands: {},
    tags: [
      'CANCEL',
      'CLICK',
      'CLICK_ALT',
      'ITEM_UNEQUIP',
      'ITEM_EQUIP',
      'ITEM_USE',
      'ITEM_DROP',
      'ITEM_PICK_UP',
      'IS_HOSTILE',
      'IN_COMBAT',
      'IS_FOCUSED',
      'IS_SUCCESS',
      'IS_FAILURE',
      'IS_SELECTED',
      'IS_GHOSTABLE'
    ],
    systems: []
  };
}
