var path = require('path');
var fs = require('fs');
var grunt = require('grunt');

/*
	@param content: is the content inside the build block
	@param destDir: is de directory destination for the parsing file
	@param target: is the file target in the build
	@param root: is the root param in options
*/
function processJSCSSWithRegex(regex, content, srcDir, destDir, target, options) {
	var files = {};

	var dest = path.join(destDir, target);

	files[dest] = [];
	var match;
	while ((match = regex.exec(content))) {
		var file = match[1];
		if (file[0] != '/') //is relative to current parsing file
			file = path.join(srcDir, file);
		else {
			if (!options.root) { //is relative .html to root, must be supplied
				console.log('Root wasn\'t provided');
				throw 'Root wasn\'t provided';
			}
			file = path.join(options.root, file);
		}

		files[dest].push(file);
	}
	return files;
}

function setFilesForTaskInConfig(task, files) {
	var config = grunt.config.get(task);

	if (!config) {
		config = {};
	}

	if (!config.automin) {
		config.automin = {};
	}

	if (!config.automin.files) {
		config.automin.files = {};
	}


	for (var i in files) {
		if (config.automin.files[i]) {
			grunt.log.warn('Overwiting file: ' + i);
			throw 'Overwiting file: ' + i;
		}
		config.automin.files[i] = files[i];
	}
	

	grunt.config.set(task, config);
}

var pipelines = {
	js: [],
	css: []
};


function concatFilesInPipelineInTmp(files, options) {
	var tmp = options.tmp || '.tmp/';

	if (tmp[tmp.length - 1] != '/')
		tmp += '/';

	var f2 = {};
	var ret = [];
	for (var i in files) {
		f2[tmp + i] = files[i];
		ret.push(tmp + i);
	}

	setFilesForTaskInConfig('concat', f2);
	return ret;
}

function processFilesFromConcatInTemp(files, options, processTaskName) {
	var tmp = options.tmp || '.tmp/';

	if (tmp[tmp.length - 1] != '/')
		tmp += '/';

	var f2 = {};
	for (var i in files) {
		var dest = files[i].substring(tmp.length);
		f2[dest] = files[i];
	}
	setFilesForTaskInConfig(processTaskName, f2);
}

function cleanTmp(files, options) {
	var tmp = options.tmp || '.tmp/';

	if (tmp[tmp.length - 1] != '/')
		tmp += '/';

	var config = grunt.config.get('clean');

	if (!config)
		config = {};

	if (!config.automin)
		config.automin = [];

	config.automin.push(tmp);

	grunt.config.set('clean', config)
}


pipelines.js = [
	//get files from block
	function(content, srcDir, destDir, target, options) {
		var regex = /<script[\s\S]*?src=['"]([^"'<>]+)["']/g;
		return processJSCSSWithRegex(regex, content, srcDir, destDir, target, options);
	},
	//set concat
	concatFilesInPipelineInTmp,

	//set uglify
	function(files, options) {
		processFilesFromConcatInTemp(files, options, 'uglify');
	},

	//clean .tmp
	cleanTmp
];

pipelines.css = [
	//get the files from block
	function(content, srcDir, destDir, target, options) {
		var regex = /<link[\s\S]*?href=['"]([^"'<>]+)["']/g;
		return processJSCSSWithRegex(regex, content, srcDir, destDir, target, options);
	},
	//set concat
	concatFilesInPipelineInTmp,

	//set css
	function(files, options) {
		processFilesFromConcatInTemp(files, options, 'cssmin');
	},
	//clean .tmp
	cleanTmp
];

var typeProcessors = {
	js: {
		render: function(target) {
			return '<script src="' + target + '"></script>';
		}
	},
	css: {
		render: function(target) {
			return '<link rel="stylesheet" type="text/css" href="' + target + '" />';
		}
	}
};

module.exports = {
	get: function(type) {
		return typeProcessors[type];
	},
	processPipeline: function(type, content, srcDir, destDir, target, options) {

		var ret = pipelines[type][0](content, srcDir, destDir, target, options);

		for (var i = 1; i < pipelines[type].length; i++) {
			ret = pipelines[type][i](ret, options);
		}
	}
};
