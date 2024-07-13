import { Component } from 'gecs';
import { ActionStatus, type Action } from '../lib/Action';

export class ActionData extends Component {
  public static readonly type = 'action';
  public instance!: Action;
  public status: ActionStatus = ActionStatus.PENDING;
}
