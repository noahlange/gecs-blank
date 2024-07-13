import type { EntityType } from 'gecs';
import type { Position } from '../components';

import { isSamePoint } from '@gecs/utils';

import { MetaButton, PointerButton } from '..';

export function hasSamePosition(
  a: EntityType<[], [typeof Position]>,
  b: EntityType<[], [typeof Position]>
): boolean {
  return isSamePoint(a.$.position, b.$.position);
}

export function getPointerButtons(e: PointerEvent): PointerButton[] {
  const buttons: PointerButton[] = [];
  if ((e.buttons | PointerButton.M1) == PointerButton.M1) buttons.push(PointerButton.M1);
  if ((e.buttons | PointerButton.M2) == PointerButton.M2) buttons.push(PointerButton.M2);
  if ((e.buttons | PointerButton.M3) == PointerButton.M3) buttons.push(PointerButton.M3);
  return buttons;
}

export function getPointerEventNames(e: PointerEvent): ('m1' | 'm2' | 'm3')[] {
  return getPointerButtons(e).map(button => {
    switch (button) {
      case PointerButton.M1:
        return 'm1';
      case PointerButton.M2:
        return 'm2';
      case PointerButton.M3:
        return 'm3';
    }
  });
}

export function getEventMeta(event: PointerEvent | KeyboardEvent | WheelEvent): number {
  let meta = 0;
  meta += event.metaKey ? MetaButton.META : 0;
  meta += event.ctrlKey ? MetaButton.CTRL : 0;
  meta += event.altKey ? MetaButton.ALT : 0;
  meta += event.shiftKey ? MetaButton.SHIFT : 0;
  return meta;
}
