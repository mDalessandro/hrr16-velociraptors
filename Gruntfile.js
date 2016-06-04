module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    concat: {
      options:{
        separator:';'
      },
      files:{
        src: [
          'client/app/**/*.js',
          '!client/app/leaflet'
        ],
        dest: 'client/build/clientBuilt.js'
      }
    },
    nodemon: {
      dev: {
        script: 'index.js'
      }
    },

    uglify: {
      options: {
        mangle: false
      },
      my_target:{
        files:{
          'client/build/client.min.js': ['client/build/client.ng.js']
        }
      }

    },


    // eslint: {
    //   files: [
    //     'Gruntfile.js',
    //     'client/**/*.js',
    //     'server/**/*.js'
    //   ],
    //   options: {
    //     force: 'true',
    //     eslintrc: '.eslintrc',
    //     ignores: ['client/lib/**/*.js', 'client/build/**/*.js']
    //   }
    // },

    cssmin: {
      css:{
        files:{
          'client/build/styles.min.css': ['client/styles/styles.css']
        }
      }
    },

    watch: {
      scripts: {
        files: ['client/**/*.js'],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'client/styles/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push heroku master'
      }
    },
    bower: {
        install: {
            options: {
              targetDir: '.client/lib'
            }
        }
    },
    ngAnnotate: {
        options: {
            singleQuotes: true
        },
        app: {
            files: {
                'client/build/client.ng.js': ['client/build/clientBuilt.js']
            }
        }
    }



  });

  grunt.loadNpmTasks('grunt-ng-annotate'); 
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////
  grunt.registerTask('heroku:production', 
    ['build']
  );

  // grunt.registerTask('test', [
  //   'eslint'
  // ]);

  grunt.registerTask('build', [
    'bower',
    'concat',
    'ngAnnotate', 
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
      grunt.task.run([ 'shell:prodServer' ]);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // 'test',
    'build',
    'upload'
  ]);
};

//heroku buildpacks:set https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git
//heroku config:set NODE_ENV=production