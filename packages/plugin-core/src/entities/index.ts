import { Entity, type EntityType } from 'gecs';

import type { Collision, View, GameID } from '../components';
import { Audio, Duration, Interact, Position, Text } from '../components';
import { ActionData } from '../components/Action';

export type ActorEntity = EntityType<
  [typeof GameID, typeof Position, typeof Text, typeof Interact],
  [typeof View, typeof Collision]
>;

export const Message = Entity.with(Position, Text, Interact);

export type TriggerEntity = EntityType<[typeof GameID, typeof Position, typeof Interact], []>;

export const Sound = Entity.with(Position, Audio);

export const ActionEntity = Entity.with(ActionData, Duration);
