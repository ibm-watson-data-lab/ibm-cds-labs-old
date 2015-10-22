'use strict';

var _         = require('lodash');
var GitHubApi = require('github');

var github = new GitHubApi({
  // required
  version: '3.0.0',

  // optional
  protocol: 'https',
  host: 'api.github.com', // should be api.github.com for GitHub
  timeout: 5000,
  headers: {
    'user-agent': 'IBM-CDS-LABS', // GitHub is happy with a unique user agent
  },
});

github.authenticate({
  type: "oauth",
  token: process.env.GITHUBTOKEN,
});

module.exports = function(grunt) {

  // GitHub Functions
  var processGithubRepo = function(user, repo, url, tech, level, done) {

    var repoDetails = {
      name: '',
      description: '',
      watchers: 0,
      stars: 0,
      forks: 0,
      languages: [],
      tech: tech,
      level: level,
    };
    github.repos.get({user:user, repo:repo}, function(err, res) {

      if (err) {
        console.log('ERROR', err, res, user, repo);
        done();
      } else {

        repoDetails.name = res.name;
        repoDetails.fullName = res.full_name;
        repoDetails.id = res.id;
        repoDetails.description = res.description;
        repoDetails.watchers = res.watchers_count;
        repoDetails.stars = res.stargazers_count;
        repoDetails.forks = res.forks_count;

        var repoCreds = res.full_name.split("/");

        github.repos.getLanguages({user:repoCreds[0], repo:repoCreds[1]}, function(err, res) {

          if (err) {
            console.log('ERROR LANGUAGES', err, res);
            done();
          } else {

            _.forEach(res, function(n, key) {
              if (typeof n === 'number') {
                if (repoDetails.languages.indexOf(key) < 0) {
                  repoDetails.languages.push(key);
                }
              }
            });

            console.log('Adding: ' + repoDetails.fullName);

            var postDetails = '---';
            postDetails += '\n';
            postDetails += 'layout: default';
            postDetails += '\n';
            postDetails += 'title: ' + repoDetails.name;
            postDetails += '\n';
            postDetails += 'name: ' + repoDetails.name;
            postDetails += '\n';
            postDetails += 'fullname: ' + repoDetails.fullName;
            postDetails += '\n';
            postDetails += 'description: ' + repoDetails.description;
            postDetails += '\n';
            postDetails += 'watchers: ' + repoDetails.watchers;
            postDetails += '\n';
            postDetails += 'stars: ' + repoDetails.stars;
            postDetails += '\n';
            postDetails += 'forks: ' + repoDetails.forks;
            postDetails += '\n';
            postDetails += 'languages: ' + repoDetails.languages.join(', ');
            postDetails += '\n';
            postDetails += 'tech: ' + repoDetails.tech.join(', ');
            postDetails += '\n';
            postDetails += 'level: ' + repoDetails.level;
            postDetails += '\n';
            postDetails += 'giturl: ' + url;
            postDetails += '\n';
            postDetails += '---';

            grunt.file.write('_selectedrepos/' + repoDetails.id + '.md', postDetails);

          }
        });

      }
    });
  };

  var processGithubGist = function(id, url, done) {
    github.gists.get({id:id}, function(err, res) {
      if (err) {
        console.log('ERROR', err, res);
        done();
      } else {

        console.log('Adding: ' + res.html_url);

        var postDetails = '---';
        postDetails += '\n';
        postDetails += 'layout: default';
        postDetails += '\n';
        postDetails += 'title: ' + res.html_url;
        postDetails += '\n';
        postDetails += 'name: ' + res.html_url;
        postDetails += '\n';
        postDetails += 'fullname: ' + res.html_url;
        postDetails += '\n';
        postDetails += 'description: ' + res.description;
        postDetails += '\n';
        postDetails += 'forks: ' + res.forks.length;
        postDetails += '\n';
        postDetails += 'giturl: ' + url;
        postDetails += '\n';
        postDetails += '---';

        grunt.file.write('_selectedrepos/gist_' + res.id + '.md', postDetails);
      }
    });
  };

  // Project configuration
  grunt.initConfig({

    // Metadata
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= props.license %> */\n',

    // Task configuration
    jshint: {
      options: {
        node: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        eqnull: true,
        browser: true,
        globals: { jQuery: true },
        boss: true,
      },
      gruntfile: {
        src: 'gruntfile.js',
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js'],
      },
    },
    buildcontrol: {
      options: {
        dir: './',
        commit: true,
        push: true,
        message: 'Build from %sourceCommit% on a branch %sourceBranch%',
      },
      pages: {
        options: {
          branch: 'gh-pages',
          remote: 'git@github.com:ibm-cds-labs/ibm-cds-labs.github.io.git',
        },
      },
    },
    shell: {
      jekyllInstall: {
        command: 'bundle install',
      },
      jekyllBuild: {
        command: 'jekyll build',
      },
      jekyllServe: {
        command: 'jekyll serve --watch',
      },
    },
    http: {
      repos: {
        options: {
          // url: 'https://d14f43e9-5102-45bc-b394-c92520c2c0bd-bluemix.cloudant.com/dw/_design/search/_search/search?q=*%3A*&limit=20&counts=%5B%22topic%22%2C%22technology%22%2C%22type%22%2C%22level%22%2C%22language%22%5D&include_docs=true&sort=%5B%22-date%22%5D',
          url: 'https://3885a4a7-634c-4ade-83fe-966ea8a8d8c7-bluemix.cloudant.com/devcenter/_design/github/_view/github?limit=20&reduce=false&include_docs=true',
        },
        dest: 'github-repos.json',
      },
    },
  });

  // Load all grunt tasks.
  require('load-grunt-tasks')(grunt);

  // These plugins provide necessary tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-build-control');

  // Custom Tasks
  grunt.registerTask('processGithub',
    'Get the GitHub URLs for the approved repo\'s',
    function() {

      var done = this.async();

      var repos = grunt.file.readJSON('github-repos.json');

      for (var i = 0; i < repos.rows.length; i++) {
        var url = repos.rows[i].doc.url;
        var regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        var urlParse = url.match(regex);
        var result = urlParse[4].split('/');
        var user = result[1];
        var repo = result[2];
<<<<<<< HEAD
=======
        var repoDetails = {
          name: '',
          description: '',
          watchers: 0,
          stars: 0,
          forks: 0,
          languages: [],
        };
        github.repos.get({user:user,repo:repo}, function(err, res) {

          if (err) {
            console.log('ERROR',err);
            done;
          }

          repoDetails.name = res.name;
          repoDetails.fullName = res.full_name;
          repoDetails.id = res.id;
          repoDetails.description = res.description;
          repoDetails.watchers = res.watchers_count;
          repoDetails.stars = res.stargazers_count;
          repoDetails.forks = res.forks_count;

          github.repos.getLanguages({user:user,repo:repo}, function(err, res) {
            _.forEach(res, function(n, key) {
              if (typeof n === 'number') {
                if (repoDetails.languages.indexOf(key) < 0) {
                  repoDetails.languages.push(key);
                }
              }
            });
>>>>>>> Add a bit of error checking

        if (urlParse[2] === 'github') {

          processGithubRepo(user, repo, url, repos.rows[i].doc.technologies, repos.rows[i].doc.level, done);

        } else {

          processGithubGist(repo, url, done);

        }

        if (i === (repos.rows.length - 1)) {
          done();
        }
      }
    });

  // Default task
  grunt.registerTask('default', ['jshint',]);
  grunt.registerTask('getGithub', ['http:repos', 'processGithub']);
  grunt.registerTask('build', ['default', 'getGithub', 'shell:jekyllBuild']);
  grunt.registerTask('deploy', ['build', 'buildcontrol']);
  grunt.registerTask('serve', 'Run presentation locally and start watch process (living document).', ['build', 'shell:jekyllServe']);
};
