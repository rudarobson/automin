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
		var descriptions = {
			test1: 'a simple test with one custom tag',
			test2: 'a more complex test with one custom tag',
			test3: 'one custom tag testing attribute merging',
			test4: 'testing attribute merging with nested custom tags',
			test5: 'testing multiple uses of tag with nesting',
			test6: 'testing alias same tag with different alias and multiple tags',
			test7: 'testing directory importing',
			test8: 'testing default directry importing'

		};
		var config = require('../config.json').components;

		var actual;
		var expected;
		test.expect(8);
		for (var i = 1; i <= 8; i++) {
			actual = grunt.file.read(config.tmp + '/test' + i + '/index.html');
			expected = grunt.file.read(config.expected + '/test' + i + '/index.html');
			test.equal(actual, expected, descriptions['test' + i]);
		}
		test.done();
	},
};
