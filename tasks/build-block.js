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

function buildBlock(grunt,src,dest,options) {
	var api = require('../lib/build-block');
	var content = api.parse(src,dest,options);
	grunt.file.write(dest, content);
}

module.exports = function(grunt) {
	grunt.registerMultiTask('build-block', 'The best Grunt plugin ever.', function() {
		var self = this;
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
				buildBlock(grunt,file,f.dest,self.options());
			});
		});


	});

};
