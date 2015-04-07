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


exports.components = {
	setUp: function(done) {
		// setup here if necessary
		done();
	},
	'components': function(test) {
		var config = require('../config.json').components;
		test.expect(2);

		var actual = grunt.file.read(config.tmp + '/test1/index.html');
		var expected = grunt.file.read(config.expected + '/test1/index.html');
		test.equal(actual, expected, 'should describe what the custom option(s) behavior is.');

		actual = grunt.file.read(config.tmp + '/test2/index.html');
		expected = grunt.file.read(config.expected + '/test2/index.html');
		test.equal(actual, expected, 'should describe what the custom option(s) behavior is.');

		test.done();
	},
};
