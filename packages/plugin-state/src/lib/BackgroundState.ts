import { State } from './State';

/**
 * Functionally equivalent to a State, but runs each tick regardless of its
 * place in the scene stack.
 */
export class BackgroundState<T extends {} = {}> extends State<T> {
  /**
   * Unlike regular States, events attached to BackgroundState events are not
   * unregistered on pause—only on stop.
   */
  public events: Partial<$.Events> = {};
}
