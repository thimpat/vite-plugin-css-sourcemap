import { defineConfig } from 'vite';
import cssSourcemap from '../src';

export default defineConfig({
  plugins: [
    cssSourcemap({
      extensions: ['.css', '.scss'],
      enabled: true,
      folder: 'sourcemaps',
      getURL: (fileName) => `sourcemaps/${fileName}`,
    }),
  ],
});
