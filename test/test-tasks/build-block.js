module.exports = function(grunt) {
	// Project configuration.
	grunt.config.merge({
		// Configuration to be run (and then tested).
		'build-block': {
			options: {
				tmp: '.automin-tmp'
			},
			test1: {
				options: {
					root: '<%= config.buildBlock.src %>/test1'
				},
				files: {
					'<%= config.buildBlock.tmp %>/test1/replace-api.html': ['<%= config.buildBlock.src %>/test1/replace-api.html']
				}
			},
			test2: {
				options: {
					root: '<%= config.buildBlock.src %>/test2'
				},
				files: {
					'<%= config.buildBlock.tmp %>/test2/subdir/replace-api.html': ['<%= config.buildBlock.src %>/test2/subdir/replace-api.html'],
				}
			},
			test3: {
				options: {
					root: '<%= config.buildBlock.src %>/test3'
				},
				files: {
					'<%= config.buildBlock.tmp %>/test3/replace-api-with-script-another-dir.html': ['<%= config.buildBlock.src %>/test3/replace-api-with-script-another-dir.html']
				}
			},
			test4: {
				options: {
					root: '<%= config.buildBlock.src %>/test4'
				},
				files: {
					'<%= config.buildBlock.tmp %>/test4/index.html': ['<%= config.buildBlock.src %>/test4/index.html']
				}
			}
		}
	});



	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');



	grunt.registerTask('build-block-test', [
		'build-block:test1',
		'build-block:test2',
		'build-block:test3',
		'build-block:test4',
		'concat:automin',
		'uglify:automin',
		'cssmin:automin'
		//'clean:automin'
	]);
};
