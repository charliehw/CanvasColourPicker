module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			dist: {
				src: [
					'src/ColourPicker.js',
					'src/Colour.js',
					'src/Gradient.js',
					'src/Spectrum.js',
					'src/Pointer.js',
					'src/Canvas.js',
					'src/utils.js'
				],
				dest: 'dist/<%= pkg.name %>.js'
			}
		},
		uglify: {
			options: {
				banner: '/*! \n\t<%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n\tAuthor: charliehw\n\tLicense: MIT\n*/\n'
			},
			dist: {
				files: {
					'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
			}
		},
		jshint: {
			files: ['src/*.js'],
			options: {
				// options here to override JSHint defaults
				globals: {
					jQuery: true,
					console: true,
					module: true,
					document: true,
					ccp: true
				}
			}
		},
		qunit: {
			all: ['tests/*.html']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');

	// Default task(s).
	grunt.registerTask('test', ['jshint', 'qunit']);
	grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify']);

};