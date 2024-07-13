import glob from 'globby';
import { readFile, writeFile, stat, watch } from 'node:fs/promises';
import { join } from 'node:path';
import { ManifestGenerator } from './ManifestGenerator';

const fs = { glob, readFile: (path: string) => readFile(path, 'utf8') };

const base = [process.cwd(), process.argv[2] ?? ''].join('/');
const filename = join(base, 'content.json');

const generator = new ManifestGenerator(fs, base);
const doneLabel = 'done'.padEnd(12, ' ');

const wrapLog = <T>(str: string, fn: () => T | Promise<T>): Promise<T> => {
  const name = str.padEnd(12, ' ');
  console.time(name);
  return Promise.resolve(fn()).then(res => {
    console.timeEnd(name);
    return res;
  });
};

async function generate(): Promise<void> {
  console.time(doneLabel);
  console.log('read...');
  const order = await wrapLog(' ...manifest', () => generator.getOrder());
  const scripts = await wrapLog(' ...scripts', () => generator.readScripts(order));
  const content = await wrapLog(' ...content', () => generator.readContent(order));
  const res = await wrapLog('merge', () => generator.mergeContent([scripts, content].flat()));
  await wrapLog('write', () => writeFile(filename, JSON.stringify(res), 'utf8'));
  console.timeEnd(doneLabel);
}

(async () => {
  try {
    await stat(base);
  } catch (e) {
    console.error('No top-level content manifest.');
  }
  if (process.argv.includes('--watch')) {
    const watcher = watch(base + '/data', { recursive: true });
    for await (const event of watcher) {
      console.log(`\n- ${event.eventType}: ${event.filename}\n`);
      await generate();
      console.log('watching for changes...');
    }
  } else {
    await generate();
  }
})();
