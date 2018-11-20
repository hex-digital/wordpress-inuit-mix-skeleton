<p align="center">
  <img src="https://user-images.githubusercontent.com/2754728/37917923-9e9de498-3117-11e8-95ba-806c31c05a02.png" width="100" height="auto" alt="Hex and Webpack">
</p>

<h1 align="center">Skeleton Theme</h1>
<h3 align="center">A WordPress starter theme with modern frontend tools</h3>

<p align="center">
  <a href="https://github.com/hex-digital/skeleton/releases">
    <img src="https://img.shields.io/badge/version-2.1.0-green.svg?style=flat-square" alt="Version 2.1.0">
  </a>
</p>


Features:

- Webpack, via Laravel Mix - [View on GitHub](https://github.com/JeffreyWay/laravel-mix)
  - SCSS concatenation and minification
  - JS concatenation and minification
  - Babel transpiling for ECMAScript 2015
  - ESLint, based on AirBnB's standards
  - SCSS linting, based on InuitCSS standards
  - Image optimisation
  - SVG Spritesheet system
- InuitCSS v6.0.0 Framework - [View on GitHub](https://github.com/inuitcss/inuitcss)
- ACF Migrations support - [View on GitHub](https://github.com/hex-digital/acf-migrations)
- A Changelog

---

#### Navigate this page

- [Getting started](#getting-started)
  - [Set up the virtual host](#set-up-the-virtual-host)
  - [Install WordPress](#install-wordpress)
  - [Download and install the skeleton theme](#download-and-install-the-skeleton-theme)
  - [Adding the remote repository](#adding-the-remote-repository)
  - [Setup Distributable Files](#setup-distributable-files)
  - [Complete SETUP INSTRUCTIONs](#complete-setup-instructions)
- [Dependencies](#dependencies)
  - [Install dependencies](#install-dependencies)
  - [Setup dependencies](#setup-dependencies)
- [Final setup](#final-setup)
  - [Task running with Laravel Mix](#task-running-with-laravel-mix)
  - [Creating the WordPress tables](#creating-the-wordpress-tables)
- [Contributing](#contributing)

## Getting started

### Set up the virtual host

>Replace any lines that show `{handle}` with your site handle name.

Setup virtual host using checkout script from [github:hex-digital/tools](https://github.com/hex-digital/tools/blob/master/checkout.sh):

    sudo sh ~/Sites/tools/checkout.sh

### Install WordPress

Install latest wordpress using wordpress script from [github:hex-digital/tools](https://github.com/hex-digital/tools/blob/master/wordpress.sh):

    cd ~/Sites/{handle}
    sh ~/Sites/tools/wordpress.sh

### Download and install the skeleton theme

Change directory into the theme directory, and clone the repo:

    cd wp-content/themes/{handle}
    git clone git@github.com:hex-digital/skeleton.git .

>Ensure the line ends with a . when cloning, so that it does not create an
extra folder.

### Adding the remote repository

We're still using the Skeleton Theme repository, but since we're using this as
a skeleton only we want to switch our repository to our project with its own
repository. To do this, run the following commands and ensure to change
{handle} to your correct handle name of the repository:

Clear the skeleton theme git history from our project (NOTE: change `{handle}`
in below code before running it)

    git remote remove origin
    rm -rf .git
    git init
    git remote add origin git@github.com:hex-digital/{handle}.git
    git checkout -b master
    git add .
    git commit -m "Initial commit from skeleton theme v2.1.0"
    git tag -a v0.0.1 -m "Initial commit from skeleton theme v2.1.0"
    git push -u origin master --follow-tags
    git checkout -b development
    git push -u origin development

This may seem long winded but the reason we are doing it this way is to ensure
we do not copy across the version history from the skeleton theme.

### Setup Distributable Files

There are a number of distributable files included with the project. These
supply boilerplate for project admin (README, CHANGELOG), as well as those
required for some dependencies.

They can all be set up like so:

    cp README.md.dist README.md
    cp CHANGELOG.md.dist CHANGELOG.md
    rm README.md.dist CHANGELOG.md.dist
    
### Complete SETUP INSTRUCTIONs

Search the directory for the phrase "SETUP" to find all final setup instructions

    ack "SETUP"
    
Follow these instructions to finalise the theme setup

[(top)](#navigate-this-page)

## Dependencies

### Install dependencies

Now we have the codebase, we need to install dependencies. We use
[yarn](https://yarnpkg.com/lang/en/docs/install/) to install the Node.js
dependencies from package.json, and [composer](https://getcomposer.org/) for
autoloading PHP classes.

    yarn install

>We try to avoid composer dependencies, and only use for autoloading classes.

### Setup dependencies

InuitCSS requires the creation of a config file, which is specific to your environment.
This means it must be created, and not stored in version control. It can be done like so:

    # InuitCSS 6.0.0
    cp resources/sass/settings/_settings.config.dist.scss resources/sass/settings/_settings.config.scss

[(top)](#navigate-this-page)

## Final setup

### Task running with Laravel Mix

We use laravel mix to turn our resource files into build files. This must be
run whenever JS, SCSS or images are changed.

    # Development build, including linting
    yarn run dev

    # Dev build with watch task
    yarn run watch

    # Production build with minification and optimisation
    yarn run production

### Creating the Wordpress tables

Finally, complete WordPress installation at http://{handle}.local.

Set username to hex, and the password to a 32 character length password
generated by LastPass. Finally, set the email to dev@hexdigital.com.

Remember to select the theme from Appearance > Themes.

[(top)](#navigate-this-page)

## Contributing

Please refer to our global Hex GitHub Contributing guidelines for information
on how to contribute to this repository.

[GitHub Contributing Guidelines](https://github.com/hex-digital/guidelines/tree/master/github-contributing)

[(top)](#navigate-this-page)
