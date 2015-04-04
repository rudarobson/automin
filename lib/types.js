var path = require('path');
var fs = require('fs');

function processJSCSSWithRegex(regex, block) {
	var files = {};
	var ctx = block.context();
	var dest = path.join(ctx.destDir, block.dest());
	var grunt = ctx.grunt;
	var root = ctx.task.options().root;
	files[dest] = [];
	var match;
	while ((match = regex.exec(block.html()))) {
		var file = match[1];
		if (file[0] != '/')
			file = path.join(ctx.srcDir, file);
		else {
			if (!root) {
				grunt.log.warn('Root wasn\'t provided');
				throw 'Root wasn\'t provided';
			}
			file = path.join(root, file);
		}

		files[dest].push(file);
	}
	return files;
}

function setFilesForTaskInConfig(task, files, grunt) {
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
		/*if (typeof(files[i]) == typeof([])) {
			for (var j in files[i]) {
				if (!fs.existsSync(files[i][j])) {
					grunt.log.warn('file doesn\' exist: ' + files[i][j]);
					throw 'file doesn\' exist: ' + files[i][j];
				}
			}
		} else {
			if (!fs.existsSync(files[i])) {
				grunt.log.warn('file doesn\' exist: ' + files[i]);
				throw 'file doesn\' exist: ' + files[i];
			}
		}*/
		console.log(files[i]);
		config.automin.files[i] = files[i];
	}

	grunt.config.set(task, config);
}

var pipelines = {
	js: [],
	css: []
};


function concatFilesInPipelineInTmp(files, grunt, task) {
	var tmp = task.options({
		tmp: '.tmp/'
	}).tmp;

	if (tmp[tmp.length - 1] != '/')
		tmp += '/';

	var f2 = {};
	var ret = [];
	for (var i in files) {
		f2[tmp + i] = files[i];
		ret.push(tmp + i);
	}

	setFilesForTaskInConfig('concat', f2, grunt);
	return ret;
}

function processFilesFromConcatInTemp(files, grunt, task, processTaskName) {
	var tmp = task.options({
		tmp: '.tmp/'
	}).tmp;

	if (tmp[tmp.length - 1] != '/')
		tmp += '/';

	var f2 = {};
	for (var i in files) {
		var dest = files[i].substring(tmp.length);
		f2[dest] = files[i];
	}
	setFilesForTaskInConfig(processTaskName, f2, grunt);
}

function cleanTmp(files, grunt, task) {
	var tmp = task.options({
		tmp: '.tmp/'
	}).tmp;

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
	//get the files from block
	function(block) {
		var regex = /<script[\s\S]*?src=['"]([^"'<>]+)["']/g;
		return processJSCSSWithRegex(regex, block);
	},

	//set concat
	concatFilesInPipelineInTmp,

	//set uglify
	function(files, grunt, task) {
		processFilesFromConcatInTemp(files, grunt, task, 'uglify');
	},

	//clean .tmp
	cleanTmp
];

pipelines.css = [
	//get the files from block
	function(block) {
		var regex = /<link[\s\S]*?href=['"]([^"'<>]+)["']/g;
		return processJSCSSWithRegex(regex, block);
	},
	//set concat
	concatFilesInPipelineInTmp,

	//set css
	function(files, grunt, task) {
		processFilesFromConcatInTemp(files, grunt, task, 'cssmin');
	},
	//clean .tmp
	cleanTmp
];

var typeProcessors = {
	js: {
		render: function(block) {
			return '<script src="' + block.dest() + '"></script>';
		}
	},
	css: {
		render: function(block) {
			return '<link rel="stylesheet" type="text/css" href="' + block.dest() + '" />';
		}
	}
};

module.exports = {
	get: function(type) {
		return typeProcessors[type];
	},
	processPipeline: function(type, block) {
		var ret = block;
		for (var i in pipelines[type]) {
			ret = pipelines[type][i](ret, block.context().grunt, block.context().task);
		}
	}
};
