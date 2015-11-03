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

  return {
    startTour(configHash, stepNum) {
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
      currentTour.startTour(stepNum);
    },
    endTour() {
      if (currentTour) {
        //end tour; currentTour reference will be cleared
        //as part of on end tour callback
        currentTour.endTour();
      }
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
    getCurrStepNum() {
      if (currentTour) {
        return currentTour.getCurrStepNum();
      }
      //there is no active tour. Return null
      return null;
    },
    getCurrStepCallout() {
      if (currentTour) {
        return currentTour.getCurrStepCallout();
      }
      //there is no active tour. Return null
      return null;
    },
    getCurrTour() {
      if (currentTour) {
        return currentTour.getOriginalConfig();
      }
      //there is no active tour. Return null
      return null;
    },
    getCalloutManager() {
      if (!calloutMan) {
        calloutMan = new CalloutManager(globalConfig);
      }
      return calloutMan;
    },
    getState() {
    },
    configure(configHash) {
      if (!configHash) {
        return;
      }
      for (let prop in configHash) {
        globalConfig.set(prop, configHash[prop]);
      }
    },
    resetDefaultOptions() {
      globalConfig.reset();
    }
  };
})));