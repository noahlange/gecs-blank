import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  publicDir: '../../static',
  server: {
    port: 3000,
    fs: { allow: ['../../'] }
  },
  build: {
    minify: false
  },
  define: {
    'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
    global: 'globalThis'
  },
  plugins: [
    react({
      babel: {
        parserOpts: {
          plugins: ['decorators']
        }
      }
    }),
    tsconfigPaths()
  ],
  resolve: {
    alias: {}
  }
});
