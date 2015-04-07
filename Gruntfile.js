/*
 * automin
 * https://github.com/Rudá/automin
 *
 * Copyright (c) 2015 rudarobson
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
	var config = require('./test/config.json');
	grunt.initConfig({
		config: config,
		// Before generating any new files, remove any previously-created files.
		clean: {
			tmp: ['tmp']
		},
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'grunt-test-tasks/*.js',
				'test/**/nodeunit.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		// Unit tests.
		nodeunit: {
			tests: ['test/**/nodeunit.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadTasks('tasks');
	grunt.loadTasks('test/test-tasks');
	grunt.registerTask('default', [
		'jshint',
		'clean:tmp',
		'build-block-test',
		'components-test',
		'nodeunit'
	]);

};
