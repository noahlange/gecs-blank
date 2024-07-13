export async function toHTML(markdown: string): Promise<string> {
  const url = new URL('./MarkdownWorker.ts', import.meta.url);
  const worker = new Worker(url, { type: 'module' });
  return new Promise(resolve => {
    worker.postMessage(markdown);
    worker.addEventListener('message', event => resolve(event.data));
  });
}
