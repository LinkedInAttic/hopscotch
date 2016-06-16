import Tour from './modules/tour.js';
import Config from './modules/config.js';
import CalloutManager from './managers/CalloutManager.js';
import TemplateManager from './managers/TemplateManager.js';
import * as Utils from './modules/utils.js';

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
  arrowOffset: 15,
  skipIfNoElement: true,
  isRtl: false,
  cookieName: 'hopscotch.tour.state',
  getTarget: Utils.getTargetEl
});
let globalConfig = new Config({}, defaultConfig);
let currentTour;
let calloutMan;
let tmplClosureOut = {};
  
// Template includes, placed inside a closure to ensure we don't
// end up declaring our shim globally.
(function () {
  // @@include('../../src/tl/_template_headers.js') //
  // @@include('../../tmp/js/hopscotch_templates.js') //
}.call(tmplClosureOut));

// Hacky code to move templates from old namespace to TemplateManager.
for (let tl in tmplClosureOut.templates) {
  TemplateManager.registerTemplate(tl, tmplClosureOut.templates[tl]);
}

/**
 * Top level class that defines public API for Hopscotch
 */
export default class Hopscotch {
  /**
   * Start a tour
   * @param {Object} configHash - The tour configuration JSON object
   * @param {Number} stepNumber - Specifies what step to start at. Optional
   *
   * @return {Hopscotch} - Returns itself to allow chaining method calls 
   */
  startTour(configHash, stepNumber) {
    if (!currentTour) {
      currentTour = new Tour(configHash, globalConfig);
    } else {
      throw new Error('Can not start a tour. Tour \'' + currentTour.id + '\' is currently in progress');
    }
    //subscribe to tour end event, so hopscotch can clear the
    //currentTour reference once tour ends
    currentTour.on('end', () => {
      currentTour = null;
    });
    currentTour.startTour(stepNumber);
    return this;
  }

  /**
   * Cancels out of an active tour.
   *
   * @return {Hopscotch} - Returns itself to allow chaining method calls 
   */
  endTour() {
    if (currentTour) {
      //end tour; currentTour reference will be cleared
      //as part of on end tour callback
      currentTour.endTour();
    }
    return this;
  }

  /**
   * Goes forward one step in the tour
   * 
   * @return {Hopscotch} - Returns itself to allow chaining method calls 
   */
  nextStep() {
    if (currentTour) {
      currentTour.nextStep();
    }
    return this;
  }

  /**
   * Goes back one step in the tour
   * 
   * @return {Hopscotch} - Returns itself to allow chaining method calls 
   */
  prevStep() {
    if (currentTour) {
      currentTour.prevStep();
    }
    return this;
  }

  /**
   * Skips to a given step in the tour
   *
   * @param {Number} stepNumber - Zero-based step number
   * @return {Hopscotch} - Returns itself to allow chaining method calls 
   */
  showStep(stepNumber) {
    if (currentTour) {
      currentTour.showStep(stepNumber);
    }
    return this;
  }

  /**
    * Returns the current zero-based step number. Returns null if there is no active tour.
    *
    * @return {Number} - The current zero-based step number. Returns null if there is no active tour.
    */
  getCurrStepNum() {
    if (currentTour) {
      return currentTour.getCurrStepNum();
    }
    //there is no active tour. Return null
    return null;
  }

  /**
    * Returns the Callout object representing current step of the tour. Returns null if there is no active tour.
    *
    * @return {Callout} - The Callout object of current tour step. Returns null if there is no active tour.
    */
  getCurrStepCallout() {
    if (currentTour) {
      return currentTour.getCurrStepCallout();
    }
    //there is no active tour. Return null
    return null;
  }

  /**
   * Returns the JSON configuration of the currently running tour. Returns null if there is no active tour.
   * 
   * @return {Object} - JSON configuration of the current tour. Null if no actie tour.
   */
  getCurrTour() {
    if (currentTour) {
      return currentTour.getOriginalConfig();
    }
    //there is no active tour. Return null
    return null;
  }

  /**
   * Returns an object that will help create and manage stand alone Hopscotch callouts.
   * 
   * @return {CalloutManager} - An object that will help manage stand alone Hopscotch callouts
   */
  getCalloutManager() {
    if (!calloutMan) {
      calloutMan = new CalloutManager(globalConfig);
    }
    return calloutMan;
  }

  /**
   * Checks for tour state saved in sessionStorage/cookies and returns the state if it exists.
   * Use this method to determine whether or not you should resume a tour.
   *
   * @returns {String} - State of previous tour run, or empty string if none exists.
   */
  getState() {
    return '';
  }

  /**
   * Sets global options for running the tour and for standalone callouts
   *
   * @return {Hopscotch} - Returns itself to allow chaining method calls
   */
  configure(configHash) {
    if (!configHash) {
      return;
    }
    for (let prop in configHash) {
      globalConfig.set(prop, configHash[prop]);
    }
    return this;
  }

  /**
   * Resets all config options to original values.
   *
   * @return {Hopscotch} - Returns itself to allow chaining method calls 
   */
  resetDefaultOptions() {
    globalConfig.reset();
    return this;
  }
}

let hs = new Hopscotch();
// Node/CommonJS
if (typeof module !== 'undefined' && typeof module.exports === 'object') {
  module.exports = hs;
} 

//Create browser global if hopscotch does not already exist.
if (typeof window !== 'undefined' && typeof window.hopscotch === 'undefined') {
  window.hopscotch = hs;
}
