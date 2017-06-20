"use strict";
var ngrok = require("ngrok");
module.exports = function(grunt) {
    // Load grunt tasks
    require("load-grunt-tasks")(grunt);
    // Grunt configuration
    grunt.initConfig({
        pagespeed: {
            options: {
                nokey: true,
                locale: "en_GB",
                threshold: 40
            },
            local: {
                options: {
                    strategy: "desktop"
                }
            },
            mobile: {
                options: {
                    strategy: "mobile"
                }
            }
        },
        image: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'img/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'img/dist/'
                }]
            }
        },
        uncss: {
            dist: {
                files: {
                    'css/style.css': ['index.html', 'project-2048.html',
                        'project-mobile.html', 'project-webperg.html'
                    ]
                }
            }
        },
        htmlmin: { // Task
            dist: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: { // Dictionary of files
                    'tmp/index.html': 'index.html', // 'destination': 'source'
                    'tmp/project-2048.html': 'project-2048.html',
                    'tmp/project-mobile.html': 'project-mobile.html',
                    'tmp/project-webperf.html': 'project-webperf.html'
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'css/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'css',
                    ext: '.min.css'
                }]
            }
        }
    });
    // Register customer task for ngrok
    grunt.registerTask("psi-ngrok", "Run pagespeed with ngrok", function() {
        var done = this.async();
        var port = 8000;
        ngrok.connect(port, function(err, url) {
            if (err !== null) {
                grunt.fail.fatal(err);
                return done();
            }
            grunt.config.set('pagespeed.options.url', url);
            grunt.task.run('pagespeed');
            done();
        });
    });
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-image');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    // Register default tasks
    grunt.registerTask('default', ['psi-ngrok']);
};