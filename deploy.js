#!/usr/bin/env node

const execSync = require('child_process').execSync;
const Snoocore = require('snoocore');
const sass = require('node-sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');

const compiled = postcss([autoprefixer]).process(sass.renderSync({ file: 'main.scss' }).css).css;

const r = new Snoocore({
	userAgent: 'linux:io.erikdesjardins.stylesheetsync:v0.0.0 (by /u/erikdesjardins)',
	oauth: {
		type: 'script',
		key: process.env.REDDIT_KEY,
		secret: process.env.REDDIT_SECRET,
		username: process.env.REDDIT_USER,
		password: process.env.REDDIT_PASS,
		scope: ['modconfig']
	}
});

r('/r/$subreddit/api/subreddit_stylesheet')
	.post({
		$subreddit: 'solarizedtheme',
		op: 'save',
		reason: execSync('git rev-parse HEAD', { encoding: 'utf8' }),
		stylesheet_contents: compiled
	})
	.catch(e => process.exit(1));
