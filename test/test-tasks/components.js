module.exports = function(grunt) {
	// Project configuration.
	grunt.config.merge({
		// Configuration to be run (and then tested).
		'components': {
			test1: {
				options: {
					componentsPath: '<%= config.components.src %>/test1/components'
				},
				files: {
					'<%= config.components.tmp %>/test1/index.html': ['<%= config.components.src %>/test1/index.html']
				}
			},
			test2: {
				options: {
					componentsPath: '<%= config.components.src %>/test2/components'
				},
				files: {
					'<%= config.components.tmp %>/test2/index.html': ['<%= config.components.src %>/test2/index.html']
				}
			}
		}
	});

	grunt.registerTask('components-test', [
		'build-block:test1'
	]);
};
