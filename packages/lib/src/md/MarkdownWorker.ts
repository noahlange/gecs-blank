import MarkdownIt from 'markdown-it';
import { iconPlugin } from './plugins/IconPlugin';

self.addEventListener('message', async (event: MessageEvent<string>) => {
  const md = new MarkdownIt({ typographer: true, html: true }).use(iconPlugin);
  try {
    const html = md.render(event.data);
    self.postMessage(html);
  } catch (e) {
    console.error(`failed to transform markdown`, e);
    self.postMessage(event.data);
  }
});
