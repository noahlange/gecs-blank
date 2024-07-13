import type { Schema } from '@gecs/types';

import { Component } from 'gecs';

interface UsableData {
  value: number | null;
}

export class Duration extends Component {
  public static readonly type = 'duration';
  public static readonly schema: Schema = {
    value: { type: ['integer', 'null'], default: 0 }
  };

  public value: number | null = 0;

  public get active(): boolean {
    return this.value === null || this.value > 0;
  }

  public tick(): void {
    if (this.value !== null) {
      this.value -= 1;
    }
  }

  public toJSON(): UsableData {
    return { value: this.value };
  }
}
