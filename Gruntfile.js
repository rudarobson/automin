/*
 * automin
 * https://github.com/Rudá/automin
 *
 * Copyright (c) 2015 rudarobson
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'<%= nodeunit.tests %>'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['tmp']
		},

		// Configuration to be run (and then tested).
		automin: {
			options: {
				tmp: '.automin-tmp'
			},
			test1: {
				options: {
					root: 'test/fixtures/test1'
				},
				files: {
					'tmp/test1/replace-api.html': ['test/fixtures/test1/replace-api.html']
				}
			},
			test2: {
				options: {
					root: 'test/fixtures/test2'
				},
				files: {
					'tmp/test2/subdir/replace-api.html': ['test/fixtures/test2/subdir/replace-api.html'],
				}
			},
			test3: {
				options: {
					root: 'test/fixtures/test3'
				},
				files: {
					'tmp/test3/replace-api-with-script-another-dir.html': ['test/fixtures/test3/replace-api-with-script-another-dir.html']
				}
			},
			test4: {
				options: {
					root: 'test/fixtures/test4'
				},
				files: {
					'tmp/test4/index.html': ['test/fixtures/test4/index.html']
				}
			}
		},
		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js']
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', [
		'clean',
		'automin:test1',
		'automin:test2',
		'automin:test3',
		'automin:test4',
		'concat:automin',
		'uglify:automin',
		'cssmin:automin',
		'clean:automin',
		'nodeunit'
	]);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['jshint', 'test']);

};
