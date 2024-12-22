import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json' assert { type: 'json' };

const footer = `
if (typeof window !== 'undefined') {
  window._Dry_VERSION_ = '${pkg.version}'
}`;

export default {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      footer,
    },
    {
      file: pkg.module,
      format: 'esm',
      footer,
    },
    {
      file: pkg.browser,
      format: 'umd',
      name: 'Dry',
      footer,
    },
  ],
  plugins: [
    typescript(),
    commonjs(),
    resolve(),
  ],
};
