module.exports = function(grunt) {
	var tests = {};
	var tasks = [];
	for (var i = 1; i <= 3; i++) {
		var testName = 'test' + i;
		tests[testName] = {
			options: {
				layoutsPath: '<%= config.handlebars.src %>/' + testName + '/layouts'
			},
			files: {}
		};

		tests[testName].files['<%= config.handlebars.tmp %>/' + testName + '/index.html'] = ['<%= config.handlebars.src %>/' + testName + '/index.hbs'];

		tasks.push('handlebars:' + testName);
	}
	//custom test
	tests.test3.options.layoutsExt = '.layout';
	
	grunt.config.merge({
		// Configuration to be run (and then tested).
		'handlebars': tests
	});

	grunt.registerTask('handlebars-test', tasks);
};
