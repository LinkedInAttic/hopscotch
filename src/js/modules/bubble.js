/**
 * HopscotchBubble
 *
 * @class The HopscotchBubble class represents the view of a bubble. This class is also used for Hopscotch callouts.
 */
var HopscotchBubble = function(opt) {
  this.init(opt);
};

HopscotchBubble.prototype = {
  isShowing: false,

  currStep: undefined,

  /**
   * setPosition
   *
   * Sets the position of the bubble using the bounding rectangle of the
   * target element and the orientation and offset information specified by
   * the JSON.
   */
  setPosition: function(step) {
    var bubbleBoundingHeight,
        bubbleBoundingWidth,
        boundingRect,
        top,
        left,
        arrowOffset,
        verticalLeftPosition,
        targetEl     = utils.getStepTarget(step),
        el           = this.element,
        arrowEl      = this.arrowEl,
        arrowPos     = step.isRtl ? 'right' : 'left';

    utils.flipPlacement(step);
    utils.normalizePlacement(step);

    bubbleBoundingWidth = el.offsetWidth;
    bubbleBoundingHeight = el.offsetHeight;
    utils.removeClass(el, 'fade-in-down fade-in-up fade-in-left fade-in-right');

    // SET POSITION
    boundingRect = targetEl.getBoundingClientRect();

    verticalLeftPosition = step.isRtl ? boundingRect.right - bubbleBoundingWidth : boundingRect.left;

    if (step.placement === 'top') {
      top = (boundingRect.top - bubbleBoundingHeight) - this.opt.arrowWidth;
      left = verticalLeftPosition;
    }
    else if (step.placement === 'bottom') {
      top = boundingRect.bottom + this.opt.arrowWidth;
      left = verticalLeftPosition;
    }
    else if (step.placement === 'left') {
      top = boundingRect.top;
      left = boundingRect.left - bubbleBoundingWidth - this.opt.arrowWidth;
    }
    else if (step.placement === 'right') {
      top = boundingRect.top;
      left = boundingRect.right + this.opt.arrowWidth;
    }
    else {
      throw new Error('Bubble placement failed because step.placement is invalid or undefined!');
    }

    // SET (OR RESET) ARROW OFFSETS
    if (step.arrowOffset !== 'center') {
      arrowOffset = utils.getPixelValue(step.arrowOffset);
    }
    else {
      arrowOffset = step.arrowOffset;
    }
    if (!arrowOffset) {
      arrowEl.style.top = '';
      arrowEl.style[arrowPos] = '';
    }
    else if (step.placement === 'top' || step.placement === 'bottom') {
      arrowEl.style.top = '';
      if (arrowOffset === 'center') {
        arrowEl.style[arrowPos] = Math.floor((bubbleBoundingWidth / 2) - arrowEl.offsetWidth/2) + 'px';
      }
      else {
        // Numeric pixel value
        arrowEl.style[arrowPos] = arrowOffset + 'px';
      }
    }
    else if (step.placement === 'left' || step.placement === 'right') {
      arrowEl.style[arrowPos] = '';
      if (arrowOffset === 'center') {
        arrowEl.style.top = Math.floor((bubbleBoundingHeight / 2) - arrowEl.offsetHeight/2) + 'px';
      }
      else {
        // Numeric pixel value
        arrowEl.style.top = arrowOffset + 'px';
      }
    }

    // HORIZONTAL OFFSET
    if (step.xOffset === 'center') {
      left = (boundingRect.left + targetEl.offsetWidth/2) - (bubbleBoundingWidth / 2);
    }
    else {
      left += utils.getPixelValue(step.xOffset);
    }
    // VERTICAL OFFSET
    if (step.yOffset === 'center') {
      top = (boundingRect.top + targetEl.offsetHeight/2) - (bubbleBoundingHeight / 2);
    }
    else {
      top += utils.getPixelValue(step.yOffset);
    }

    // ADJUST TOP FOR SCROLL POSITION
    if (!step.fixedElement) {
      top += utils.getScrollTop();
      left += utils.getScrollLeft();
    }

    // ACCOUNT FOR FIXED POSITION ELEMENTS
    el.style.position = (step.fixedElement ? 'fixed' : 'absolute');

    el.style.top = top + 'px';
    el.style.left = left + 'px';
  },

  /**
   * Renders the bubble according to the step JSON.
   *
   * @param {Object} step Information defining how the bubble should look.
   * @param {Number} idx The index of the step in the tour. Not used for callouts.
   * @param {Function} callback Function to be invoked after rendering is finished.
   */
  render: function(step, idx, callback) {
    var el = this.element,
        tourSpecificRenderer,
        customTourData,
        unsafe,
        currTour,
        totalSteps,
        totalStepsI18n,
        nextBtnText,
        isLast,
        opts;

    // Cache current step information.
    if (step) {
      this.currStep = step;
    }
    else if (this.currStep) {
      step = this.currStep;
    }

    // Check current tour for total number of steps and custom render data
    if(this.opt.isTourBubble){
      currTour = winHopscotch.getCurrTour();
      if(currTour){
        customTourData = currTour.customData;
        tourSpecificRenderer = currTour.customRenderer;
        step.isRtl = step.hasOwnProperty('isRtl') ? step.isRtl :
            (currTour.hasOwnProperty('isRtl') ? currTour.isRtl : this.opt.isRtl);
        unsafe = currTour.unsafe;
        if(Array.isArray(currTour.steps)){
          totalSteps = currTour.steps.length;
          totalStepsI18n = this._getStepI18nNum(this._getStepNum(totalSteps - 1));
          isLast = (this._getStepNum(idx) === this._getStepNum(totalSteps - 1));
        }
      }
    }else{
      customTourData = step.customData;
      tourSpecificRenderer = step.customRenderer;
      unsafe = step.unsafe;
      step.isRtl = step.hasOwnProperty('isRtl') ? step.isRtl : this.opt.isRtl;
    }

    // Determine label for next button
    if(isLast){
      nextBtnText = utils.getI18NString('doneBtn');
    } else if(step.showSkip) {
      nextBtnText = utils.getI18NString('skipBtn');
    } else {
      nextBtnText = utils.getI18NString('nextBtn');
    }

    utils.flipPlacement(step);
    utils.normalizePlacement(step);

    this.placement = step.placement;

    // Setup the configuration options we want to pass along to the template
    opts = {
      i18n: {
        prevBtn: utils.getI18NString('prevBtn'),
        nextBtn: nextBtnText,
        closeTooltip: utils.getI18NString('closeTooltip'),
        stepNum: this._getStepI18nNum(this._getStepNum(idx)),
        numSteps: totalStepsI18n
      },
      buttons:{
        showPrev: (utils.valOrDefault(step.showPrevButton, this.opt.showPrevButton) && (this._getStepNum(idx) > 0)),
        showNext: utils.valOrDefault(step.showNextButton, this.opt.showNextButton),
        showCTA: utils.valOrDefault((step.showCTAButton && step.ctaLabel), false),
        ctaLabel: step.ctaLabel,
        showClose: utils.valOrDefault(this.opt.showCloseButton, true)
      },
      step:{
        num: idx,
        isLast: utils.valOrDefault(isLast, false),
        title: (step.title || ''),
        content: (step.content || ''),
        isRtl: step.isRtl,
        placement: step.placement,
        padding: utils.valOrDefault(step.padding, this.opt.bubblePadding),
        width: utils.getPixelValue(step.width) || this.opt.bubbleWidth,
        customData: (step.customData || {})
      },
      tour:{
        isTour: this.opt.isTourBubble,
        numSteps: totalSteps,
        unsafe: utils.valOrDefault(unsafe, false),
        customData: (customTourData || {})
      }
    };

    // Render the bubble's content.
    // Use tour renderer if available, then the global customRenderer if defined.
    if(typeof tourSpecificRenderer === 'function'){
      el.innerHTML = tourSpecificRenderer(opts);
    }
    else if(typeof tourSpecificRenderer === 'string'){
      if(!winHopscotch.templates || (typeof winHopscotch.templates[tourSpecificRenderer] !== 'function')){
        throw new Error('Bubble rendering failed - template "' + tourSpecificRenderer + '" is not a function.');
      }
      el.innerHTML = winHopscotch.templates[tourSpecificRenderer](opts);
    }
    else if(customRenderer){
      el.innerHTML = customRenderer(opts);
    }
    else{
      if(!winHopscotch.templates || (typeof winHopscotch.templates[templateToUse] !== 'function')){
        throw new Error('Bubble rendering failed - template "' + templateToUse + '" is not a function.');
      }
      el.innerHTML = winHopscotch.templates[templateToUse](opts);
    }

    // Find arrow among new child elements.
    children = el.children;
    numChildren = children.length;
    for (i = 0; i < numChildren; i++){
      node = children[i];

      if(utils.hasClass(node, 'hopscotch-arrow')){
        this.arrowEl = node;
      }
    }

    // Set z-index and arrow placement
    el.style.zIndex = (typeof step.zindex === 'number') ? step.zindex : '';
    this._setArrow(step.placement);

    // Set bubble positioning
    // Make sure we're using visibility:hidden instead of display:none for height/width calculations.
    this.hide(false);
    this.setPosition(step);

    // only want to adjust window scroll for non-fixed elements
    if (callback) {
      callback(!step.fixedElement);
    }

    return this;
  },
  /**
   * Get step number considering steps that were skipped because their target wasn't found
   *
   * @private
   */
  _getStepNum: function(idx) {
    var skippedStepsCount = 0,
        stepIdx,
        skippedSteps = winHopscotch.getSkippedStepsIndexes(),
        i,
        len = skippedSteps.length;
    //count number of steps skipped before current step
    for(i = 0; i < len; i++) {
      stepIdx = skippedSteps[i];
      if(stepIdx<idx) {
        skippedStepsCount++;
      }
    }
    return idx - skippedStepsCount;
  },
  /**
   * Get the I18N step number for the current step.
   *
   * @private
   */
  _getStepI18nNum: function(idx) {
    var stepNumI18N = utils.getI18NString('stepNums');
    if (stepNumI18N && idx < stepNumI18N.length) {
      idx = stepNumI18N[idx];
    }
    else {
      idx = idx + 1;
    }
    return idx;
  },

  /**
   * Sets which side the arrow is on.
   *
   * @private
   */
  _setArrow: function(placement) {
    utils.removeClass(this.arrowEl, 'down up right left');

    // Whatever the orientation is, we want to arrow to appear
    // "opposite" of the orientation. E.g., a top orientation
    // requires a bottom arrow.
    if (placement === 'top') {
      utils.addClass(this.arrowEl, 'down');
    }
    else if (placement === 'bottom') {
      utils.addClass(this.arrowEl, 'up');
    }
    else if (placement === 'left') {
      utils.addClass(this.arrowEl, 'right');
    }
    else if (placement === 'right') {
      utils.addClass(this.arrowEl, 'left');
    }
  },

  /**
   * @private
   */
  _getArrowDirection: function() {
    if (this.placement === 'top') {
      return 'down';
    }
    if (this.placement === 'bottom') {
      return 'up';
    }
    if (this.placement === 'left') {
      return 'right';
    }
    if (this.placement === 'right') {
      return 'left';
    }
  },

  show: function() {
    var self      = this,
        fadeClass = 'fade-in-' + this._getArrowDirection(),
        fadeDur   = 1000;

    utils.removeClass(this.element, 'hide');
    utils.addClass(this.element, fadeClass);
    setTimeout(function() {
      utils.removeClass(self.element, 'invisible');
    }, 50);
    setTimeout(function() {
      utils.removeClass(self.element, fadeClass);
    }, fadeDur);
    this.isShowing = true;
    return this;
  },

  hide: function(remove) {
    var el = this.element;

    remove = utils.valOrDefault(remove, true);
    el.style.top = '';
    el.style.left = '';

    // display: none
    if (remove) {
      utils.addClass(el, 'hide');
      utils.removeClass(el, 'invisible');
    }
    // opacity: 0
    else {
      utils.removeClass(el, 'hide');
      utils.addClass(el, 'invisible');
    }
    utils.removeClass(el, 'animate fade-in-up fade-in-down fade-in-right fade-in-left');
    this.isShowing = false;
    return this;
  },

  destroy: function() {
    var el = this.element;

    if (el) {
      el.parentNode.removeChild(el);
    }
    utils.removeEvtListener(el, 'click', this.clickCb);
  },

  _handleBubbleClick: function(evt){
    var action;

    // Override evt for IE8 as IE8 doesn't pass event but binds it to window
    evt = evt || window.event; // get window.event if argument is falsy (in IE)

    // get srcElement if target is falsy (IE)
    var targetElement = evt.target || evt.srcElement;

    //Recursively look up the parent tree until we find a match
    //with one of the classes we're looking for, or the triggering element.
    function findMatchRecur(el){
      /* We're going to make the assumption that we're not binding
       * multiple event classes to the same element.
       * (next + previous = wait... err... what?)
       *
       * In the odd event we end up with an element with multiple
       * possible matches, the following priority order is applied:
       * hopscotch-cta, hopscotch-next, hopscotch-prev, hopscotch-close
       */
      if(el === evt.currentTarget){ return null; }
      if(utils.hasClass(el, 'hopscotch-cta')){ return 'cta'; }
      if(utils.hasClass(el, 'hopscotch-next')){ return 'next'; }
      if(utils.hasClass(el, 'hopscotch-prev')){ return 'prev'; }
      if(utils.hasClass(el, 'hopscotch-close')){ return 'close'; }
      /*else*/ return findMatchRecur(el.parentElement);
    }

    action = findMatchRecur(targetElement);

    //Now that we know what action we should take, let's take it.
    if (action === 'cta'){
      if (!this.opt.isTourBubble) {
        // This is a callout. Close the callout when CTA is clicked.
        winHopscotch.getCalloutManager().removeCallout(this.currStep.id);
      }
      // Call onCTA callback if one is provided
      if (this.currStep.onCTA) {
        utils.invokeCallback(this.currStep.onCTA);
      }
    }
    else if (action === 'next'){
      winHopscotch.nextStep(true);
    }
    else if (action === 'prev'){
      winHopscotch.prevStep(true);
    }
    else if (action === 'close'){
      if (this.opt.isTourBubble){
        var currStepNum   = winHopscotch.getCurrStepNum(),
            currTour      = winHopscotch.getCurrTour(),
            doEndCallback = (currStepNum === currTour.steps.length-1);

        utils.invokeEventCallbacks('close');

        winHopscotch.endTour(true, doEndCallback);
      } else {
        if (this.opt.onClose) {
          utils.invokeCallback(this.opt.onClose);
        }
        if (this.opt.id && !this.opt.isTourBubble) {
          // Remove via the HopscotchCalloutManager.
          // removeCallout() calls HopscotchBubble.destroy internally.
          winHopscotch.getCalloutManager().removeCallout(this.opt.id);
        }
        else {
          this.destroy();
        }
      }

      utils.evtPreventDefault(evt);
    }
    //Otherwise, do nothing. We didn't click on anything relevant.
  },

  init: function(initOpt) {
    var el              = document.createElement('div'),
        self            = this,
        resizeCooldown  = false, // for updating after window resize
        onWinResize,
        appendToBody,
        children,
        numChildren,
        node,
        i,
        currTour,
        opt;

    //Register DOM element for this bubble.
    this.element = el;

    //Merge bubble options with defaults.
    opt = {
      showPrevButton: defaultOpts.showPrevButton,
      showNextButton: defaultOpts.showNextButton,
      bubbleWidth:    defaultOpts.bubbleWidth,
      bubblePadding:  defaultOpts.bubblePadding,
      arrowWidth:     defaultOpts.arrowWidth,
      isRtl:          defaultOpts.isRtl,
      showNumber:     true,
      isTourBubble:   true
    };
    initOpt = (typeof initOpt === undefinedStr ? {} : initOpt);
    utils.extend(opt, initOpt);
    this.opt = opt;

    //Apply classes to bubble. Add "animated" for fade css animation
    el.className = 'hopscotch-bubble animated';
    if (!opt.isTourBubble) {
      utils.addClass(el, 'hopscotch-callout no-number');
    } else {
      currTour = winHopscotch.getCurrTour();
      if(currTour){
        utils.addClass(el, 'tour-' + currTour.id);
      }
    }

    /**
     * Not pretty, but IE8 doesn't support Function.bind(), so I'm
     * relying on closures to keep a handle of "this".
     * Reset position of bubble when window is resized
     *
     * @private
     */
    onWinResize = function() {
      if (resizeCooldown || !self.isShowing) {
        return;
      }

      resizeCooldown = true;
      setTimeout(function() {
        self.setPosition(self.currStep);
        resizeCooldown = false;
      }, 100);
    };

    //Add listener to reset bubble position on window resize
    utils.addEvtListener(window, 'resize', onWinResize);

    //Create our click callback handler and keep a
    //reference to it for later.
    this.clickCb = function(evt){
      self._handleBubbleClick(evt);
    };
    utils.addEvtListener(el, 'click', this.clickCb);

    //Hide the bubble by default
    this.hide();

    //Finally, append our new bubble to body once the DOM is ready.
    if (utils.documentIsReady()) {
      document.body.appendChild(el);
    }
    else {
      // Moz, webkit, Opera
      if (document.addEventListener) {
        appendToBody = function() {
          document.removeEventListener('DOMContentLoaded', appendToBody);
          window.removeEventListener('load', appendToBody);

          document.body.appendChild(el);
        };

        document.addEventListener('DOMContentLoaded', appendToBody, false);
      }
      // IE
      else {
        appendToBody = function() {
          if (document.readyState === 'complete') {
            document.detachEvent('onreadystatechange', appendToBody);
            window.detachEvent('onload', appendToBody);
            document.body.appendChild(el);
          }
        };

        document.attachEvent('onreadystatechange', appendToBody);
      }
      utils.addEvtListener(window, 'load', appendToBody);
    }
  }
};