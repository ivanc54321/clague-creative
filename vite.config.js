import { defineConfig } from 'vite';
import { resolve, extname } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function getHtmlEntries(dir = __dirname) {
  let entries = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    if (item.name === 'node_modules' || item.name === 'dist' || item.name === '.git' || item.name === 'public') {
      continue;
    }
    const fullPath = resolve(dir, item.name);
    if (item.isDirectory()) {
      entries = entries.concat(getHtmlEntries(fullPath));
    } else if (item.isFile() && extname(item.name) === '.html') {
      entries.push(fullPath);
    }
  }
  return entries;
}

export default defineConfig({
  root: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: getHtmlEntries(),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
