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


exports.handlebars = {
	setUp: function(done) {
		// setup here if necessary
		done();
	},
	'handlebars': function(test) {
		var descriptions = {
			test1: 'a simple test with layout',

		};
		var config = require('../config.json').handlebars;

		var actual;
		var expected;
		test.expect(3);
		for (var i = 1; i <= 3; i++) {
			actual = grunt.file.read(config.tmp + '/test' + i + '/index.html');
			expected = grunt.file.read(config.expected + '/test' + i + '/index.html');
			test.equal(actual, expected, descriptions['test' + i]);
		}
		test.done();
	},
};
