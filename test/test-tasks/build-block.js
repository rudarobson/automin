module.exports = function(grunt) {
	// Project configuration.
	var tests = {
		options: {
			tmp: '.automin-tmp'
		},
	};

	var tasks = [];
	for (var i = 1; i <= 5; i++) {
		var testName = 'test' + i;
		tests[testName] = {
			options: {
				root: '<%= config.buildBlock.src %>/' + testName
			},
			files: {}
		};

		tests[testName].files['<%= config.buildBlock.tmp %>/' + testName + '/index.html'] = ['<%= config.buildBlock.src %>/' + testName + '/index.html'];

		tasks.push('build-block:' + testName);
	}

	tests.test2.files['<%= config.buildBlock.tmp %>/test2/index.html'] = ['<%= config.buildBlock.src %>/test2/subdir/index.html'];

	grunt.config.merge({
		'build-block': tests,
		clean: {
			'build-block': ['.automin-tmp']
		}
	});

	tasks.push('concat:automin');
	tasks.push('uglify:automin');
	tasks.push('cssmin:automin');
	tasks.push('clean:build-block');

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.registerTask('build-block-test', tasks);
};
