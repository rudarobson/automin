var fs = require('fs');
var minTypes = require('./types');
var path = require('path');
/*
	if content is given, must be the src file's content
*/
function _getBlocks(context, content) {
	if (!content)
		content = fs.readFileSync(context.srcFull).toString();

	var blocks = [];
	var build = /<!--\s*build:(\w+)\s*([^\s]*)\s*-->([\s\S]*?)<!--\s*\/build\s*-->/g;

	var startMatch;
	while ((startMatch = build.exec(content))) {
		blocks.push(
			new BuildBlock(context, startMatch[1], startMatch[2], startMatch[3], startMatch[0])
		);
	}

	return blocks;
}

var contexts = {};

function BuildBlock(context, type, dest, cont, fullSpan) {
	this.context = function() {
		return context;
	}

	this.type = function() {
		return type;
	};

	this.dest = function() {
		return dest;
	};

	this.html = function() {
		return cont;
	};

	this.process = function() {
		return minTypes.get(this.type()).render(this);
	};

	this.processPipeline = function() {
		minTypes.processPipeline(this.type(), this);
	}

	this.toString = function() {
		return fullSpan;
	};
}

function Transformation(ctx) {

	this.context = function() {
		return ctx;
	}

	var transformation = null;

	this.blocks = null;

	this.toString = function() {
		return transformation;
	};

	this.process = function() {
		var content = fs.readFileSync(this.context().srcFull).toString();
		var blocks = _getBlocks(this.context(), content);
		for (var i in blocks) {
			var newValue = blocks[i].process();
			content = content.replace(blocks[i].toString(), newValue);
			blocks[i].processPipeline();
		}

		this.blocks = blocks;
		transformation = content;
	}
}



var autominApi = {
	transform: function(context) {
		return new Transformation(context);
	}
};

module.exports = autominApi;
