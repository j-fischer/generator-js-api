'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  
  _copy: function(src, dest) {
    this.fs.copy(
      this.templatePath(src),
      this.destinationPath(dest)
    );
  },
  
  _copyAndReplace: function(args) {
    var file = this.readFileAsString(this.templatePath(args.sourcePath));
    
    for (var i = 0; i < args.replacements.length; i++) {
      var repl = args.replacements[i];
      file = file.replace(repl.placeholder, repl.value);
    }
    
    this.write(this.destinationPath(args.destPath || args.sourcePath), file);
  },
  
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the ' + chalk.red('JsApi') + ' generator!'
    ));

    var moduleName = this.appname.trim().replace(/\s/g, "-"); // Default to current folder name with white spaces removed or replaced
    this.prompt([{
      type    : 'input',
      name    : 'namespace',
      message : 'What is the fully qualified name of your API (namepsace + class name), i.e. "com.mycompany.SomeApi"',
      default : "my.Api"
    }, 
    {
      type    : 'input',
      name    : 'module',
      message : 'What is the name of your API\'s AMD module, i.e "some-api"',
      default : moduleName
    }, 
    {
      type    : 'input',
      name    : 'filename',
      message : 'What is the file name of your API. The extension ".js" will be automatically added',
      default : moduleName
    }
    ], function (answers) {
      this.env.options = answers;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      var answers = this.env.options;
          
      this._copy('Gruntfile.js', 'Gruntfile.js');
      
      this._copyAndReplace({
        sourcePath: 'package.json', 
        replacements: [{
          placeholder: '{{$FILENAME}}', 
          value: answers.filename
        }]
      });
      
      this._copyAndReplace({
        sourcePath: 'src/main/javascript/api.js', 
        destPath: 'src/main/javascript/' + answers.filename + '.js', 
        replacements: [
          { placeholder: /\{\{\$API_NAME\}\}/g, value: answers.namespace },
          { placeholder: /\{\{\$MODULE_NAME\}\}/g, value: answers.module.toLowerCase() }
        ]
      });
      
      this._copyAndReplace({
        sourcePath: 'src/test/javascript/api.spec.js', 
        destPath: 'src/test/javascript/' + answers.filename + '.spec.js', 
        replacements: [{
          placeholder: /\{\{\$API_NAME\}\}/g, 
          value: answers.namespace
        }]
      });
      
      this._copy('src/test/karma.conf.js', 'src/test/karma.conf.js');
    },

    projectfiles: function () {
      var answers = this.env.options;
      
      this._copy('editorconfig', '.editorconfig');
      this._copy('gitignore', '.gitignore');
      this._copy('hgignore', '.hgignore');
      
      this._copyAndReplace({
        sourcePath: 'jshintrc', 
        destPath: '.jshintrc', 
        replacements: [{
          placeholder: '{{$NAMESPACE_ROOT}}', 
          value: answers.namespace.split('.')[0]
        }]
      });
    }
  },

  end: function () {
    var generator = this;    
    generator.installDependencies({
      skipInstall: generator.options['skip-install'],
      bower: false,
      callback: function () {
        if (generator.options['skip-install']) {
          generator.log("All done. The installation of the dependencies has been skipped. You need to run 'npm install' before you can run 'grunt' to build your API. If karma cannot find PhantomJS, run 'npm install karma-phantomjs-launcher' to install its missing dependencies. Cheers");
        } else {
          /* The following installation will install the missing dependencies for the karma-phantomjs-launcher. Those dependencies won't be installed
           * when running 'npm install' as this only installs top-level modules listed in package.json (see https://github.com/npm/npm/issues/1341). 
           */
          generator.log("Running 'npm install karma-phantomjs-launcher' to ensure its dependencies will be installed. This will avoid issues with PhantomJS when running grunt.");
          generator.npmInstall(['karma-phantomjs-launcher']);

          generator.log(yosay(
            "All done. You can run 'grunt' to build your API. Cheers"
          ));
        }
      }
    });
  }
});
