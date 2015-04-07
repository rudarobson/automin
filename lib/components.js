var fs = require('fs');
var path = require('path');
var loader = require('./parser');

function replaceRange(s, start, length, substitute) {
	return s.substring(0, start) + substitute + s.substring(start + length);

}

function _buildTemplate(template, replacement) {
	var $template = loader(template);
	var $tag = loader(replacement.tag);

	var cheerio = $template('content');
	for (var i = 0; i < cheerio.length; i++) {
		//console.log(cheerio[i]);
	}

	$template('content').each(function() {
		var content = this;

		var select = $template(this).attr('select');

		if (select) {
			$tag.root().children().first().children(select).each(function() {
				$template(content).before($tag.html(this).trim());
			}).remove();
		} else {
			$template(content).before($tag.root().children().first().html().trim());
			/*$tag.root().children().first().children().each(function() {
				console.log(this.tagName);
				$template(content).before($tag.html(this));
			});*/

			return false; //must break everything was placed inside content
		}
	});


	$template('content').remove();

	return $template.html();
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
			replacements.push({
				tagName: tags[i],
				start: reg.lastIndex - match[0].length,
				length: match[0].length,
				content: match[1],
				tag: match[0]
			});
		}
	}

	var templates = {};
	var newFile = cnt;



	for (var i in replacements.reverse()) {
		var tagName = replacements[i].tagName;
		if (!templates[tagName]) {
			templates[tagName] = fs.readFileSync(path.join(componentsPath, tags[i] + '.html')).toString();
		}
		var tag = _buildTemplate(templates[tagName], replacements[i]);

		newFile = replaceRange(newFile, replacements[i].start, replacements[i].length, tag);
	}

	return newFile;
}

module.exports = {
	parse: function(ctx) {
		var componentsPath = ctx.task.options().componentsPath;
		return _parse(ctx.srcFull, componentsPath);
	}
};
