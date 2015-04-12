var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
var defaults = {
	layoutsExt: '.hbs'
};
require('handlebars-layouts')(Handlebars);



function _parse(src) {
	var template = Handlebars.compile(src);
	var temp = template();
	return temp;
}

module.exports = {
	mergeDefaults: function(def) {
		if (def && def.layoutsExt)
			defaults.layoutsExt = def.layoutsExt;
	},
	registerLayoutsInPath: function(layoutsPath) {
		var layouts = fs.readdirSync(layoutsPath);
		var regex = new RegExp(defaults.layoutsExt + "$");

		for (var i in layouts) {
			if (regex.test(layouts[i])) {
				var name = (layouts[i] + '?..').replace(defaults.layoutsExt + '?..', '');

				Handlebars.unregisterPartial(name);
				Handlebars.registerPartial(name, fs.readFileSync(path.join(layoutsPath, layouts[i]), 'utf8'));
			}
		}
	},
	parse: function(ctx) {
		var cnt = fs.readFileSync(ctx.srcFull).toString();
		return _parse(cnt);
	}
};
