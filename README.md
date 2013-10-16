![Example Hopscotch tour](/demo/img/screenshot.png)

Hopscotch
=========
Hopscotch is a framework to make it easy for developers to add product tours to their pages. Hopscotch accepts a tour JSON object as input and provides an API for the developer to control rendering the tour display and managing the tour progress. Seeing is believing, so why not check out a [demo](http://linkedin.github.io/hopscotch)!

Features
========
* Callbacks for tour events (e.g. onStart, onEnd, onShow, onNext, onPrev, onClose)
* Multi-page persistence using HTML5 sessionStorage using cookies as a fallback
* I18N support
* Lightweight single callouts

General Usage
=============

To get started using the Hopscotch framework, simply include `hopscotch.css` and `hopscotch.js` on your page. This will load the hopscotch object into the global window object for you.

```html
<html>
  <head>
    <title>My First Hopscotch Tour</title>
    <link rel="stylesheet" href="css/hopscotch.css"></link>
  </head>
  <body>
    <h1 id="header">My First Hopscotch Tour</h1>
    <div id="content">
      <p>Content goes here...</p>
    </div>
    <script src="js/hopscotch.js"></script>
    <script src="js/my_first_tour.js"></script> <!-- define and start your tour in this file -->
  </body>
</html>
```

Then in your `my_first_tour.js` file, define and start your tour.

```javascript
// Define the tour!
var tour = {
  id: "hello-hopscotch",
  steps: [
    {
      title: "My Header",
      content: "This is the header of my page.",
      target: "header",
      placement: "right"
    },
    {
      title: "My content",
      content: "Here is where I put my content.",
      target: document.querySelector("#content p"),
      placement: "bottom"
    }
  ]
};

// Start the tour!
hopscotch.startTour(tour);
```

That's all there is to it!

Defining a Tour
===============
A Hopscotch tour consists of a tour id, an array of tour steps defined as JSON objects, and a number of tour-specific options. The tour id is simply a unique identifier string. The simplest tour consists of just an id string and an array of one or more steps.

Basic step options
------------------
The step options below are the most basic options.

```javascript
{
  id: {STRING - id of the tour},
  steps: [
    {
      target:         STRING/ELEMENT - id of the target DOM element or DOM element itself,
      placement:      STRING         - ["top", "bottom", "right", "left"]
      title:          STRING         - step title,
      content:        STRING         - step content
    },
    ...
  ]
}
```

Note that title and content are both optional only because you can choose to have a step with only a title, only content, or both title and content.

This is an example of a tour defined with only basic steps.

```javascript
{
  id: "welcome_tour",
  steps: [
    {
      target: "header",
      placement: "bottom",
      title: "This is the navigation menu",
      content: "Use the links here to get around on our site!"
    },
    {
      target: "profile-pic",
      placement: "right",
      title: "Your profile picture",
      content: "Upload a profile picture here. This is the image that others will see next to your activity."
    },
    {
      target: "inbox",
      placement: "bottom",
      title: "Your inbox",
      content: "Messages from other users will appear here."
    }
  ]
}
```

**IMPORTANT** -- title and content are set using `element.innerHTML`. This allows the inclusion of very basic markup like links and lists. However, it also allows the inclusion of malicious script injections when used improperly. It is highly recommended to never show user-generated content in a Hopscotch tour. If it is absolutely necessary, you must properly escape the input, as always.

All step options
----------------
The comprehensive list of step options are listed below:

### MANDATORY ###

* `target` [STRING/ELEMENT/ARRAY] - id of the target DOM element or DOM element itself. It is also possible to define an array of several targets. If an array is provided, Hopscotch will use the first target that exists on the page and disregard the rest.

* `placement` [STRING] - specifies where the bubble should appear in relation to the target. Valid values are "top", "bottom", "right", "left".

### OPTIONAL ###

* `title` [STRING] - step title. Note that while title is optional, at the least either title or content should be present.

* `content` [STRING] - step content. Note that while content is optional, at the least either title or content should be present.

* `width` [INT] - bubble width

* `padding` [INT] - bubble padding

* `xOffset` [INT] - horizontal position adjustment for bubble. Value can be number of pixels or "center". *Default*: 0.

* `yOffset` [INT] - vertical position adjustment for bubble. Value can be number of pixels or "center". *Default*: 0.

* `arrowOffset` [INT] - offset for the bubble arrow. Value can be number of pixels or "center". *Default*: 0.

* `delay` [INT] - number in milliseconds to wait before showing step. *Default*: 0.

* `zindex` [INT] - sets the z-index of the bubble

* `showNextButton` [BOOLEAN] - should show the next button. *Default*: true.

* `showPrevButton` [BOOLEAN] - should show the prev button. *Default*: true.

* `showCTAButton` [BOOLEAN] - should show the call-to-action button. This is a custom button you can use for any purpose. See the onCTA option for more. *Default*: false.

* `ctaLabel` [STRING] - label for the call-to-action button.

* `multipage` [BOOLEAN] - indicates that the next step is on a different page. *Default*: false.

* `showSkip` [BOOLEAN] - if true, 'Next' button reads 'Skip'. *Default*: false.

* `fixedElement` [BOOLEAN] - set to true if the target element has fixed positioning. *Default*: false.

* `nextOnTargetClick` [BOOLEAN] - triggers nextStep() when the target is clicked. *Default*: false.

* `onPrev` [FUNCTION] - callback for when 'Previous' button is clicked

* `onNext` [FUNCTION] - callback for when 'Next' button is clicked

* `onShow` [FUNCTION] - callback for when step is first displayed

* `onCTA` [FUNCTION] - callback for the optional call-to-action button

Setting tour options
--------------------
Tour options can be specified either through the tour JSON object, or through a call to hopscotch.configure(). These options apply to the entire tour. In cases where there is both a value specified in the tour options and in a step definition, (e.g. "showPrevButton") the step definition takes priority. When multiple callbacks are defined in both step and tour options, step callbacks are invoked before tour-wide callbacks.

* `id` [STRING] - *Mandatory* A unique identifier string for your tour. Used for keeping state.

* `bubbleWidth` [NUMBER] - Default bubble width. *Default*: 280.

* `bubblePadding` [NUMBER] - Default bubble padding. *Default*: 15.

* `smoothScroll` [BOOLEAN] - Should the page scroll smoothly to the next step? *Default*: true.

* `scrollDuration` [NUMBER] - Duration of page scroll in milliseconds. Only relevant when smoothScroll is set to true. *Default*: 1000.

* `scrollTopMargin` [NUMBER] - When the page scrolls, how much space should there be between the bubble/targetElement and the top of the viewport? *Default*: 200.

* `showCloseButton` [BOOLEAN] - Should the tour bubble show a close (X) button? *Default*: true.

* `showPrevButton` [BOOLEAN] - Should the bubble have the Previous button? *Default*: false.

* `showNextButton` [BOOLEAN] - Should the bubble have the Next button? *Default*: true.

* `arrowWidth` [NUMBER] - Default arrow width. (space between the bubble and the targetEl) Used for bubble position calculation. This option is provided for the case where the developer wants to use custom CSS to adjust the size of the arrow. *Default*: 20.

* `skipIfNoElement` [BOOLEAN] - If a specified target element is not found, should we skip to the next step? *Default*: true.

* `nextOnTargetClick` [BOOLEAN] - Should we advance to the next step when the user clicks on the target? *Default*: false.

* `onNext` [FUNCTION] - Invoked after every click on a "Next" button.

* `onPrev` [FUNCTION] - Invoked after every click on a "Prev" button.

* `onStart` [FUNCTION] - Invoked when the tour is started.

* `onEnd` [FUNCTION] - Invoked when the tour ends.

* `onClose` [FUNCTION] - Invoked when the user closes the tour before finishing.

* `onError` [FUNCTION] - Invoked when the specified target element doesn't exist on the page.

* `i18n` [OBJECT] - For i18n purposes. Allows you to change the text of button labels and step numbers.

* `i18n.nextBtn` [STRING] - Label for next button

* `i18n.prevBtn` [STRING] - Label for prev button

* `i18n.doneBtn` [STRING] - Label for done button

* `i18n.skipBtn` [STRING] - Label for skip button

* `i18n.closeTooltip` [STRING] - Text for close button tooltip

* `i18n.stepNums` [ARRAY<STRING>] - Provide a list of strings to be shown as the step number, based on index of array. Unicode characters are supported. (e.g., ['&#x4e00;', '&#x4e8c;', '&#x4e09;']) If there are more steps than provided numbers, Arabic numerals ('4', '5', '6', etc.) will be used as default.

API Methods
===========

The Hopscotch framework comes with a simple set of API calls with which you can run and manage tours:

* `hopscotch.startTour(tour[, stepNum])` - Actually starts the tour. Optional stepNum argument specifies what step to start at.

* `hopscotch.showStep(idx)` - Skips to a given step in the tour

* `hopscotch.prevStep()` - Goes back one step in the tour

* `hopscotch.nextStep()` - Goes forward one step in the tour

* `hopscotch.endTour([clearState])` - Ends the current tour. If clearState is set to false, the tour state is preserved. Otherwise, the tour state is cleared by default.

* `hopscotch.configure(options)` - Sets options for running the tour. Note: if this method is called after loading a tour, the options specified will override the options defined in the tour. See above section "Setting tour options" for a list of configuration options.

* `hopscotch.getCurrTour()` - Returns the currently running tour.

* `hopscotch.getCurrTarget()` - Returns the target object of the currently running step.

* `hopscotch.getCurrStepNum()` - Returns the zero-based step number of the currently running tour.

* `hopscotch.getState()` - Checks for tour state saved in sessionStorage/cookies and returns the state if it exists. Use this method to determine whether or not you should resume a tour.

* `hopscotch.listen(eventName, callback)` - Adds a callback for one of the event types. Valid event types are: *start*, *end*, *next*, *prev*, *show*, *close*, *error*

* `hopscotch.unlisten(eventName, callback)` - Removes a callback for one of the event types.

* `hopscotch.removeCallbacks(eventName[, tourOnly])` - Remove callbacks for hopscotch events. If tourOnly is set to true, only removes callbacks specified by a tour (callbacks set by hopscotch.configure or hopscotch.listen will remain). If eventName is null or undefined, callbacks for all events will be removed.

* `hopscotch.registerHelper(id, fn)` - Registers a callback helper. See the section about Helpers below.

* `hopscotch.unregisterHelper(id)` - Unregisters a callback helper. See the section about Helpers below.

* `hopscotch.resetDefaultI18N()` - Resets i18n strings to original default values.

* `hopscotch.resetDefaultOptions()` - Resets all config options to original values.

Defining callbacks
==================

Hopscotch has several events to which you can assign callbacks. These events include *start*, *end*, *next*, *prev*, *show*, *close*, *error*. For the *next*, *prev*, and *show* events, you can assign callbacks within step definitions as well as in the tour itself.

There are two ways to define event callbacks:

Function literals
-----------------
If you are specifying your tour as an object literal in Javascript, you can provide a function literal as the value of your callback. This would look like the following:

```javascript
var tour = {
  id: 'myTour',
  steps: [
    {
      target: 'firststep',
      placement: 'bottom',
      title: 'My First Step',
      onNext: function() {
        $('#firststep').hide();
      }
    }
  ],
  onStart: function() {
    $('#article').addClass('selected');
  }
};
```

Callback Helpers
----------------
In some situations, you may want to specify your tour in JSON. This may be because you are dynamically creating a tour on the server. Since functions are not valid JSON, specifying a function literal will not work. Instead, you can use Hopscotch helpers to specify your callback. Using helpers will look something like the following.

First register the helper with Hopscotch.

```javascript
hopscotch.registerHelper('selectArticle', function() {
  $('#article').addClass('selected');
});
```

An example with an argument passed in:

```javascript
hopscotch.registerHelper('fillText', function(textFieldId, textStr) {
  document.getElementById(textFieldId).value = textStr;
});
```

Then, when you define your tour, you specify the callback as an array of the following form: `[helperId, arg, arg, ...]`. For example:

```javascript
{
  id: "myTour",
  steps: [
    {
      target: "firststep",
      placement: "bottom",
      title: "My First Step",
      onNext: ["fillText", "searchField", "Example search query"]
    }
  ],
  onStart: ["selectArticle"]
}
```

In the above example, since the onStart callback has no arguments, it could be defined as a simple string "selectArticle" instead of being wrapped in a one-element array.

To specify several helpers for a certain event:

```javascript
{
  id: "myTour",
  steps: [
    ...
  ],
  onStart: [["fillText", "searchField", "Example search query"], "selectArticle"]
}
```

Callbacks will be invoked in the order that they are specified.

To remove a helper, simply call `hopscotch.unregisterHelper('myHelperId')`.

Tour Example
============

Here is an example of a Hopscotch tour.

```javascript
{
  id: "hello-hopscotch",
  steps: [
    {
      target: "hopscotch-title",
      title: "Welcome to Hopscotch!",
      content: "Hey there! This is an example Hopscotch tour. There will be plenty of time to read documentation and sample code, but let\'s just take some time to see how Hopscotch actually works.",
      placement: "bottom",
      arrowOffset: 60
    },
    {
      target: document.querySelectorAll("#general-usage code")[1],
      title: "Where to begin",
      content: "At the very least, you\'ll need to include these two files in your project to get started.",
      placement: "right",
      yOffset: -20
    },
    {
      target: "my-first-tour-file",
      placement: "top",
      title: "Define and start your tour",
      content: "Once you have Hopscotch on your page, you\'re ready to start making your tour! The biggest part of your tour definition will probably be the tour steps."
    },
    {
      target: "start-tour",
      placement: "right",
      title: "Starting your tour",
      content: "After you\'ve created your tour, pass it in to the startTour() method to start it.",
      yOffset: -25
    },
    {
      target: "basic-options",
      placement: "top",
      title: "Basic step options",
      content: "These are the most basic step options: <b>target</b>, <b>title</b>, <b>content</b>, and <b>placement</b>. For some steps, they may be all you need.",
      arrowOffset: 120,
      xOffset: 100
    }
  ],
  showPrevButton: true,
  scrollTopMargin: 100
}
```

Hopscotch Callouts
==================
Sometimes all you need is a simple callout. You can use Hopscotch Callouts to achieve this.

```javascript
var calloutMgr = hopscotch.getCalloutManager();
calloutMgr.createCallout({
  id: 'attach-icon',
  target: 'attach-btn',
  placement: 'bottom',
  title: 'Now you can share images &amp; files!',
  content: 'Share a project you\'re proud of, a photo from a recent event, or an interesting presentation.'
});
```

Callouts come with the same options available as tour steps, so you can specify things like width, placement, offsets, and z-index. The most important difference between tour steps and callouts is that you **must** supply an `id` when creating a callout for later reference.

All management of callouts is done through the Hopscotch Callout Manager. The Callout Manager's job is pretty simple and comes with only a handful of API methods.

* `calloutMgr.createCallout(options)` - Creates callout referenced by an id. Options are the same as tour step options, where applicable.
* `calloutMgr.getCallout(id)` - Returns the callout object for the given id.
* `calloutMgr.removeCallout(id)` - Removes the callout for the given id from the page.
* `calloutMgr.removeAllCallouts()` - Removes all registered callouts from the page.
