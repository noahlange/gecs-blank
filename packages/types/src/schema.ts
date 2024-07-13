import type { Context, EntityClass } from 'gecs';
import type { JSONSchema7 } from 'json-schema';
import type { JSONPrefab } from './misc';

import AJV from 'ajv';

import { Block, Direction } from './enums';

export function getPrefabValidator(
  entities: Record<string, EntityClass>
): (prefab: JSONPrefab) => void {
  const schemas: Record<string, $AnyEvil> = {};
  const ajv = new AJV({ allErrors: true });
  for (const [key, entity] of Object.entries(entities)) {
    const schema = { type: 'object', properties: {} as $AnyOK };
    for (const item of entity.prototype.Components) {
      if (item.schema) {
        schema.properties[item.type] = {
          type: 'object',
          properties: item.schema
        };
      }
    }
    schemas[key] = schema;
  }

  return (prefab: JSONPrefab) => {
    const schema = schemas?.[prefab.entity] ?? {};
    const valid = ajv.validate(schema, prefab.data);
    if (!valid && ajv.errors) {
      console.warn(
        `Validation failed for "${prefab.id}" prefab of type "${prefab.entity}".`,
        ...ajv.errors.map(error => `\n - data${(error as $AnyEvil).dataPath} ${error.message}`)
      );
    }
  };
}

export const enums = {
  direction: [
    Direction.N,
    Direction.NE,
    Direction.E,
    Direction.SE,
    Direction.S,
    Direction.SW,
    Direction.W,
    Direction.NW
  ],
  block: [Block.NONE, Block.OBSTACLE, Block.OBSTRUCTION, Block.COMPLETE],
  tag: []
};

export const dice = {
  type: 'object' as const,
  properties: {
    value: {
      type: 'string' as const,
      pattern:
        '/([+\\-])?(?:(([\\d]+)?[dD]([\\d]+)(![\\d]*)?(¡[\\d]*)?([kd][\\d]+)?)|([\\d]+))/'
    }
  },
  required: ['value']
};

export function logSchema(ctx: Context<$.Plugins>): Record<string, JSONSchema7> {
  return Object.values(ctx.$)
    .flatMap(plugin => Object.values(plugin.$?.components ?? {}))
    .filter((Component: $AnyOK) => Component.schema)
    .reduce((prev: Record<string, JSONSchema7>, { type, schema }: $AnyOK) => {
      return { ...prev, [type]: { type: 'object', properties: schema } };
    }, {});
}
