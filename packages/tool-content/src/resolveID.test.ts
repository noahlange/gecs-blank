import * as test from 'node:test';
import * as assert from 'node:assert';
import { resolveIDs } from './resolveID';

const content = [
  {
    id: 0x00,
    masters: [],
    content: [0x00_000_001, 0x00_000_002]
  },
  {
    id: 0x01,
    masters: [0x00],
    content: [0x00_000_001, 0xff_000_001]
  },
  {
    id: 0x02,
    masters: [0x00],
    content: [0xff_000_001, 0xff_000_002]
  },
  {
    id: 0x03,
    masters: [0x00, 0x02],
    content: [0x00_000_001, 0x01_000_001, 0xff_000_001]
  }
];

const sources = content.map(item => item.id);
const masters = content.flatMap(i => i.masters);
const ids = content.map(a => Uint32Array.from(a.content));
console.time('resolve');
const res = resolveIDs(sources, masters, ids);
console.timeEnd('resolve');

test.test('asdf', () => {
  assert.deepStrictEqual(res, {
    '1': { source: 3, id: 0x00_000_001 },
    '2': { source: 0, id: 0x00_000_002 },
    '1000001': { source: 1, id: 0xff_000_001 },
    '2000001': { source: 3, id: 0x01_000_001 },
    '2000002': { source: 2, id: 0xff_000_002 },
    '3000001': { source: 3, id: 0xff_000_001 }
  });
});
