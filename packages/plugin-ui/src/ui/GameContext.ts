import type { Context } from 'gecs';

import { createContext, useContext } from 'react';

export const GameContext = createContext<Context<$.Plugins>>(null!);

export function useGameContext(): Context<$.Plugins> {
  return useContext(GameContext);
}
