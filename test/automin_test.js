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

exports.automin = {
	setUp: function(done) {
		// setup here if necessary
		done();
	},
	replace_api: function(test) {
		test.expect(3);

		var actual = grunt.file.read('tmp/test1/replace-api.html');
		var expected = grunt.file.read('test/expected/test1/replace-api.html');
		test.equal(actual, expected, 'should describe what the custom option(s) behavior is.');

		actual = grunt.file.read('tmp/test2/subdir/replace-api.html');
		expected = grunt.file.read('test/expected/test2/subdir/replace-api.html');
		test.equal(actual, expected, 'should describe what the custom option(s) behavior is.');

		actual = grunt.file.read('tmp/test3/replace-api-with-script-another-dir.html');
		expected = grunt.file.read('test/expected/test3/replace-api-with-script-another-dir.html');
		test.equal(actual, expected, 'should describe what the custom option(s) behavior is.');

		test.done();
	},
};
