var fs = require('fs');
var path = require('path');
var loader = require('./parser');
var glob = require('glob');

var defaults = {
	componentsPath: null, //this is a required attribute, where to find components

	componentExt: '.html',
	attrAction: 'merge', //can be merge or replace
	//this will be used if attrAction == 'replace'
	attrsToMerge: {},
	//this will be used if attrAction == 'merge'
	attrsToReplace: {},
	parseAllHyphenTags: true,
	validateName: function(name) {
		return /^[a-z0-9]+(?:-[a-z0-9]+)+$/i.test(name);
	}
};

var templates = {};

function _registerTemplate(name, path) {
	if (templates[name] && templates[name].path != path) {
		var message = 'Tag already registered with a different path\nregistered: ' + templates[name].path + '\ntrying to register: ' + path;
		console.log(message);
		if (defaults.parseAllHyphenTags) //stop if must parse all tags
			throw message;
	}

	templates[name] = {
		path: path,
		cnt: null
	};
}

function _validateTagNameAnThrow(alias) {
	if (!defaults.validateName(alias)) {
		var message = 'Invalid tag name: ' + alias;
		console.log(message);
		throw message;
	}
}

function _loadTemplate(name) {
	if (templates[name]) {
		if (!templates[name].cnt) {
			var newPath = path.join(defaults.componentsPath, templates[name].path + defaults.componentExt);
			templates[name].cnt = fs.readFileSync(newPath).toString();
		}

		return templates[name].cnt;
	} else {
		var message = 'Tag ' + name + ' not found!';
		//do not remove this log
		console.log(message);
		throw message;
	}
}

function _parseConfiguraion(src) {
	var configRegex = /<!--\s*components:([\w\W]*?)-->\t*(?:\r?\n)?/i;

	var cntMatch = configRegex.exec(src);
	var newSrc;
	if (cntMatch) {
		var cnt = cntMatch[1];
		var imports = /import\s*([^\s]+)(?:\s*as\s*([^\s]+))?\s*;/ig;
		var match;
		while (match = imports.exec(cnt)) {
			var alias;
			var cmpPath;

			if (match[2]) {
				alias = match[2];
				cmpPath = match[1];
			} else {
				alias = path.basename(match[1]);
				cmpPath = match[1];
			}

			var isDirectory = false;
			var dir = path.join(defaults.componentsPath, cmpPath);
			try {
				isDirectory = fs.lstatSync(dir).isDirectory();
			} catch (e) {

			}

			if (isDirectory) {
				var files = glob.sync('**/*' + defaults.componentExt, {
					cwd: defaults.componentsPath
				});

				for (var i in files) {
					var pathWithoutExt = files[i].slice(0, -(defaults.componentExt.length)); //trim extension
					var newAlias = path.basename(pathWithoutExt);
					_validateTagNameAnThrow(newAlias);

					_registerTemplate(newAlias, pathWithoutExt);
				}
			} else {
				_validateTagNameAnThrow(alias);
				_registerTemplate(alias, cmpPath);
			}
		}
		newSrc = src.replace(cntMatch[0], '');
	} else
		newSrc = src;


	return newSrc
}

function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function _attrEngine(mergeInto, additionalAttrs, action, attrsToMerge, attrsToReplace) {
	for (var i in additionalAttrs) {
		if (mergeInto[i]) {
			if (action == 'replace') {
				if (i in attrsToMerge) //specific attribute to merge instead of replace
					mergeInto[i] = mergeInto[i] + ' ' + additionalAttrs[i];
				else
					mergeInto[i] = additionalAttrs[i];
			} else if (action == 'merge') {
				if (i in attrsToReplace) //specific attribute to replace instead of merge
					mergeInto[i] = mergeInto[i];
				else
					mergeInto[i] = mergeInto[i] + ' ' + additionalAttrs[i];
			} else {
				throw 'Attribute action not recognized';
			}
		} else { //just add the attribute
			mergeInto[i] = additionalAttrs[i];
		}
	}

}

function _parseTagWithContent(template, cnt) {
	var $template = loader(template);
	var $tag = loader(cnt);

	var tagAttrs = $tag.root().children().first()[0].attribs;
	var templateAttrs = $template.root().children().first()[0].attribs;


	_attrEngine(templateAttrs, tagAttrs, defaults.attrAction, defaults.attrsToMerge, defaults.attrsToReplace);


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

	return _parse(html);
}

function _parse(rawCnt) {
	var cnt = _parseConfiguraion(rawCnt);

	var reg = new RegExp('<(\\w+(?:-\\w+)+)[^>]*>', 'g');
	var match;

	var $ = loader(cnt);

	while (match = reg.exec(cnt)) {
		var tagName = match[1];
		var $elt = $(tagName).first();

		var newElt = _parseTagWithContent(_loadTemplate(tagName), $.html($elt));

		$($elt).replaceWith(newElt);
		cnt = $.html();
	}

	return cnt;
}

module.exports = {
	parse: function(ctx) {
		templates = {};
		var cnt = fs.readFileSync(ctx.srcFull).toString();
		return _parse(cnt);
	},
	mergeDefaults: function(d) {
		if ('attrsToMerge' in d) {
			defaults.attrsToMerge = {};
			for (var i in d.attrsToMerge) //map the array to an object
				defaults.attrsToMerge[d.attrsToMerge[i]] = true;
		}

		if ('attrsToReplace' in d) {
			defaults.attrsToReplace = {};
			for (var i in d.attrsToReplace) //map the array to an object
				defaults.attrsToReplace[d.attrsToReplace[i]] = true;
		}

		var simpleProperties = ['componentExt', 'attrAction', 'componentsPath'];
		for (var i in simpleProperties) {
			if (simpleProperties[i] in d)
				defaults[simpleProperties[i]] = d[simpleProperties[i]];
		}
	},
	setDefaults: function(p, d) {
		if (d == undefined)
			defaults = p;
		else
			defaults[p] = d;
	},
	getDefaults: function() {
		return defaults;
	},
};
