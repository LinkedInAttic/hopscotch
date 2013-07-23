Developing
==========

Javascript
----------
* `Hopscotch` - controls tour state and contains the exposed API methods such as `startTour()`, `endTour()`, `showStep()`, and so on. You can think of it as the controller.
* `HopscotchBubble` - represents the tour step callout bubble that appears next to target elements. It is responsible for rendering, updating step content, and setting its position. You can think of it as the view.
* `HopscotchCalloutManager` - manages the creation and destruction of single callouts.

LESS
----
CSS is compiled using [LESS](http://lesscss.org/).

* `hopscotch.less` - The top-level LESS file. Contains most style definitions for the Hopscotch bubble.
* `buttons.less` - Everything related to buttons
* `fade.less` - Everything related to the fade transition animation. The styles here are adopted from Dan Eden's [animate.css](http://daneden.me/animate/).
* `util.less` - A number of utility mixins mostly relating to CSS3 properties.
* `vars.less` - All LESS variables in one location.

Compiling
=========
Hopscotch uses Grunt for minification and hinting. Make sure you have [`npm`](https://npmjs.org) installed. Run `npm install` from the hopscotch directory to load in the dev dependencies, then run `grunt`.

Testing
=======
Hopscotch tests are written using the [Mocha testing framework](http://visionmedia.github.io/mocha/). The tests can be run either in the browser or via the command line. To run the tests in the browser, simply open up test/index.html. To run the tests in the command line, you can run `grunt test`.
