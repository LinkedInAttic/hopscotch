(function(context, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory();
  } else {
    var namespace = 'hopscotch';
    // Browser globals
    if (context[namespace]) {
      // Hopscotch already exists.
      return;
    }
    context[namespace] = factory();
  }
}(this, (function() {

  // @@include('modules/utils.js') //

  var HopscotchI18N = {
        stepNums: null,
        nextBtn: 'Next',
        prevBtn: 'Back',
        doneBtn: 'Done',
        skipBtn: 'Skip',
        closeTooltip: 'Close'
      },
      // Developer's custom i18n strings goes here.
      customI18N = {},
      customRenderer,
      customEscape,
      templateToUse = 'bubble_default',
      Sizzle = window.Sizzle || null,
      callbacks = {
        next:  [],
        prev:  [],
        start: [],
        end:   [],
        show:  [],
        error: [],
        close: []
      },
      /**
     * helpers
     * =======
     * A map of functions to be used as callback listeners. Functions are
     * added to and removed from the map using the functions
     * Hopscotch.registerHelper() and Hopscotch.unregisterHelper().
     */
      helpers = {},
      winLoadHandler,
      defaultOpts ={
        smoothScroll:    true,
        scrollDuration:  1000,
        scrollTopMargin: 200,
        showCloseButton: true,
        showPrevButton:  false,
        showNextButton:  true,
        bubbleWidth:     280,
        bubblePadding:   15,
        arrowWidth:      20,
        skipIfNoElement: true,
        isRtl:           false,
        cookieName:      'hopscotch.tour.state'
      },
      winHopscotch,
      undefinedStr      = 'undefined',
      waitingToStart    = false, // is a tour waiting for the document to finish
                                 // loading so that it can start?
      hasJquery         = (typeof jQuery !== undefinedStr),
      hasSessionStorage = false,
      isStorageWritable = false,
      document          = window.document,
      validIdRegEx      = /^[a-zA-Z]+[a-zA-Z0-9_-]*$/,
      rtlMatches        = {
        left: 'right',
        right: 'left'
      };

  // If cookies are disabled, accessing sessionStorage can throw an error.
  // sessionStorage could also throw an error in Safari on write (even though it exists).
  // So, we'll try writing to sessionStorage to verify it's available.
  try {
    if(typeof window.sessionStorage !== undefinedStr){
      hasSessionStorage = true;
      sessionStorage.setItem('hopscotch.test.storage', 'ok');
      sessionStorage.removeItem('hopscotch.test.storage');
      isStorageWritable = true;
    }
  } catch (err) {}

  if (!Array.isArray) {
    Array.isArray = function(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  // @@include('modules/bubble.js') //
  // @@include('modules/calloutManager.js') //
  // @@include('modules/core.js') //

  /**
   * Called when the page is done loading.
   *
   * @private
   */
  winLoadHandler = function() {
    if (waitingToStart) {
      winHopscotch.startTour();
    }
  };

  utils.addEvtListener(window, 'load', winLoadHandler);

  winHopscotch = new Hopscotch();

  // Template includes, placed inside a closure to ensure we don't
  // end up declaring our shim globally.
  (function(){
  // @@include('../../src/tl/_template_headers.js') //
  // @@include('../../tmp/js/hopscotch_templates.js') //
  }.call(winHopscotch));

  return winHopscotch;

})));