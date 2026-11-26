import {defineConfig} from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'lib',
  format: 'esm',
  platform: 'neutral',
  target: 'es2022',
  fixedExtension: false,
  // Preserve ESM module boundaries; consumers can bundle for their own target.
  unbundle: true,
  banner: '/*! Copyright The Closure Library Authors. SPDX-License-Identifier: Apache-2.0 */',
  sourcemap: true,
  dts: {sourcemap: true},
  clean: true,
});
