import Config from './config.js';
import TemplateManager from '../managers/TemplateManager.js';
import PlacementManager from '../managers/PlacementManager.js';
import * as Utils from './utils.js';

/**
 * Base class for individual callouts. Handles the configuration,
 * positioning, and display of callouts on the page in concert
 * with individual managers.
 */
export class Callout {
  /**
   * Constructs an individual callout instance.
   *
   * @param {Object} configHash   - Configuration properties for this specific
   *                                callout. Either this is the configuration
   *                                properties for a particular tour step or
   *                                the callout itself.
   * @param {Config} globalConfig - The parent configuration object, including
   *                                all properties above the current
   *                                step/callout level.
   */
  constructor(configHash, globalConfig) {
    /**
     * The configuration object for this individual step/callout.
     * @type {Config}
     */
    this.config = new Config(configHash, globalConfig);

    /**
     * The DOM node for this callout that markup will be rendered into.
     * @type {Element}
     */
    this.el = null;
  }

  /**
   * Render the callout on the page. Of note, this doesn't actually display
   * the callout... instead this generates the markup and inserts it into
   * the DOM. Call `show()` afterwards to actually display.
   */
  render() {
    if (!this.el) {
      this.el = document.createElement('div');
      Utils.addClass(this.el, 'hopscotch-bubble');
      document.body.appendChild(this.el);
    }

    this.el.innerHTML = TemplateManager.render(
      this.config.get('renderer'),
      this.getRenderData()
      );
    PlacementManager.setCalloutPosition(this);
  }

  /**
   * Show the callout on the page.
   */
  show() {
    if (!this.el) {
      return;
    }
    Utils.removeClass(this.el, 'hide');
  }

  /**
   * Hide the callout on the page.
   */
  hide() {
    if (!this.el) {
      return;
    }
    Utils.addClass(this.el, 'hide');
  }

  /**
   * Fully remove this callout from the DOM.
   */
  destroy() {
    if (this.el && this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
      this.el = null;
    }
  }

  /**
   * Fetch the data required to render this callout on the page.
   *
   * @returns {Object} The template data that should be passed
   *                   on to the TemplateManager.
   */
  getRenderData() {
    return {
      i18n: {
        prevBtn: 'prevBtn',
        nextBtn: 'nextBtn',
        closeTooltip: 'closeTooltip',
        stepNum: 0,
        numSteps: 0
      },
      buttons: {
        showPrev: false,
        showNext: false,
        showCTA: this.config.get('showCTA'),
        ctaLabel: this.config.get('ctaLabel'),
        showClose: this.config.get('showCloseButton')
      },
      step: {
        title: this.config.get('title'),
        content: this.config.get('content'),
        isRtl: this.config.get('isRtl'),
        placement: this.config.get('placement'),
        padding: this.config.get('padding'),
        width: this.config.get('width'),
        customData: this.config.get('customData')
      },
      tour: {
        unsafe: this.config.get('unsafe')
      }
    };
  }

  /**
   * Find the DOM element this callout points to
   *
   * @returns {Element} DOM element that is the target of this callout
   */
  getTargetElement() {
    /* User can configure their own way of finding target element via hopscotch.configure. For example jQuery
     * hopscotch.configure({
     *  getTarget: function(target){
     *    return jQUery(target);
     *  }
     * });
     * If not specified getTarget defaults to Utils.getTargetEl
    */
    let getTarget = this.config.get('getTarget');
    if (typeof getTarget !== 'function') {
      throw new Error('Can not find target element because \'getTarget\' is not a function');
    }

    let targetEl = getTarget(this.config.get('target'));
    if (!Utils.isDOMElement(targetEl)) {
      throw new Error('Target element is not a DOM object. Please provide valid target DOM element or query selector via \'target\' option.');
    }
    return targetEl;
  }
}

/**
 * Subclass with logic specific to steps within a tour.
 */
export class TourCallout extends Callout {
  /**
   * Construct an individual callout instance for a step within a tour.
   *
   * @param {Object} configHash   - Configuration properties for this specific
   *                                callout's step.
   * @param {Tour} tour           - The tour this callout belongs to.
   * @param {Number} stepNumber   - Index of the step within tour's steps
   */
  constructor(configHash, tour, stepNumber) {
    super(configHash, tour.config);

    /**
     * The tour this callout belongs to.
     * @type {Tour}
     */
    this._tour = tour;
    this._stepNumber = stepNumber;
  }

  /**
   * Fetch the data required to render this step's callout on the page.
   *
   * @override
   * @returns {Object} The template data that should be passed on to
   *                   the TemplateManager. Injects additional data
   *                   specific to tour steps.
   */
  getRenderData() {
    let opts = super.getRenderData();
    let tourStepsCount = this._tour.getStepsCount();
    let isLastStep = this._stepNumber === (tourStepsCount - 1);
    //get step number accounting for skipped steps
    let adjustedStepNumber = this._tour.getStepNumber(this);

    let tourOpts = {
      i18n: {
        stepNum: adjustedStepNumber + 1,
        nextBtn: isLastStep ? 'doneBtn' : 'nextBtn'
      },
      buttons: {
        showPrev: this.config.get('showPrevButton') && adjustedStepNumber > 0,
        showNext: this.config.get('showNextButton')
      },
      step: {
        num: this._stepNumber,
        isLast: isLastStep
      },
      tour: {
        isTour: true,
        numSteps: tourStepsCount,
        customData: this._tour.config.get('customData')
      }
    };

    for (let key in tourOpts) {
      if (typeof opts[key] === 'undefined') {
        opts[key] = tourOpts[key];
      } else {
        Utils.extend(opts[key], tourOpts[key]);
      }
    }
    return opts;
  }

  /**
   * Renders markup of the callout and inserts callout element into the DOM
   * @override
   */
  render() {
    super.render();
    Utils.addClass(this.el, 'tour-' + this._tour.id);
  }
}

/**
 * Standalone callout which is not part of a tour.
 * These callouts don't have a number or buttons
 * to navigate between steps.
 */
export class StandaloneCallout extends Callout {
  /**
   * Constructs an individual standalone callout instance.
   *
   * @param {Object} configHash   - Configuration properties for this specific
   *                                callout.
   * @param {Config} globalConfig - The parent configuration object.
   */
  constructor(configHash, globalConfig) {
    if (!Utils.isIdValid(configHash.id)) {
      throw new Error('Callout ID is using an invalid format. Use alphanumeric, underscores, and/or hyphens only. First character must be a letter.');
    }

    super(configHash, globalConfig);
  }

  /**
   * Renders markup of the callout and inserts callout element into the DOM
   * @override 
   */
  render() {
    super.render();
    Utils.addClass(this.el, 'hopscotch-callout no-number');
  }
}