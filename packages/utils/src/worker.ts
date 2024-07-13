export interface WorkerRunner<I, O> {
  run(data: I): Promise<O>;
  exec(data: I[]): AsyncIterable<O>;
}

export function createWorker<I, O>(url: string, persist: boolean = false): WorkerRunner<I, O> {
  const worker = new Worker(url, { type: 'module' });

  const run = (data: I): Promise<O> => {
    return new Promise((resolve, reject) => {
      worker.onerror = reject;
      worker.onmessage = res => {
        if (!persist) {
          worker.terminate();
        }
        resolve(res.data);
      };
      worker.postMessage(data);
    });
  };

  return {
    run,
    async *exec(data: I[]): AsyncIterable<O> {
      const next = data.shift();
      if (next) {
        yield await run(next);
      }
    }
  };
}
