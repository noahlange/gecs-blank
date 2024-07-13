import type { InputButtonEvent, InputPointerEvent, InputWheelEvent } from '..';

import { throttle } from 'throttle-debounce-ts';

import { getEventMeta, getPointerEventNames } from '../utils';
import { System } from 'gecs';
import type { ScreenVector2 } from '@gecs/types/src';

export class InputSystem extends System<$.Plugins> {
  public events: (InputWheelEvent | InputPointerEvent | InputButtonEvent)[] = [];

  protected buttonEvents = {
    down: (event: KeyboardEvent) => {
      this.events.push({
        type: 'down',
        key: event.key,
        meta: getEventMeta(event),
        ts: Date.now()
      });
    },
    press: (event: KeyboardEvent) => {
      this.events.push({
        type: 'press',
        key: event.key,
        meta: getEventMeta(event),
        ts: Date.now()
      });
    },
    up: (event: KeyboardEvent) => {
      this.events.push({
        type: 'up',
        key: event.key,
        meta: getEventMeta(event),
        ts: Date.now()
      });
    }
  };

  protected wheelEvents = {
    wheel: (event: WheelEvent) => {
      this.events.push({
        type: 'wheel',
        meta: getEventMeta(event),
        deltaY: event.deltaY,
        deltaX: event.deltaX,
        ts: Date.now()
      });
    }
  };

  protected pointerEvents = {
    move: throttle(100, (event: PointerEvent) => {
      this.events.push({
        screen: this.getScreenPoint(event),
        type: 'move',
        meta: getEventMeta(event),
        ts: Date.now()
      });
    }),
    click: (event: PointerEvent) => {
      const meta = getEventMeta(event);
      const types = getPointerEventNames(event);
      const ts = Date.now();
      this.events.push(
        ...types.map(
          type =>
            ({ source: 'pointer', type, screen: this.getScreenPoint(event), meta, ts }) as const
        )
      );
    }
  };

  protected getScreenPoint(event: MouseEvent): ScreenVector2 {
    return { x: event.clientX, y: event.offsetY } as ScreenVector2;
  }

  public start() {
    const mount = document.getElementById('root')!;
    window.addEventListener('keydown', this.buttonEvents.down);
    window.addEventListener('keyup', this.buttonEvents.up);
    window.addEventListener('keypress', this.buttonEvents.press);
    window.addEventListener('wheel', this.wheelEvents.wheel);
    mount.addEventListener('pointerdown', this.pointerEvents.click);
    mount.addEventListener('pointermove', this.pointerEvents.move);
  }

  public stop() {
    const mount = document.getElementById('root')!;
    window.removeEventListener('keydown', this.buttonEvents.down);
    window.removeEventListener('keyup', this.buttonEvents.up);
    window.removeEventListener('keypress', this.buttonEvents.press);
    window.removeEventListener('wheel', this.wheelEvents.wheel);
    mount.removeEventListener('pointerdown', this.pointerEvents.click);
    mount.removeEventListener('pointermove', this.pointerEvents.move);
  }

  public tick() {
    for (const event of this.events) {
      switch (event.type) {
        case 'down':
        case 'press':
        case 'up':
          this.ctx.$.events.emit('core.input.button', event);
          break;
        case 'wheel':
          this.ctx.$.events.emit('core.input.wheel', event);
          break;
        default: {
          this.ctx.$.events.emit('core.input.pointer', event);
          break;
        }
      }
    }
    this.events = [];
  }
}
