import {defineConfig} from 'vite';

export default defineConfig({
  // Keep the complete output deployable at the root or any subdirectory.
  base: './',
  server: {port: 9000, strictPort: true},
  preview: {port: 9000, strictPort: true},
  build: {
    target: ['chrome111', 'edge111', 'firefox114', 'safari16.4', 'ios16.4'],
    outDir: 'dist',
    emptyOutDir: true,
    rolldownOptions: {
      output: {
        postBanner: '/*! Copyright The Closure Library Authors. SPDX-License-Identifier: Apache-2.0 */',
      },
    },
  },
});
