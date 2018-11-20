# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.1.0] - 2018-05-09
### Changes
- Improve the tools.text scss file to make utilising text styles easier
- Add in-depth comments to the tools.text scss file

### Bug fixes
- Temporarily removed imageminMozJpeg plugin from build chain due to deployment error

## [2.0.3] - 2018-04-07
### Changes
- Change o-icon-{name} to o-icon--{name}.
- Give default styling to all o-icon objects, and a place to define default SVG fills and strokes.
- Add the o-icon--caret by default.

## [2.0.2] - 2018-04-05
### Fixes
- Fix the SVG Icons overwriting their height/width with inherit. SVG icons are 
now an object, which sets width and height, so component level can override.

## [2.0.1] - 2018-04-05
### Fixes
- Fix a malformed h1 closing tag in the README.md.dist file.
- Fix the unexpected behaviour of webpack processing image URLs in CSS.

### Changes
- Improved the README by adding Setup Instructions, tagging and removing dist files.
- Add SETUP Instruction flags to several ones that were missing it.

## [2.0.0] - 2018-03-27
### Breaking Changes
- Upgrade InuitCSS to latest 6.0.0. This comes with a multitude of fixes,
breaking changes and features, which can be found [here](https://github.com/inuitcss/inuitcss/blob/develop/CHANGELOG.md). [[#6](https://github.com/hex-digital/skeleton/issues/6)]

### New Features
- Sunset gulp and move to laravel mix instead. [[#5](https://github.com/hex-digital/skeleton/issues/5)]
- Add SVG sprite system to laravel mix. [[#13](https://github.com/hex-digital/skeleton/issues/13)]
- Add JS linting, via ESLint, using the AirBnB base config. [[#5](https://github.com/hex-digital/skeleton/issues/5)]
- Add SCSS linting, via stylelint, using Inuit CSS config. [[#16](https://github.com/hex-digital/skeleton/issues/16)]

## [1.0.1] - 2018-03-02
### Fixes
- Improve cache invalidation by correctly using DeployBot revision string, and
fixing the reference to the .revision file.
- Clean up the functions file and improve the README.

## [1.0.0] - 2017-06-04
### New features
- InuitCSS for SCSS.
- ACF migrations for easier Custom Fields via ACF.
- Multiple task runners with gulp for images, code concatenation, etc.
