'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  _copyAndReplace: function(args) {
    var file = this.readFileAsString(this.templatePath(args.sourcePath));
    file = file.replace(args.placeholder, args.value);
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

    this.prompt([{
      type    : 'input',
      name    : 'namespace',
      message : 'What is the fully qualified name of your API (namepsace + class name), i.e. "com.mycompany.SomeApi"',
      default : "my.Api"
    }, 
    {
      type    : 'input',
      name    : 'filename',
      message : 'What is the file name of your API. The extension ".js" will be automatically added',
      default : this.appname.trim().replace(/\s/g, "-") // Default to current folder name with white spaces removed or replaced
    }
    ], function (answers) {
      this.env.options = answers;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      var answers = this.env.options;
          
      this.src.copy('Gruntfile.js', 'Gruntfile.js');
      
      this._copyAndReplace({
        sourcePath: 'package.json', 
        placeholder: '{{$FILENAME}}', 
        value: answers.filename
      });
      
      this._copyAndReplace({
        sourcePath: 'src/main/javascript/api.js', 
        destPath: 'src/main/javascript/' + answers.filename + '.js', 
        placeholder: /\{\{\$API_NAME\}\}/g, 
        value: answers.namespace
      });
      
      this._copyAndReplace({
        sourcePath: 'src/test/javascript/api.spec.js', 
        destPath: 'src/test/javascript/' + answers.filename + '.spec.js', 
        placeholder: /\{\{\$API_NAME\}\}/g, 
        value: answers.namespace
      });
      
      this.src.copy('src/test/karma.conf.js', 'src/test/karma.conf.js');
    },

    projectfiles: function () {
      var answers = this.env.options;
      
      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('gitignore', '.gitignore');
      this.src.copy('hgignore', '.hgignore');
      
      this._copyAndReplace({
        sourcePath: 'jshintrc', 
        destPath: '.jshintrc', 
        placeholder: '{{$NAMESPACE_ROOT}}', 
        value: answers.namespace.split('.')[0]
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
