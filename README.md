# generator-js-api [![Build Status](https://secure.travis-ci.org/j-fischer/generator-js-api.png?branch=master)](https://travis-ci.org/j-fischer/generator-js-api)

[Yeoman](http://yeoman.io) generator that scaffolds out a develoment environment for a Javascript API.

## Features

* Automatically lint your scripts
* Unit Testing with Karma and PhantomJS
* Minification and versioning
* Support for source maps
* Support for JSDoc

For more information on what `generator-js-api` can do for you, take a look at the Gruntfile.js.


## Getting Started

- Install: `npm install -g generator-js-api`
- Run: `yo js-api`
- Run `grunt` for building

## Prompts

* namespace

  The namspace (default is 'my.Api') will be added to the API's (see filename prompt below) file. The API file will ensure that the
  namespace is created for testing and that the top level object is known to JSHint. There is no validation done on the namespace.

* module

  The name of the AMD module (default is 'my-api') will used when registering the API as an AMD module. The module will only be registered if the define function is present and contains the 'amd' property.

* filename

  This input will be the filename of your API. It will be used to rename the default, 'api.js', to whatever you choose, i.e. my-api.js.
  Any whitespace within the filename will be replaced with a dash '-'.

## Options

* `--skip-install`

  Skips the automatic execution of `npm install` after scaffolding has finished.

## Project Overview

The API template uses a functional style for the API, which allows for better encapsulation by declaring private functions and members.
All public interface methods are returned by the function in form of an object. They can either point to private function or be a function implementation themselves.

## Contribute

Feel free to contact me if you like to contribute.

If not, `generator-js-api` is fork-friendly and you can always maintain a custom version which you `npm install && npm link` to continue using via `yo js-api` or a name of your choosing.

## Changelog

### 0.7.0

- Upgraded yeoman-generator dependency and fixed deprecated calls
- Changed JsMock dependency version to 0.x
- Switch grunt task loader to git-grunt
- Added missing dependencies to package.json

### 0.6.0

- Upgraded yeoman-generator dependency and fixed deprecated calls

### 0.5.0

- Switched mocking library from Sinon.JS to [JsMock](http://jsmock.org)

### 0.4.1

- Updated package due to NPM packaging errors

### 0.4.0

- Updated all npm dependencies in generator and templates

## License

[MIT](http://opensource.org/licenses/MIT)