module.exports = function(grunt){

    grunt.initConfig({

        clean: {

            tmp: {
                src: ['.tmp/**/*']
            },

            public: {
                src: ['public/**/*']
            },

            images: {
                src: ['.tmp/images/**/*']
            },

            js: {
                src: ['.tmp/js/**/*']
            },

            css: {
                src: ['.tmp/css/**/*']
            }

        },

        copy: {
            files: {
                expand: true,
                cwd: 'src',
                src: ['*'],
                dest: 'public',
                filter: 'isFile'
            },

            css:{
                expand: false,
                src: '.tmp/css/styles.min.css',
                dest: 'public/css/styles.min.css'
            },

            js: {
                expand: false,
                src: '.tmp/js/scripts.min.js',
                dest: 'public/js/scripts.min.js'
            },

            initjs: {
                expand: false,
                src: 'src/js/init.js',
                dest: 'public/js/init.js'
            },

            pt: {
                expand: false,
                src: 'src/pt/index.html',
                dest: 'public/pt/index.html'
            },

            en: {
                expand: false,
                src: 'src/en/index.html',
                dest: 'public/en/index.html'
            },

            images: {
                expand: true,
                cwd: '.tmp/images',
                src: '*.{png,jpg,gif,svg}',
                dest: 'public/images/'
            },

            printer: {
                expande: false,
                src: 'src/printer/index.html',
                dest: 'public/printer/index.html'
            },

            printercss: {
                expand: false,
                src: 'src/css/printer.css',
                dest: 'public/css/printer.css'
            }
        },

        concat: {

            js: {
                src: ['src/js/analytics.js', 'src/js/fontawesome.js', 'src/js/materialize.js', 'src/js/app.js'],
                dest: '.tmp/js/scripts.min.js'
            },

            css: {
                src: ['src/css/materialize.css', 'src/css/style.css'],
                dest: '.tmp/css/styles.min.css'
            }
        },

        cssmin: {
            css: {
                files: {
                    '.tmp/css/styles.min.css': '.tmp/css/styles.min.css'
                }
            }
        },

        uglify: {
            js: {
                files: [{
                    src: '.tmp/js/scripts.min.js',
                    dest: '.tmp/js/scripts.min.js'
                }]
            }
        },

        image: {
            
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/images/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: '.tmp/images/'
                }]
            }
        },

        watch: {
            scripts: {
                files: 'src/js/*.js',
                tasks: ['codificando'],
                options: {
                    event: ['added', 'changed', 'deleted'],
                }
            },

            styles: {
                files: 'src/css/*.css',
                tasks: ['estilizando'],
                options: {
                    event: ['added', 'changed', 'deleted'],
                }
            },

            files: {
                files: 'src/*.{html,txt}',
                tasks: ['copy:files'],
                options: {
                    event: ['added', 'changed', 'deleted'],
                }
            },

            pt: {
                files: 'src/pt/index.html',
                tasks: ['copy:pt'],
                options: {
                    event: ['added', 'changed', 'deleted'],
                }
            },

            en: {
                files: 'src/en/index.html',
                tasks: ['copy:en'],
                options: {
                    event: ['added', 'changed', 'deleted'],
                }
            },

            initjs: {
                files: 'src/js/init.js',
                tasks: ['copy:initjs'],
                options: {
                    event: ['added', 'changed', 'deleted']
                }
            },

            images: {
                files: 'src/images/*.{png,jpg,gif,svg}',
                tasks: ['compactando-images'],
                options: {
                    event: ['added', 'changed', 'deleted']
                }
            },

            printer: {
                files: 'src/printer/index.html',
                tasks: ['copy:printer'],
                options: {
                    event: ['added', 'changed', 'deleted']
                }
            },

            printercss: {
                files: 'src/css/printer.css',
                tasks: ['copy:printercss'],
                options: {
                    event: ['added', 'changed', 'deleted']
                }
            }
        }

    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-image');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Tarefas para limpeza
    grunt.registerTask('limpar-tmp', ['clean:tmp']);
    grunt.registerTask('limpar-public', ['clean:public']);
    grunt.registerTask('limpar-images', ['clean:images']);
    grunt.registerTask('limpar-tudo', ['limpar-public', 'limpar-tmp', 'limpar-images']);

    // Tarafa de compactação de imagens
    grunt.registerTask('compactando-images', ['clean:images', 'image:dynamic', 'copy:images']);

    // Tarefas para trabalhar no projeto
    grunt.registerTask('compile', ['limpar-tudo','compactando-images','estilizando', 'codificando', 'copy:files']);
    grunt.registerTask('estilizando', ['concat:css','cssmin', 'copy:css']);
    grunt.registerTask('codificando', ['concat:js','uglify', 'copy:js']);
    grunt.registerTask('publish', ['limpar-tudo','compactando-images','estilizando','codificando','copy:files']);
    grunt.registerTask('default', ['watch']);
};