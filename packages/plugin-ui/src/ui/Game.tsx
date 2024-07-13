import type { State, StateClass } from '@gecs/plugin-state';
import type { Context } from 'gecs';

import { Component } from 'react';

import { GameContext } from './GameContext';

interface GameProps {
  ctx: Context<$.Plugins>;
}

export class Game extends Component<GameProps> {
  protected cache: Map<State, JSX.Element | null> = new Map();
  protected handles: string[] = [];

  public componentDidMount(): void {
    this.handles.push(
      this.props.ctx.$.events.on('state.start', this.renderState),
      this.props.ctx.$.events.on('state.resume', this.renderState),
      this.props.ctx.$.events.on('state.update', this.renderState),
      this.props.ctx.$.events.on('state.stop', this.endState)
    );
  }

  public componentWillUnmount(): void {
    for (const handle of this.handles) {
      this.props.ctx.$.events.off(handle);
    }
  }

  public render(): JSX.Element {
    return (
      <GameContext.Provider value={this.props.ctx}>
        {this.props.ctx.$.state.stack.map(state => {
          const ctor = state.constructor as StateClass<{}>;
          const name = ctor.type ?? ctor.name;
          return (
            <div key={state.id} className={`${name} ${state.active ? 'active' : ''}`}>
              {this.cache.get(state)}
            </div>
          );
        })}
      </GameContext.Provider>
    );
  }

  protected endState = (state: State): void => {
    this.cache.delete(state);
    this.forceUpdate();
  };

  protected renderState = (state: State): void => {
    if (state) {
      this.cache.set(state, state.render?.() ?? null);
    }
    this.forceUpdate();
  };
}
