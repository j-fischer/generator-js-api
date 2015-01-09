/*global describe, beforeEach, it*/
'use strict';

var path = require('path');
var fs = require('fs-extra');
var exec = require('child_process').exec;
var expect = require ('chai').expect;
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('rjs-ember:app with skip-install option', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withOptions({ 'skip-install': true })
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
  
  it('creates api and test files', function () {
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
    app
      .withOptions({ 'skip-install': true })
      .on('end', function () {
        exec('grunt', function (error, stdout, stderr) {
          if (error)
            console.log('Error: ' + error);
          
          expect(stdout).to.contain('No problems');  
          expect(stdout).to.contain('Executed 1 of 1\u001b[32m SUCCESS');
          expect(stdout).to.contain('Done, without errors.');
          done();
        });
      });
    });      
  });