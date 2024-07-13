import { createRoot } from 'react-dom/client';

import { Plugin } from '@gecs/lib';

import { Game } from './ui/Game';
import { createElement } from 'react';

export class UIPlugin extends Plugin {
  public static readonly type = 'ui';

  private root = createRoot(document.getElementById('ui')!);

  public start(): void {
    this.root.render(createElement(Game, { ctx: this.ctx }));
  }

  public stop(): void {
    this.root.unmount();
  }
}
