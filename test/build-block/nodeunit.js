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
			test8: 'testing sass',
			test9: 'testing sass with imports',
			test10: 'testing sass with other types but using types option as types:[sass], process only sass'
		};

		var actual;
		var expected;
		test.expect(19);

		actual = grunt.file.read(config.tmp + '/test1/index.html');
		expected = grunt.file.read(config.expected + '/test1/index.html');
		test.equal(actual, expected, descriptions['test1']);

		var js = [2, 3, 4, 5];
		var css = [6, 7];
		var sass = [8, 9, 10];

		for (var i in js) {
			//test js
			actual = grunt.file.read(config.tmp + '/test' + js[i] + '/index.html');
			expected = grunt.file.read(config.expected + '/test' + js[i] + '/index.html');
			test.equal(actual, expected, descriptions['test' + js[i]]);

			//test js
			actual = grunt.file.read(config.tmp + '/test' + js[i] + '/app.js');
			expected = grunt.file.read(config.expected + '/test' + js[i] + '/app.js');
			test.equal(actual, expected, descriptions['test' + js[i]]);
		}

		for (i in css) {
			//test css
			actual = grunt.file.read(config.tmp + '/test' + css[i] + '/index.html');
			expected = grunt.file.read(config.expected + '/test' + css[i] + '/index.html');
			test.equal(actual, expected, descriptions['test' + css[i]]);

			//test css
			actual = grunt.file.read(config.tmp + '/test' + css[i] + '/index.css');
			expected = grunt.file.read(config.expected + '/test' + css[i] + '/index.css');
			test.equal(actual, expected, descriptions['test' + css[i]]);
		}

		for (i in sass) {
			//test sass
			actual = grunt.file.read(config.tmp + '/test' + sass[i] + '/index.html');
			expected = grunt.file.read(config.expected + '/test' + sass[i] + '/index.html');
			test.equal(actual, expected, descriptions['test' + sass[i]]);

			//test css
			actual = grunt.file.read(config.tmp + '/test' + sass[i] + '/index.css');
			expected = grunt.file.read(config.expected + '/test' + sass[i] + '/index.css');
			test.equal(actual, expected, descriptions['test' + sass[i]]);
		}
		test.done();
	}
};
