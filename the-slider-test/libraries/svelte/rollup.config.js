import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

const DIST = 'dist';

export default {
	input: 'src/main.js',
	output: {
		format: 'iife',
		name: 'app',
		file: `${DIST}/bundle.js`
	},
	plugins: [
		svelte({
			dev: !production,
			css: css => { css.write(`${DIST}/bundle.css`); }
		}),
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		commonjs(),
		!production && livereload(DIST),
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
