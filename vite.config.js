import { defineConfig } from 'vite';
import { resolve, extname, relative } from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

function getHtmlEntries(dir = __dirname, baseDir = __dirname) {
  let entries = {};
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    if (['node_modules', 'dist', '.git', 'public'].includes(item.name)) {
      continue;
    }
    const fullPath = resolve(dir, item.name);
    if (item.isDirectory()) {
      Object.assign(entries, getHtmlEntries(fullPath, baseDir));
    } else if (item.isFile() && extname(item.name) === '.html') {
      const rel = relative(baseDir, fullPath).replace(/\\/g, '/');
      const name = rel.replace(/\.html$/, '');
      entries[name] = fullPath;
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
