var fs = require('fs');
var path = require('path');


function replaceRange(s, start, length, substitute) {
	return s.substring(0, start) + substitute + s.substring(start + length);

}

function _parse(src, componentsPath) {
	var files = fs.readdirSync(componentsPath);

	var tags = [];
	for (var i in files) {
		tags[i] = (files[i] + '?..').replace('.html?..', '');
	}

	var cnt = fs.readFileSync(src).toString();

	var replacements = [];
	for (var i in tags) {
		var reg = new RegExp('<' + tags[i] + '\\s*?>([\\s\\S]*?)</' + tags[i] + '\\s*>', 'g');
		var match;

		while (match = reg.exec(cnt)) {

			var contentReg = new RegExp('<content-([\\w-]*)\\s*>([\\s\\S]*?)</content-\\1\\s*>', 'g');
			var contentMatch;
			var contentReplacement = {};
			while (contentMatch = contentReg.exec(match[1])) {
				contentReplacement[contentMatch[1]] = contentMatch[2];
			}

			replacements.push({
				tagName: tags[i],
				contents: contentReplacement,
				start: reg.lastIndex - match[0].length,
				length: match[0].length
			});
		}
	}

	var templates = {};
	var newFile = cnt;
	for (var i in replacements) {
		var tagName = replacements[i].tagName;
		if (!templates[tagName]) {
			templates[tagName] = fs.readFileSync(path.join(componentsPath, tags[i] + '.html')).toString();
		}

		var template = templates[tagName];

		for (var j in replacements[i].contents) {
			var content = replacements[i].contents[j];
			var specificContentReg = new RegExp('<content-' + j + '\\s*>([\\s\\S]*?)</content-' + j + '\\s*>', 'g')
			template = template.replace(specificContentReg, content);
		}

		newFile = replaceRange(newFile, replacements[i].start, replacements[i].length, template);

	}

	return newFile;
}

module.exports = {
	parse: function(ctx) {
		var componentsPath = ctx.task.options().componentsPath;
		return _parse(ctx.srcFull, componentsPath);
	}
};
