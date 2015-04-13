var fs = require('fs');
var minTypes = require('./types');
var path = require('path');
/*
	if content is given, must be the src file's content
*/
function _getBlocks(content) {
	var blocks = [];
	var build = /<!--\s*build:(\w+)\s*([^\s]*)\s*-->([\s\S]*?)<!--\s*\/build\s*-->/g;

	var startMatch;
	while ((startMatch = build.exec(content))) {
		blocks.push({
			type: startMatch[1],
			target: startMatch[2],
			content: startMatch[3],
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

		for (var i in blocks) {
			var newValue = minTypes.get(blocks[i].type).render(blocks[i].target);
			content = content.replace(blocks[i].fullSpan, newValue);

			minTypes.processPipeline(blocks[i].type, blocks[i].content, srcDir, destDir, blocks[i].target, options);
		}


		return content;
	}
};

module.exports = autominApi;
