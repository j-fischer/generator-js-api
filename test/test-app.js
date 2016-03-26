/*global describe, beforeEach, it*/
'use strict';

var path = require('path');
var fs = require('fs-extra');
var exec = require('child_process').exec;
var expect = require ('chai').expect;
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var os = require('os');

describe('js-api:app with skip-install option', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({ 'skip-install': true })
      .withPrompts({ namespace: 'my.Api', filename: 'api' })
      .on('end', done);
  });

  it('creates configuration files', function () {
    assert.file([
      'package.json',
      '.editorconfig',
      '.jshintrc',
      '.gitignore',
      '.hgignore',
      'Gruntfile.js'
    ]);
  });

  it('creates default api and test files', function () {
    assert.file([
      'src/main/javascript/api.js',
      'src/test/javascript/api.spec.js',
      'src/test/karma.conf.js'
    ]);
  });

  it('does not install node modules ', function () {
    assert.noFile([
      'node_modules'
    ]);
  });
});

describe('js-api:app with user overrides', function () {

  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({ 'skip-install': true })
      .withPrompts({ namespace: 'some.Api', module: 'some-api', filename: 'someApi' })
      .on('end', done);
  });

  it('creates user specified api and test files', function () {
    assert.file([
      'src/main/javascript/someApi.js',
      'src/test/javascript/someApi.spec.js'
    ]);

    assert.fileContent('src/main/javascript/someApi.js', /window\.some\.Api = API\;/);
    assert.fileContent('src/main/javascript/someApi.js', /define\(\"some-api\"\,/);
    assert.fileContent('.jshintrc', /"some"\: true/);
  });
});

describe('run grunt', function () {
  // Build should pass in less than 60s even on older computers.
  // Tested on late 2011 Mac Book Pro with 30-60s execution time.
  this.timeout(120000);

  var app;

  before(function (done) {
    this.timeout(4000);

    app = helpers
      .run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './temp-test'), function (dir) {

        // Note: Assumes that 'npm install' was run inside the fixtures folder.
        fs.symlinkSync(path.join(__dirname, 'fixtures/node_modules'),
          path.join(dir, 'node_modules'), 'dir');

        done();
      });
  });

  it ('should pass grunt build', function (done) {
    this.timeout(130000);
    
    app
      .withOptions({ 'skip-install': true })
      .withPrompts({ namespace: 'my.Api', filename: 'api' })
      .on('end', function () {
        exec('grunt', { timeout: 120000 }, function (error, stdout) {
          if (error)
            console.log('Error: ' + error + "\n\n" + stdout);

          console.log(stdout);

          expect(stdout).to.contain('No problems');
          expect(stdout).to.contain('Executed 1 of 1 SUCCESS');
          expect(stdout).to.contain('Done, without errors.');

          assert.file(['docs/coverage', 'docs/jsdoc']);
          assert.file(['dist/api-1.0.0.js', 'dist/api-1.0.0.min.js']);

          done();
        });
      });
    });
  });