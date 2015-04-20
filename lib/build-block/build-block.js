var fs = require('fs');
var minTypes = require('./types');
var path = require('path');
/*
	ex:
	<!-- build:type (another/relative/path) filename.type --> <!-- /build -->
*/
function _getBlocks(content) {
	var blocks = [];
	var build = /<!--\s*build:(\w+)(?:\s+\(([^\)]+)\))?\s*([^\s]*)\s*-->([\s\S]*?)<!--\s*\/build\s*-->/g;

	var startMatch;
	while ((startMatch = build.exec(content))) {
		blocks.push({
			type: startMatch[1],
			relativePath: startMatch[2],
			target: startMatch[3],
			content: startMatch[4],
			fullSpan: startMatch[0]
		});
	}

	return blocks;
}

var contexts = {};


var autominApi = {
	parse: function(src, dest, options) {
		var content = fs.readFileSync(src).toString();

		var blocks = _getBlocks(content);
		var srcDir = path.dirname(src);
		destDir = path.dirname(dest);

		var customRelativePath = /<!--\s*build\s*\*\s*cwd\s*(.*?)\s*-->/; //relative directory changed
		var relMatch = customRelativePath.exec(content);
		if (relMatch) {
			srcDir = relMatch[1];
			content = content.replace(relMatch[0], '');
		}
		
		for (var i in blocks) {
			var newValue = minTypes.get(blocks[i].type).render(blocks[i].target);
			content = content.replace(blocks[i].fullSpan, newValue);
			var newSrcDir = srcDir;
			if (blocks[i].relativePath)
				newSrcDir = blocks[i].relativePath;
			minTypes.processPipeline(blocks[i].type, blocks[i].content, newSrcDir, destDir, blocks[i].target, options);
		}


		return content;
	}
};

module.exports = autominApi;
