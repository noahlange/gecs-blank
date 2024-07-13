interface GameContentSource {
  id: number;
  masters: number[];
  content: Uint32Array;
}

interface ResolvedGameRecord {
  id: number;
  source: number;
}

/**
 * A strategy for resolving identifiers within an arbitrary collections of plugins in a load order.
 */
function resolve(sources: GameContentSource[]): Record<string, ResolvedGameRecord> {
  const data: Record<string, any> = {};
  const ID_BITS = 24n;

  for (const source of sources) {
    const map = source.masters.reduce(
      (a, b, i) => a.set(BigInt(i), BigInt(b)),
      new Map([
        [0xffn, BigInt(source.id)],
        [0x0n, 0x0n]
      ])
    );

    for (const id of source.content) {
      const prevID = BigInt(id);
      // shift right, discarding the item id (e.g., 0xf12_345_678 -> 0xf12)
      const staticSourceID = prevID >> ID_BITS;
      // look up the runtime ID of the corresponding master plugin (0x00 0x01 is master 1, 0x02 is master 2, etc.)
      const runtimeSourceID = map.get(staticSourceID) ?? null;
      if (runtimeSourceID === null) continue;
      // left shift the runtime plugin ID (e.g, 0xf12 -> 0xf12_000_000).
      const basePluginID = staticSourceID << ID_BITS;
      // get the item ID offset relative to the plugin (e.g., 0xf12_345_678 -> 0x345_678)
      const itemID = prevID - basePluginID;
      // add that to the runtime ID of the plugin we're referring to
      const vid = Number((runtimeSourceID << ID_BITS) + itemID);
      // update content
      data[vid.toString(16)] = { source: source.id, id };
    }
  }
  return data;
}

function parseData(
  sources: number[],
  masters: number[],
  content: Uint32Array[]
): GameContentSource[] {
  let deps: number[] = [];
  let data: GameContentSource[] = [];
  let sourceIndex = 0;
  for (let masterIndex = 0; masterIndex < masters.length; masterIndex++) {
    const master = masters[masterIndex];
    if (master == 0x0 || masterIndex === masters.length - 1) {
      data.push({ id: sources[sourceIndex], masters: deps, content: content[sourceIndex] });
      if (master == 0x0) {
        sourceIndex++;
        deps = [0x0];
      } else {
        deps.push(master);
      }
    }
  }
  return data;
}

export function resolveIDs(sources: number[], masters: number[], content: Uint32Array[]) {
  return resolve(parseData(sources, masters, content));
}
