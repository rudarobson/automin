var fs = require('fs');
var path = require('path');
var loader = require('./parser');

function replaceRange(s, start, length, substitute) {
	return s.substring(0, start) + substitute + s.substring(start + length);
}

function _buildTemplate(tags, templateLoader, template, tag) {
	var $template = loader(template);
	var $tag = loader(tag);

	var tagAttrs = $tag.root().children().first()[0].attribs;
	var templateAttrs = $template.root().children().first()[0].attribs;

	for (var i in tagAttrs) {
		templateAttrs[i] = tagAttrs[i];
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
			return false; //must break everything was placed inside content
		}
	});

	$template('content').remove();
	var html = $template.html();

	return _parse(html, tags, templateLoader);
}

function _parse(cnt, tags, templateLoader) {
	var replacements = [];
	var reg = new RegExp('<(\\w+-(?:\\w+-?)+)[^>]*>', 'g');
	var match;
	var $ = loader(cnt);

	while (match = reg.exec(cnt)) {
		var tagName = match[1];
		var $elt = $(tagName).first();
		var newElt = _buildTemplate(tags, templateLoader, templateLoader(tagName), $.html($elt));

		$($elt).replaceWith(newElt);
		cnt = $.html();
	}

	return cnt;
}

module.exports = {
	parse: function(ctx) {
		var componentsPath = ctx.task.options().componentsPath;
		var cnt = fs.readFileSync(ctx.srcFull).toString();
		var templates = {};

		var templateLoader = function(templateName) {
			if (!templates[templateName]) {
				templates[templateName] = fs.readFileSync(path.join(componentsPath, templateName + '.html')).toString();
			}

			return templates[templateName];
		}

		var tags = [];
		var files = fs.readdirSync(componentsPath);
		for (var i in files) {
			tags[i] = (files[i] + '?..').replace('.html?..', '');
		}

		return _parse(cnt, tags, templateLoader);
	}
};
