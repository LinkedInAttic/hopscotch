import Tour from './modules/tour.js';
import Config from './modules/config.js';
import CalloutManager from './managers/CalloutManager.js';
import TemplateManager from './managers/TemplateManager.js';
import * as Utils from './modules/utils.js';

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
} (this, (function () {
  let defaultConfig = new Config({
    renderer: 'bubble_default',
    smoothScroll: true,
    scrollDuration: 1000,
    scrollTopMargin: 200,
    showCloseButton: true,
    showPrevButton: false,
    showNextButton: true,
    width: 280,
    padding: 15,
    arrowWidth: 20,
    skipIfNoElement: true,
    isRtl: false,
    cookieName: 'hopscotch.tour.state',
    getTarget: Utils.getTargetEl
  });
  let globalConfig = new Config({}, defaultConfig);
  let currentTour;
  let calloutMan;
  
  // Template includes, placed inside a closure to ensure we don't
  // end up declaring our shim globally.
  (function () {
    // @@include('../../src/tl/_template_headers.js') //
    // @@include('../../tmp/js/hopscotch_templates.js') //
  }.call(TemplateManager));

  return {
    startTour(configHash, stepNum) {
      if (!currentTour) {
        currentTour = new Tour(configHash, globalConfig);
      } else {
        throw new Error('Tour \'' + currentTour.id + '\' is currently in progress');
      }
      currentTour.startTour(stepNum);
    },
    endTour() {
      currentTour = null;
    },
    nextStep() {
      if (currentTour) {
        currentTour.nextStep();
      }
    },
    prevStep() {
      if (currentTour) {
        currentTour.prevStep();
      }
    },
    getCalloutManager() {
      if (!calloutMan) {
        calloutMan = new CalloutManager(globalConfig);
      }
      return calloutMan;
    },
    getState() {
    }
  };
})));