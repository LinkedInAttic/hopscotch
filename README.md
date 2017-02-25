![Example Hopscotch tour](/demo/img/screenshot.png)

Hopscotch [![Build Status](https://api.travis-ci.org/linkedin/hopscotch.png)](http://travis-ci.org/linkedin/hopscotch)
=========
Hopscotch is a framework to make it easy for developers to add product tours to their pages. Hopscotch accepts a tour JSON object as input and provides an API for the developer to control rendering the tour display and managing the tour progress.

To learn more about Hopscotch and the API, check out [linkedin.github.io/hopscotch](http://linkedin.github.io/hopscotch/).

What's Here?
------------
- `/archives` contains .zip and .tar.gz files of prior and current distributions of Hopscotch.
- `/demo` has a simple demo page with a Hopscotch tour. Much of the content duplicates what's on the github.io page.
- `/dist` includes compiled files for the current version of Hopscotch. This folder gets zipped up into an archive when a new release is published.
- `/src` contains source files for Hopscotch, including JavaScript and Less. If you're making changes to contribute back to the core repository, this is where you'll want to make them.
- `/test` is our testing suite for the core framework, written using Jasmine.

How do I get started with Hopscotch?
------------------------------------
The Hopscotch files included in `/dist` is a good starting point for working with Hopscotch. Out of the box, Hopscotch includes the core JavaScript for running and interacting with tours, a default template for rendering bubbles, and a default CSS file to provide a basic look and feel for your tours. To get started, simply include these files on your page, then use the Hopscotch API to start a tour. While Hopscotch will use YUI or jQuery if they're present, they're not required.

Check out [linkedin.github.io/hopscotch](http://linkedin.github.io/hopscotch/) for usage examples and a live sample tour. If you'd like to tweak some of the default assets included with Hopscotch to best suit your project's needs, read on for details about how to modify and rebuild a custom version of Hopscotch.

How do I build Hopscotch?
-------------------------
Hopscotch is built using Grunt.js. [Learn more about how to get started with Grunt](http://gruntjs.com/getting-started). Running `grunt` will build Hopscotch (publishing artifacts to `/tmp`) and run the test suite against the newly built artifacts.

How do I test Hopscotch?
------------------------
Testing is done as part of the build process using the [Jasmine testing framework](http://jasmine.github.io/edge/introduction.html). You can run `grunt test` to verify changes.

Continuous integration is run against every pull request using [Travis CI](https://travis-ci.org/). Please verify your changes against the test suite before submitting a pull request! We also recommend adding new tests for any new features or bugfixes as feasible.

How do I tweak Hopscotch to meet my project's requirements?
-----------------------------------------------------------
Depending on your use case, you might want to modify and/or rebuild some of the basic components included with Hopscotch. Some moddable options include...

- CSS tweaks: The Hopscotch stylesheet is written in and compiled using [LESS](http://lesscss.org/). If you make changes to your local copy of these stylesheets, they'll be recompiled when building Hopscotch.
- Bubble markup: The internal markup for Hopscotch bubbles are rendered using templates. See the README.md file in `/src/tl` for details. Any templates in `/src/tl` will be compiled into JavaScript using JST when building Hopscotch and included at the bottom of Hopscotch.js.
- Callbacks & Page Interactivity: See [linkedin.github.io/hopscotch](http://linkedin.github.io/hopscotch/) for details about the Hopscotch API and what tour/callout events you can register events with. Use callbacks to integrate Hopscotch with other libraries and/or presentational elements you might have on your page.

I want to contribute! How can I help?
-------------------------------------
> Note: We're currently in the midst of refactoring Hopscotch into a newer module-based format that should help make readability and maintenance a lot easier. While this work is in progress, we'll be halting changes to the master branch of Hopscotch, apart from major maintenance fixes. Please feel free to continue submitting bug reports, though do keep in mind that they not be addressed in the current iteration of the library. Thanks!

See CONTRIBUTING.md for details on how to contribute back to the public Hopscotch repository on GitHub.