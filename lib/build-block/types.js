var path = require('path');
var fs = require('fs');
var grunt = require('grunt');




/*
	@param content: is the content inside the build block
	@param destDir: is de directory destination for the parsing file
	@param target: is the file target in the build
	@param gruntFileOptions: options from GruntFile.js
*/
function processJSCSSWithRegex(regex, content, srcDir, destDir, target, gruntFileOptions) {
	var files = {};

	var dest;
	if (target[0] == '/') { //it's absolute to dstRoot
		var dst = getDestRoot(gruntFileOptions);
		dest = path.join(dst, target);
	} else
		dest = path.join(destDir, target);

	files[dest] = [];
	var match;
	while ((match = regex.exec(content))) {
		var file = match[1];
		if (file[0] != '/') //is relative to current parsing file
			file = path.join(srcDir, file);
		else {
			if (!gruntFileOptions.srcRoot) { //is relative .html to root, must be supplied
				console.log('srcRoot wasn\'t provided');
				throw 'srcRoot wasn\'t provided';
			}
			file = path.join(gruntFileOptions.srcRoot, file);
		}

		files[dest].push(file);
	}
	return files;
}

function mergeInTasks(tasks, taskName, gruntTarget, obj) {
	if (!tasks[taskName])
		tasks[taskName] = {};

	if (tasks[taskName][gruntTarget]) {
		console.log('Target ' + gruntTarget + ' already exists in task:' + taskName);
		throw 'Target ' + gruntTarget + ' already exists in task:' + taskName;
	}

	tasks[taskName][gruntTarget] = obj;
}

function setFilesAndOptionsForTaskInConfig(tasks, gruntTarget, taskName, files, options) {
	var config = {};

	if (!config.files) {
		config.files = {};
	}

	if (options) {
		config.options = options.bypass; //******** may change, options passed directly to underlying plugin
	}

	for (var i in files) {
		if (config.files[i]) {
			console.log('Overwiting file: ' + i);
			throw 'Overwiting file: ' + i;
		}
		config.files[i] = files[i];
	}

	mergeInTasks(tasks, taskName, gruntTarget, config);
}

var pipelines = {
	js: [],
	css: [],
	sass: []
};


function concatFilesInPipelineInTmp(tasks, gruntTarget, files, options, gruntFileOptions) {
	var tmp = gruntFileOptions.tmp || '.tmp/';

	if (tmp[tmp.length - 1] != '/')
		tmp += '/';

	var f2 = {};
	var ret = [];
	for (var i in files) {
		f2[tmp + i] = files[i];
		ret.push(tmp + i);
	}

	setFilesAndOptionsForTaskInConfig(tasks, gruntTarget, 'concat', f2);
	return ret;
}

function processFilesFromConcatInTemp(tasks, gruntTarget, files, options, processTaskName, gruntFileOptions) {
	var tmp = gruntFileOptions.tmp || '.tmp/';

	if (tmp[tmp.length - 1] != '/')
		tmp += '/';

	var f2 = {};
	for (var i in files) {
		var dest = files[i].substring(tmp.length);
		f2[dest] = files[i];
	}
	setFilesAndOptionsForTaskInConfig(tasks, gruntTarget, processTaskName, f2, options);
}


pipelines.js = [
	//get files from block
	function(content, srcDir, destDir, target, blockOptions, gruntFileOptions) {
		var regex = /<script[\s\S]*?src=['"]([^"'<>]+)["']/g;
		return processJSCSSWithRegex(regex, content, srcDir, destDir, target, gruntFileOptions);
	},
	//set concat
	concatFilesInPipelineInTmp,

	//set uglify
	function(tasks, gruntTarget, files, options, gruntFileOptions) {
		processFilesFromConcatInTemp(tasks, gruntTarget, files, options, 'uglify', gruntFileOptions);
	}
];

pipelines.css = [
	//get the files from block
	function(content, srcDir, destDir, target, blockOptions, gruntFileOptions) {
		var regex = /<link[\s\S]*?href=['"]([^"'<>]+)["']/g;
		return processJSCSSWithRegex(regex, content, srcDir, destDir, target, gruntFileOptions);
	},
	//set concat
	concatFilesInPipelineInTmp,

	//set css
	function(tasks, gruntTarget, files, options, gruntFileOptions) {
		processFilesFromConcatInTemp(tasks, gruntTarget, files, options, 'cssmin', gruntFileOptions);
	}
];

pipelines.sass = [
	//get the files from block
	function(content, srcDir, destDir, target, blockOptions, gruntFileOptions) {
		var regex = /<link[\s\S]*?href=['"]([^"'<>]+)["']/g;
		return processJSCSSWithRegex(regex, content, srcDir, destDir, target, gruntFileOptions);
	},
	function(tasks, gruntTarget, files, options, gruntFileOptions) {
		setFilesAndOptionsForTaskInConfig(tasks, gruntTarget, 'sass', files, options);
	}
];

function getDestRoot(options) {
	if (!options.dstRoot) {
		console.log('dstRoot wasn\'t provided');
		throw 'dstRoot wasn\'t provided';
	}
	return options.dstRoot;
}

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
	},
	sass: {
		render: function(target) {
			return '<link rel="stylesheet" type="text/css" href="' + target + '" />';
		}
	}
};


module.exports = {
	get: function(type) {
		return typeProcessors[type];
	},
	processPipeline: function(gruntTarget, type, content, srcDir, destDir, target, gruntFileOptions, opt) {
		var tasks = {};
		var ret = pipelines[type][0](content, srcDir, destDir, target, opt, gruntFileOptions);

		for (var i = 1; i < pipelines[type].length; i++) {
			ret = pipelines[type][i](tasks, gruntTarget, ret, opt, gruntFileOptions);
		}

		return tasks;
	}
};
