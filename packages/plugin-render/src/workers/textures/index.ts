import { merge } from './merge';

self.onmessage = async (e: MessageEvent<string[]>) => {
  const res = await merge(e.data);
  postMessage(res);
};
