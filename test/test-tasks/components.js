module.exports = function(grunt) {
	var tests = {};
	var tasks = [];
	for (var i = 1; i <= 8; i++) {
		var testName = 'test' + i;
		tests[testName] = {
			options: {
				componentsPath: '<%= config.components.src %>/' + testName + '/components'
			},
			files: {}
		};

		tests[testName].files['<%= config.components.tmp %>/' + testName + '/index.html'] = ['<%= config.components.src %>/' + testName + '/index.html'];

		tasks.push('components:' + testName);
	}

	grunt.config.merge({
		// Configuration to be run (and then tested).
		'components': tests
	});

	grunt.registerTask('components-test', tasks);
};
