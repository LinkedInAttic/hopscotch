import Tour from './modules/tour.es';
import CalloutManager from './modules/calloutManager.es';
import Options from './modules/options.es';

(function (context, factory) {
  'use strict';

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
  let defaultOpts = new Options({});
  let currentTour;
  let calloutMan;

  return {
    startTour: function (tour, stepNum) {
      if (!currentTour) {
        currentTour = new Tour(tour);
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
  }
})));