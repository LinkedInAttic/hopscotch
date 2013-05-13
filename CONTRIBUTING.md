Developing
==========
All code is contained in hopscotch-X.X.X.js, where X.X.X denotes the version number.

* `Hopscotch` - controls tour state and contains the exposed API methods such as `startTour()`, `endTour()`, `showStep()`, and so on. You can think of it as the controller.
* `HopscotchBubble` - represents the tour step callout bubble that appears next to target elements. It is responsible for rendering, updating step content, and setting its position. You can think of it as the view.
* `HopscotchCalloutManager` - manages the creation and destruction of single callouts.

CSS is compiled using [LESS](http://lesscss.org/).

Compiling
=========
Use the [Google Closure Compiler](https://developers.google.com/closure/compiler/) to compile hopscotch-X.X.X.js to hopscotch-X.X.X.min.js.

    java -jar /path/to/compiler-latest/compiler.jar --js=js/hopscotch-X.X.X.js --js_output_file=js/hopscotch-X.X.X.min.js

Use the [Less Compiler](http://lesscss.org/) to compile the CSS.

    lessc -x less/hopscotch.less > css/hopscotch.css

Testing
=======
Tests are written using [http://visionmedia.github.io/mocha/](Mocha) and executed in a browser environment. Open test/index.html to run. The test suite is contained in test.hopscotch.js. Please add tests for any new functionality you introduce.

Eventually I will look at [mocha-phantomjs](https://github.com/metaskills/mocha-phantomjs) to see if it is suitable for running tests from CLI.
