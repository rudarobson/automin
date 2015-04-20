'use strict';

var grunt = require('grunt');
var fs = require('fs');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/


exports.buildBlock = {
	setUp: function(done) {
		// setup here if necessary
		done();
	},
	'build-block': function(test) {
		var config = require('../config.json').buildBlock;

		var descriptions = {
			test1: 'test1',
			test2: 'test2',
			test3: 'test3',
			test4: 'test4',
			test5: 'test5',
			test6: 'test6',
			test7: 'using build*cwd a diffrent search path for current document',
		};

		var actual;
		var expected;
		test.expect(15);

		actual = grunt.file.read(config.tmp + '/test1/index.html');
		expected = grunt.file.read(config.expected + '/test1/index.html');
		test.equal(actual, expected, descriptions['test1']);

		for (var i = 2; i <= 5; i++) {
			//test js
			actual = grunt.file.read(config.tmp + '/test' + i + '/index.html');
			expected = grunt.file.read(config.expected + '/test' + i + '/index.html');
			test.equal(actual, expected, descriptions['test' + i]);

			//test js
			actual = grunt.file.read(config.tmp + '/test' + i + '/app.js');
			expected = grunt.file.read(config.expected + '/test' + i + '/app.js');
			test.equal(actual, expected, descriptions['test' + i]);
		}

		for (i = 6; i <= 7; i++) {
			//test css
			actual = grunt.file.read(config.tmp + '/test' + i + '/index.html');
			expected = grunt.file.read(config.expected + '/test' + i + '/index.html');
			test.equal(actual, expected, descriptions['test' + i]);

			//test css
			actual = grunt.file.read(config.tmp + '/test' + i + '/index.css');
			expected = grunt.file.read(config.expected + '/test' + i + '/index.css');
			test.equal(actual, expected, descriptions['test' + i]);
		}

		for (i = 8; i <= 8; i++) {
			//test sass
			actual = grunt.file.read(config.tmp + '/test' + i + '/index.html');
			expected = grunt.file.read(config.expected + '/test' + i + '/index.html');
			test.equal(actual, expected, descriptions['test' + i]);

			//test css
			actual = grunt.file.read(config.tmp + '/test' + i + '/index.css');
			expected = grunt.file.read(config.expected + '/test' + i + '/index.css');
			test.equal(actual, expected, descriptions['test' + i]);
		}
		test.done();
	}
};
