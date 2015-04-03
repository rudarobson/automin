/*
 * automin
 * https://github.com/Rudá/automin
 *
 * Copyright (c) 2015 rudarobson
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
module.exports = function(grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('automin', 'The best Grunt plugin ever.', function() {
		var api = require('../lib/automin-api');

		var self = this;
		// Iterate over all specified file groups.
		this.files.forEach(function(f) {
			f.src.forEach(function(file) {
				var trans = api.transform({
					grunt: grunt,
					task: self,
					srcDir: path.dirname(file),
					srcFile: path.basename(file),
					srcFull: file,
					destDir: path.dirname(f.dest),
					destFile: path.basename(f.dest),
					destFull: f.dest
				});

				trans.process();

				grunt.file.write(trans.context().destFull, trans.toString());
			});
		});


	});

};
