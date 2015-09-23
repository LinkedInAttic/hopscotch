import Tour from './modules/tour.js';
import CalloutManager from './modules/calloutManager.js';
import Config from './modules/config.js';

(function (context, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory();
  }

  if (typeof window !== 'undefined') {
    var namespace = 'hopscotch';
    // Browser globals
    if (window[namespace]) {
      // Hopscotch already exists.
      return;
    }
    window[namespace] = factory();
  }
}(this, (function () {
  let defaultConfig = new Config({});
  let globalConfig = new Config({}, defaultConfig);
  let currentTour;
  let calloutMan;

  let hs = {
    startTour: function (config, stepNum) {
      if (!currentTour) {
        currentTour = new Tour(config);
      } else {
        throw new Error('Tour ${currentTour.id}')
      }
      currentTour.startTour(stepNum);
    },
    endTour: function () {
      currentTour = null;
    },
    nextStep: function () {
      if (currentTour) {
        currentTour.nextStep();
      }
    },
    prevStep: function () {
      if (currentTour) {
        currentTour.prevStep();
      }
    },
    getCalloutManager: function () {
      if (!calloutMan) {
        calloutMan =  new CalloutManager();
      }
      return calloutMan;
    }
  };
  
  // Template includes, placed inside a closure to ensure we don't
  // end up declaring our shim globally.
  (function(){
  // @@include('../../src/tl/_template_headers.js') //
  // @@include('../../tmp/js/hopscotch_templates.js') //
  }.call(hs));
  
  return hs;
})));