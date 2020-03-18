import fs from 'fs';
import commonjs from 'rollup-plugin-commonjs';
import vue from 'rollup-plugin-vue';
import buble from 'rollup-plugin-buble';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import { eslint } from 'rollup-plugin-eslint';
import sassPostcss from 'rollup-plugin-sass-postcss';
import css from 'rollup-plugin-css-only';
import autoprefixer from 'autoprefixer';

const env = process.env.NODE_ENV || 'development';
const isProd = env === 'production';

export default (async () => ({
  input: 'src/index.js',
  output: {
    name: 'mailery.rbac',
    exports: 'named',
    sourcemap: true,
    globals: {
      'bootstrap-vue': 'BootstrapVue',
      'vue': 'Vue',
      'vuex': 'Vuex'
    }
  },
  external: [
    'bootstrap-vue',
    'vue',
    'vuex'
  ],
  plugins: [
    eslint(),
    commonjs(),
    resolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    sassPostcss({
      output: 'dist/main.min.css',
      sourcemap: true,
      plugins: [
        autoprefixer()
      ]
    }),
    css({
      output: function (styles, styleNodes) {
        const contents = fs.readFileSync('dist/main.min.css', 'utf8');
        fs.writeFileSync('dist/main.min.css', contents + styles)
      }
    }),
    vue({
      css: true,
      compileTemplate: true
    }),
    buble({
      objectAssign: 'Object.assign'
    }),
    isProd && (await import('rollup-plugin-terser')).terser()
  ]
}))();
