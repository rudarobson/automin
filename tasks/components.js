/*
 * automin
 * https://github.com/rudarobson/automin
 *
 * Copyright (c) 2015 rudarobson
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var api = require('../lib/components');

function components(ctx) {

	var newFile = api.parse(ctx);

	ctx.grunt.file.write(ctx.destFull, newFile);
}

module.exports = function(grunt) {
	grunt.registerMultiTask('components', 'The best Grunt plugin ever.', function() {
		var self = this;

		var defs = this.options();
		api.mergeDefaults(defs);

		// Iterate over all specified file groups.
		this.files.forEach(function(f) {
			f.src.forEach(function(file) {
				var ctx = {
					grunt: grunt,
					task: self,
					srcDir: path.dirname(file),
					srcFile: path.basename(file),
					srcFull: file,
					destDir: path.dirname(f.dest),
					destFile: path.basename(f.dest),
					destFull: f.dest
				};
				components(ctx);
			});
		});
	});
};
