var fs = require('fs');
var minTypes = require('./types');
var path = require('path');
var grunt = require('grunt');
/*
	ex:
	<!-- build:type (another/relative/path) filename.type {options} --> <!-- /build -->
*/
function _getBlocks(content, options) {
	var blocks = [];
	var build = /<!--\s*build:(\w+)(?:\s+\(([^\)]+)\))?\s*([^\s]*)\s*({[\s\S]*?})?\s*-->([\s\S]*?)<!--\s*\/build\s*-->/g;

	var startMatch;
	var process;
	if (options.types) {
		process = {};
		for (var i in options.types) {
			process[options.types[i]] = true;
		}
	}

	while ((startMatch = build.exec(content))) {
		var options = {};
		if (process && process[startMatch[1]] != true)
			continue;

		if (startMatch[4])
			options = JSON.parse(startMatch[4]);

		blocks.push({
			type: startMatch[1],
			relativePath: startMatch[2],
			target: startMatch[3],
			options: options,
			content: startMatch[5],
			fullSpan: startMatch[0]
		});
	}

	return blocks;
}

var contexts = {};

var gruntTargets = {};

function getUniqueGruntTarget() {
	var id;
	do {
		id = parseInt(Math.random() * 100000000);
	} while (gruntTargets[id]);
	gruntTargets[id] = true;

	return id;
}

function mergeObjects(obj1, obj2) {
	for (var attrname in obj2) {
		obj1[attrname] = obj2[attrname];
	}
}


var autominApi = {
	parse: function(src, dest, options) {
		var content = fs.readFileSync(src).toString();

		var blocks = _getBlocks(content, options);
		var srcDir = path.dirname(src);
		destDir = path.dirname(dest);

		var customRelativePath = /<!--\s*build\s*\*\s*cwd\s*(.*?)\s*-->/; //relative directory changed
		var relMatch = customRelativePath.exec(content);
		if (relMatch) {
			srcDir = relMatch[1];
			content = content.replace(relMatch[0], '');
		}

		var pageOptions = /<!--\s*build\s*\*\s*options\s*(.*?)\s*-->/; //page options
		var pageMatch = pageOptions.exec(content);
		var pageOptions = {};
		if (pageMatch) {
			pageOptions = JSON.parse(pageMatch[1]);
			content = content.replace(pageMatch[0], '');
		}



		for (var i in blocks) {
			var opt = {};

			if (options[blocks[i].type])
				mergeObjects(opt, options[blocks[i].type]);

			if (pageOptions[blocks[i].type])
				mergeObjects(opt, pageOptions[blocks[i].type]);

			mergeObjects(opt, blocks[i].options);

			var newValue = minTypes.get(blocks[i].type).render(blocks[i].target);
			content = content.replace(blocks[i].fullSpan, newValue);
			var newSrcDir = srcDir;
			if (blocks[i].relativePath)
				newSrcDir = blocks[i].relativePath;

			var gruntTargetId = getUniqueGruntTarget();
			var tasks = minTypes.processPipeline(gruntTargetId, blocks[i].type, blocks[i].content, newSrcDir, destDir, blocks[i].target, options, opt);

			var keys = [];
			for (var i in tasks) {
				for (var j in tasks[i]) {
					keys.push(i + ':' + j);
				}
			}

			grunt.config.merge(tasks);
			grunt.task.run(keys);
		}

		return content;
	}
};

module.exports = autominApi;
