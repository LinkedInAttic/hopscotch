(function(context, namespace) {
  var Hopscotch,
      HopscotchBubble,
      HopscotchCalloutManager,
      HopscotchI18N,
      Sizzle = window.Sizzle || null,
      utils,
      callbacks,
      helpers,
      winLoadHandler,
      hasCssTransitions,
      winHopscotch      = context[namespace],
      undefinedStr      = 'undefined',
      waitingToStart    = false, // is a tour waiting for the document to finish
                                 // loading so that it can start?
      defaultOpts       = {
        animate:         false,
        smoothScroll:    true,
        scrollDuration:  1000,
        scrollTopMargin: 200,
        showCloseButton: true,
        showPrevButton:  false,
        showNextButton:  true,
        bubbleWidth:     280,
        bubblePadding:   15,
        arrowWidth:      20,
        skipIfNoElement: true
      },
      hasJquery         = (typeof window.jQuery !== undefinedStr),
      hasSessionStorage = (typeof window.sessionStorage !== undefinedStr),
      document          = window.document;

  if (winHopscotch) {
    // Hopscotch already exists.
    return;
  }

  if (!Array.isArray) {
    Array.isArray = function(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

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

  if (window.addEventListener) {
    window.addEventListener('load', winLoadHandler, false);
  }
  else if (window.attachEvent) {
    window.attachEvent('onload', winLoadHandler);
  }

  /**
   * utils
   * =====
   * A set of utility functions, mostly for standardizing to manipulate
   * and extract information from the DOM. Basically these are things I
   * would normally use jQuery for, but I don't want to require it for
   * this framework.
   *
   * @private
   */
  utils = {
    /**
     * addClass
     * ========
     * Adds a class to a DOM element.
     * Note: does not support adding multiple classes at once yet
     *
     * @private
     */
    addClass: function(domEl, classToAdd) {
      var domClasses,
          i, len;

      if (domEl.className.length === 0) {
        domEl.className = classToAdd;
      }
      else {
        domClasses = domEl.className.split(/\s+/);
        for (i = 0, len = domClasses.length; i < len; ++i) {
          if (domClasses[i] === classToAdd) {
            return;
          }
        }
        domClasses.splice(0, 0, classToAdd); // add new class to list
        domEl.className = domClasses.join(' ');
      }
    },

    /**
     * removeClass
     * ===========
     * Remove a class from a DOM element.
     * Note: this one DOES support removing multiple classes.
     *
     * @private
     */
    removeClass: function(domEl, classToRemove) {
      var domClasses,
          classesToRemove,
          currClass,
          i,
          j,
          toRemoveLen,
          domClassLen;

      classesToRemove = classToRemove.split(/\s+/);
      domClasses = domEl.className.split(/\s+/);
      for (i = 0, toRemoveLen = classesToRemove.length; i < toRemoveLen; ++i) {
        currClass = classesToRemove[i];
        for (j = 0, domClassLen = domClasses.length; j < domClassLen; ++j) {
          if (domClasses[j] === currClass) {
            break;
          }
        }
        if (j < domClassLen) {
          domClasses.splice(j, 1); // remove class from list
        }
      }
      domEl.className = domClasses.join(' ');
    },

    /**
     * @private
     */
    getPixelValue: function(val) {
      var valType = typeof val;
      if (valType === 'number') { return val; }
      if (valType === 'string') { return parseInt(val, 10); }
      return 0;
    },

    /**
     * Inspired by Python... returns val if it's defined, otherwise returns the default.
     *
     * @private
     */
    valOrDefault: function(val, valDefault) {
      return typeof val !== undefinedStr ? val : valDefault;
    },

    supportsCssTransitions: function() {
      var docStyle = document.body.style;
      return (typeof docStyle.MozTransition    !== undefinedStr ||
              typeof docStyle.MsTransition     !== undefinedStr ||
              typeof docStyle.webkitTransition !== undefinedStr ||
              typeof docStyle.OTransition      !== undefinedStr ||
              typeof docStyle.transition       !== undefinedStr);
    },

    /**
     * Invokes a single callback represented by an array.
     * Example input: ["my_fn", "arg1", 2, "arg3"]
     * @private
     */
    invokeCallbackArrayHelper: function(arr) {
      // Logic for a single callback
      var fn;
      if (Array.isArray(arr)) {
        fn = helpers[arr[0]];
        if (typeof fn === 'function') {
          fn.apply(this, arr.slice(1));
        }
      }
    },

    /**
     * Invokes one or more callbacks. Array should have at most one level of nesting.
     * Example input:
     * ["my_fn", "arg1", 2, "arg3"]
     * [["my_fn_1", "arg1", "arg2"], ["my_fn_2", "arg2-1", "arg2-2"]]
     * [["my_fn_1", "arg1", "arg2"], function() { ... }]
     * @private
     */
    invokeCallbackArray: function(arr) {
      var i, len;

      if (Array.isArray(arr)) {
        if (typeof arr[0] === 'string') {
          // Assume there are no nested arrays. This is the one and only callback.
          utils.invokeCallbackArrayHelper(arr);
        }
        else { // assume an array
          for (i = 0, len = arr.length; i < len; ++i) {
            utils.invokeCallback(arr[i]);
          }
        }
      }
    },

    /**
     * Helper function for invoking a callback, whether defined as a function literal
     * or an array that references a registered helper function.
     * @private
     */
    invokeCallback: function(cb) {
      if (typeof cb === 'function') {
        cb();
      }
      if (typeof cb === 'string' && helpers[cb]) { // name of a helper
        helpers[cb]();
      }
      else { // assuming array
        utils.invokeCallbackArray(cb);
      }
    },

    /**
     * First invoke tour-wide helper. If stepCb (the step-specific helper
     * callback) is passed in, then invoke it afterwards.
     *
     * @private
     */
    invokeEventCallbacks: function(evtType, stepCb) {
      var cbArr = callbacks[evtType],
          callback,
          fn,
          i,
          len;

      for (i=0, len=cbArr.length; i<len; ++i) {
        this.invokeCallback(cbArr[i].cb);
      }

      if (stepCb) {
        this.invokeCallback(stepCb);
      }
    },

    /**
     * @private
     */
    getScrollTop: function() {
      var scrollTop;
      if (typeof window.pageYOffset !== undefinedStr) {
        scrollTop = window.pageYOffset;
      }
      else {
        // Most likely IE <=8, which doesn't support pageYOffset
        scrollTop = document.documentElement.scrollTop;
      }
      return scrollTop;
    },

    /**
     * @private
     */
    getScrollLeft: function() {
      var scrollLeft;
      if (typeof window.pageXOffset !== undefinedStr) {
        scrollLeft = window.pageXOffset;
      }
      else {
        // Most likely IE <=8, which doesn't support pageXOffset
        scrollLeft = document.documentElement.scrollLeft;
      }
      return scrollLeft;
    },

    /**
     * @private
     */
    getWindowHeight: function() {
      return window.innerHeight || document.documentElement.clientHeight;
    },

    /**
     * @private
     */
    getWindowWidth: function() {
      return window.innerWidth || document.documentElement.clientWidth;
    },

    /**
     * @private
     */
    addClickListener: function(el, fn) {
      return el.addEventListener ? el.addEventListener('click', fn, false) : el.attachEvent('onclick', fn);
    },

    /**
     * @private
     */
    removeClickListener: function(el, fn) {
      return el.removeEventListener ? el.removeEventListener('click', fn, false) : el.detachEvent('click', fn);
    },

    /**
     * @private
     */
    evtPreventDefault: function(evt) {
      if (evt.preventDefault) {
        evt.preventDefault();
      }
      else if (event) {
        event.returnValue = false;
      }
    },

    /**
     * @private
     */
    extend: function(obj1, obj2) {
      var prop;
      for (prop in obj2) {
        if (obj2.hasOwnProperty(prop)) {
          obj1[prop] = obj2[prop];
        }
      }
    },

    /**
     * @private
     */
    getStepTarget: function(step) {
      var result,
          queriedTarged;

      function runTargetTest(toTest){
        // Check if it's querySelector-eligible. Only accepting IDs and classes,
        // because that's the only thing that makes sense. Tag name and pseudo-class
        // are just silly.
        if (/^[#\.]/.test(toTest)) {
          if (document.querySelector) {
            return document.querySelector(toTest);
          }
          if (hasJquery) {
            result = jQuery(toTest);
            return result.length ? result[0] : null;
          }
          if (Sizzle) {
            result = new Sizzle(toTest);
            return result.length ? result[0] : null;
          }
          if (step.target[0] === '#' && step.target.indexOf(' ') === -1) {
            return document.getElementById(toTest.substring(1));
          }
          // Can't extract element. Likely IE <=7 and no jQuery/Sizzle.
          return null;
        }
        // Else assume it's a string id.
        return document.getElementById(toTest);
      }

      if (!step || !step.target) { return null; }

      if (typeof step.target === 'string') {
        //Just one target to test. Check, cache, and return its results.
        return step.target = runTargetTest(step.target);
      }
      else if (Array.isArray(step.target)) {
        //Multiple items to check. Check each and break on first success.
        var arrSize = step.target.length,
            i;
        for (i = 0; i < arrSize; i++){
          queriedTarget = runTargetTest(step.target[i]);
          if (queriedTarget !== null){ break; }
        }
        //Cache and return.
        return step.target = queriedTarget;
      }
      //Hey, our result's already been cached. Sweet!
      return step.target;
    },

    // Tour session persistence for multi-page tours. Uses HTML5 sessionStorage if available, then
    // falls back to using cookies.
    //
    // The following cookie-related logic is borrowed from:
    // http://www.quirksmode.org/js/cookies.html

    /**
     * @private
     */
    setState: function(name,value,days) {
      var expires = '',
          date;

      if (hasSessionStorage) {
        sessionStorage.setItem(name, value);
      }
      else {
        if (days) {
          date = new Date();
          date.setTime(date.getTime()+(days*24*60*60*1000));
          expires = '; expires='+date.toGMTString();
        }
        document.cookie = name+'='+value+expires+'; path=/';
      }
    },

    /**
     * @private
     */
    getState: function(name) {
      var nameEQ = name + '=',
          ca = document.cookie.split(';'),
          i,
          c,
          state;

      if (hasSessionStorage) {
        state = sessionStorage.getItem(name);
      }
      else {
        for(i=0;i < ca.length;i++) {
          c = ca[i];
          while (c.charAt(0)===' ') {c = c.substring(1,c.length);}
          if (c.indexOf(nameEQ) === 0) {
            state = c.substring(nameEQ.length,c.length);
            break;
          }
        }
      }

      return state;
    },

    /**
     * @private
     */
    clearState: function(name) {
      if (hasSessionStorage) {
        sessionStorage.removeItem(name);
      }
      else {
        this.setState(name,'',-1);
      }
    }
  };

  callbacks = {
    next:  [],
    prev:  [],
    start: [],
    end:   [],
    show:  [],
    error: [],
    close: []
  };

  /**
   * helpers
   * =======
   * A map of functions to be used as callback listeners. Functions are
   * added to and removed from the map using the functions
   * Hopscotch.registerHelper() and Hopscotch.unregisterHelper().
   */
  helpers = {};

  HopscotchI18N = {
    stepNums: null,
    nextBtn: 'Next',
    prevBtn: 'Back',
    doneBtn: 'Done',
    skipBtn: 'Skip',
    closeTooltip: 'Close'
  };

  /**
   * HopscotchBubble
   *
   * @class The HopscotchBubble class represents the view of a bubble. This class is also used for Hopscotch callouts.
   */
  HopscotchBubble = function(opt) {
    this.init(opt);
  };

  HopscotchBubble.prototype = {
    isShowing: false,

    currStep: undefined,

    /**
     * Helper function for creating buttons in the bubble.
     *
     * @private
     */
    _createButton: function(id, text) {
      var btnEl = document.createElement('button');
      btnEl.id = id;
      btnEl.innerHTML = text;
      utils.addClass(btnEl, 'hopscotch-nav-button');

      if (id.indexOf('prev') >= 0) {
        utils.addClass(btnEl, 'prev');
      }
      else {
        utils.addClass(btnEl, 'next');
      }

      return btnEl;
    },

    /**
     * setPosition
     *
     * Sets the position of the bubble using the bounding rectangle of the
     * target element and the orientation and offset information specified by
     * the JSON.
     */
    setPosition: function(step) {
      var bubbleWidth,
          bubbleHeight,
          bubblePadding,
          boundingRect,
          top,
          left,
          bubbleBorder = 6,
          targetEl     = utils.getStepTarget(step),
          el           = this.element,
          arrowEl      = this.arrowEl,
          arrowOffset  = utils.getPixelValue(step.arrowOffset);

      bubbleWidth   = utils.getPixelValue(step.width) || this.opt.bubbleWidth;
      bubblePadding = utils.valOrDefault(step.padding, this.opt.bubblePadding);
      utils.removeClass(el, 'fade-in-down fade-in-up fade-in-left fade-in-right');

      // SET POSITION
      boundingRect = targetEl.getBoundingClientRect();
      if (step.orientation === 'top') {
        bubbleHeight = el.offsetHeight;
        top = (boundingRect.top - bubbleHeight) - this.opt.arrowWidth;
        left = boundingRect.left;
      }
      else if (step.orientation === 'bottom') {
        top = boundingRect.bottom + this.opt.arrowWidth;
        left = boundingRect.left;
      }
      else if (step.orientation === 'left') {
        top = boundingRect.top;
        left = boundingRect.left - bubbleWidth - 2*bubblePadding - 2*bubbleBorder - this.opt.arrowWidth;
      }
      else if (step.orientation === 'right') {
        top = boundingRect.top;
        left = boundingRect.right + this.opt.arrowWidth;
      }

      // SET (OR RESET) ARROW OFFSETS
      if (!arrowOffset) {
        arrowEl.style.top = '';
        arrowEl.style.left = '';
      }
      else if (step.orientation === 'top' || step.orientation === 'bottom') {
        arrowEl.style.top = '';
        arrowEl.style.left = arrowOffset + 'px';
      }
      else if (step.orientation === 'left' || step.orientation === 'right') {
        arrowEl.style.left = '';
        arrowEl.style.top = arrowOffset + 'px';
      }

      // SET OFFSETS
      left += utils.getPixelValue(step.xOffset);
      top += utils.getPixelValue(step.yOffset);

      // ADJUST TOP FOR SCROLL POSITION
      if (!step.fixedElement) {
        top += utils.getScrollTop();
        left += utils.getScrollLeft();
      }

      // ACCOUNT FOR FIXED POSITION ELEMENTS
      el.style.position = (step.fixedElement ? 'fixed' : 'absolute');

      if (this.opt.animate && hasJquery && !hasCssTransitions) {
        $(el).animate({
          top: top + 'px',
          left: left + 'px'
        });
      }
      else {
        el.style.top = top + 'px';
        el.style.left = left + 'px';
      }
    },

    /**
     * @private
     */
    _initNavButtons: function() {
      var buttonsEl  = document.createElement('div');

      this.prevBtnEl = this._createButton('hopscotch-prev', HopscotchI18N.prevBtn);
      this.nextBtnEl = this._createButton('hopscotch-next', HopscotchI18N.nextBtn);
      this.doneBtnEl = this._createButton('hopscotch-done', HopscotchI18N.doneBtn);
      this.ctaBtnEl  = this._createButton('hopscotch-cta', HopscotchI18N.ctaBtn);
      utils.addClass(this.doneBtnEl, 'hide');

      buttonsEl.appendChild(this.prevBtnEl);
      buttonsEl.appendChild(this.nextBtnEl);
      buttonsEl.appendChild(this.doneBtnEl);
      buttonsEl.appendChild(this.ctaBtnEl);

      // Attach click listeners
      utils.addClickListener(this.prevBtnEl, function(evt) {
        winHopscotch.prevStep(true);
      });

      utils.addClickListener(this.nextBtnEl, function(evt) {
        winHopscotch.nextStep(true);
      });
      utils.addClickListener(this.doneBtnEl, winHopscotch.endTour);

      buttonsEl.className = 'hopscotch-actions';
      this.buttonsEl = buttonsEl;

      this.containerEl.appendChild(buttonsEl);
      return this;
    },

    /*
     * Define the close button callback here so that we have a handle on it
     * for when we want to remove it (see HopscotchBubble.destroy).
     *
     * @private
     */
    _getCloseFn: function() {
      var self = this;

      if (!this.closeFn) {
        /**
         * @private
         */
        this.closeFn = function(evt) {
          if (self.opt.onClose) {
            utils.invokeCallback(self.opt.onClose);
          }
          if (self.opt.id && !self.opt.isTourBubble) {
            // Remove via the HopscotchCalloutManager.
            // removeCallout() calls HopscotchBubble.destroy internally.
            winHopscotch.getCalloutManager().removeCallout(self.opt.id);
          }
          else {
            self.destroy();
          }

          utils.evtPreventDefault(evt);
        };
      }
      return this.closeFn;
    },

    /**
     * @private
     */
    initCloseButton: function() {
      var closeBtnEl = document.createElement('a');

      closeBtnEl.className = 'hopscotch-bubble-close';
      closeBtnEl.href = '#';
      closeBtnEl.title = HopscotchI18N.closeTooltip;
      closeBtnEl.innerHTML = HopscotchI18N.closeTooltip;

      if (this.opt.isTourBubble) {
        utils.addClickListener(closeBtnEl, function(evt) {
          var currStepNum   = winHopscotch.getCurrStepNum(),
              currTour      = winHopscotch.getCurrTour(),
              doEndCallback = (currStepNum === currTour.steps.length-1);

          utils.invokeEventCallbacks('close');

          winHopscotch.endTour(true, doEndCallback);

          if (evt.preventDefault) {
            evt.preventDefault();
          }
          else if (event) {
            event.returnValue = false;
          }
        });
      }
      else {
        utils.addClickListener(closeBtnEl, this._getCloseFn());
      }

      this.closeBtnEl = closeBtnEl;
      this.containerEl.appendChild(closeBtnEl);
      return this;
    },

    /**
     * @private
     */
    _initArrow: function() {
      var arrowEl,
          arrowBorderEl;

      this.arrowEl = document.createElement('div');
      this.arrowEl.className = 'hopscotch-bubble-arrow-container';

      arrowBorderEl = document.createElement('div');
      arrowBorderEl.className = 'hopscotch-bubble-arrow-border';

      arrowEl = document.createElement('div');
      arrowEl.className = 'hopscotch-bubble-arrow';

      this.arrowEl.appendChild(arrowBorderEl);
      this.arrowEl.appendChild(arrowEl);

      this.element.appendChild(this.arrowEl);
      return this;
    },

    /**
     * Renders the bubble according to the step JSON.
     *
     * @param {Object} step Information defining how the bubble should look.
     * @param {Number} idx The index of the step in the tour. Not used for callouts.
     * @param {Boolean} isLast Flag indicating if the step is the last in the tour. Not used for callouts.
     * @param {Function} callback Function to be invoked after rendering is finished.
     */
    render: function(step, idx, isLast, callback) {
      var el = this.element,
          showNext,
          showPrev,
          bubbleWidth,
          bubblePadding;

      if (step) {
        this.currStep = step;
      }
      else if (this.currStep) {
        step = this.currStep;
      }

      showNext = utils.valOrDefault(step.showNextButton, this.opt.showNextButton);
      showPrev = utils.valOrDefault(step.showPrevButton, this.opt.showPrevButton);
      this.setTitle(step.title || '');
      this.setContent(step.content || '');

      if (this.opt.showNumber) {
        this.setNum(idx);
      }

      this.orientation = step.orientation;

      this.showPrevButton(this.prevBtnEl && showPrev && idx > 0);
      this.showNextButton(this.nextBtnEl && showNext && !isLast);
      this.nextBtnEl.value = step.showSkip ? HopscotchI18N.skipBtn : HopscotchI18N.nextBtn;

      if (isLast) {
        utils.removeClass(this.doneBtnEl, 'hide');
      }
      else {
        utils.addClass(this.doneBtnEl, 'hide');
      }

      // Show/hide CTA button
      this._showButton(this.ctaBtnEl, !!step.showCTAButton);
      this.ctaBtnEl.innerHTML = step.ctaLabel;

      if (step.onCTA) {
        if (this.onCTA) {
          utils.removeClickListener(this.ctaBtnEl, this.onCTA);
        }

        utils.addClickListener(this.ctaBtnEl, step.onCTA);
        this.onCTA = step.onCTA; // cache for removing later
      }
      else if (this.onCTA) {
        // Remove previous CTA callback.
        utils.removeClickListener(this.ctaBtnEl, this.onCTA);
        this.onCTA = null;
      }

      this._setArrow(step.orientation);

      // Set dimensions
      bubbleWidth   = utils.getPixelValue(step.width) || this.opt.bubbleWidth;
      bubblePadding = utils.valOrDefault(step.padding, this.opt.bubblePadding);
      this.containerEl.style.width = bubbleWidth + 'px';
      this.containerEl.style.padding = bubblePadding + 'px';

      el.style.zIndex = step.zindex || '';

      if (step.orientation === 'top') {
        // For bubbles placed on top of elements, we need to get the
        // bubble height to correctly calculate the bubble position.
        // Show it briefly offscreen to calculate height, then hide
        // it again.
        el.style.top = '-9999px';
        el.style.left = '-9999px';
        utils.removeClass(el, 'hide');
        this.setPosition(step);
        utils.addClass(el, 'hide');
      }
      else {
        // Don't care about height for the other orientations.
        this.setPosition(step);
      }

      // only want to adjust window scroll for non-fixed elements
      if (callback) {
        callback(!step.fixedElement);
      }

      return this;
    },

    setTitle: function(titleStr) {
      if (titleStr) {
        this.titleEl.innerHTML = titleStr;
        utils.removeClass(this.titleEl, 'hide');
      }
      else {
        utils.addClass(this.titleEl, 'hide');
      }
      return this;
    },

    setContent: function(contentStr) {
      // CAREFUL!! Using innerHTML, so don't use any user-generated
      // content here. (or if you must, escape it first)
      if (contentStr) {
        this.contentEl.innerHTML = contentStr;
        utils.removeClass(this.contentEl, 'hide');
      }
      else {
        utils.addClass(this.contentEl, 'hide');
      }
      return this;
    },

    setNum: function(idx) {
      if (HopscotchI18N.stepNums && idx < HopscotchI18N.stepNums.length) {
        idx = HopscotchI18N.stepNums[idx];
      }
      else {
        idx = idx + 1;
      }
      this.numberEl.innerHTML = idx;
    },

    /**
     * Sets which side the arrow is on.
     *
     * @private
     */
    _setArrow: function(orientation) {
      utils.removeClass(this.arrowEl, 'down up right left');

      // Whatever the orientation is, we want to arrow to appear
      // "opposite" of the orientation. E.g., a top orientation
      // requires a bottom arrow.
      if (orientation === 'top') {
        utils.addClass(this.arrowEl, 'down');
      }
      else if (orientation === 'bottom') {
        utils.addClass(this.arrowEl, 'up');
      }
      else if (orientation === 'left') {
        utils.addClass(this.arrowEl, 'right');
      }
      else if (orientation === 'right') {
        utils.addClass(this.arrowEl, 'left');
      }
    },

    /**
     * @private
     */
    _getArrowDirection: function() {
      if (this.orientation === 'top') {
        return 'down';
      }
      if (this.orientation === 'bottom') {
        return 'up';
      }
      if (this.orientation === 'left') {
        return 'right';
      }
      if (this.orientation === 'right') {
        return 'left';
      }
    },

    show: function() {
      var self      = this,
          className = 'fade-in-' + this._getArrowDirection(),
          fadeDur   = 1000;

      utils.removeClass(this.element, 'hide');
      if (this.opt.animate) {
        setTimeout(function() {
          utils.addClass(self.element, 'animate');
        }, 50);
      }
      else {
        utils.addClass(this.element, className);
        setTimeout(function() {
          utils.removeClass(self.element, 'invisible');
        }, 50);
        setTimeout(function() {
          utils.removeClass(self.element, className);
        }, fadeDur);
      }
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
        if (!this.opt.animate) {
          utils.addClass(el, 'invisible');
        }
      }
      utils.removeClass(el, 'animate fade-in-up fade-in-down fade-in-right fade-in-left');
      this.isShowing = false;
      return this;
    },

    /**
     * @private
     */
    _showButton: function(btnEl, show, permanent) {
      var classname = 'hide';

      if (permanent) {
        // permanent is a flag that indicates we should never show the button
        classname = 'hide-all';
      }
      if (typeof show === undefinedStr) {
        show = true;
      }

      if (show) { utils.removeClass(btnEl, classname); }
      else { utils.addClass(btnEl, classname); }
    },

    showPrevButton: function(show, permanent) {
      this._showButton(this.prevBtnEl, show, permanent);
    },

    showNextButton: function(show, permanent) {
      this._showButton(this.nextBtnEl, show, permanent);
    },

    showCloseButton: function(show, permanent) {
      this._showButton(this.closeBtnEl, show, permanent);
    },


    /**
     * _initAnimate
     * ===========
     * This function exists due to how Chrome handles initial CSS transitions.
     * Most other browsers will not animate a transition until the element
     * exists on the page. Chrome treats DOM elements as starting from the
     * (0, 0) position, and will animate from the upper left corner on creation
     * of the DOM element. (e.g., if you create a new DOM element using
     * Javascript and specify CSS top: 100px, left: 50px, then append the
     * DOM element to the document.body, it will create it at 0, 0 and then
     * animate it to 50, 100)
     *
     * Solution is to add the animate class (which defines our transition)
     * only after the element is created.
     *
     * @private
     */
    _initAnimate: function() {
      var self = this;
      setTimeout(function() {
        utils.addClass(self.element, 'animate');
      }, 50);
    },

    /**
     * @private
     */
    _removeAnimate: function() {
      utils.removeClass(this.element, 'animate');
    },

    destroy: function() {
      var el = this.element;

      if (el) {
        el.parentNode.removeChild(el);
      }
      if (this.closeBtnEl) {
        utils.removeClickListener(this.closeBtnEl, this._getCloseFn());
      }
      if (this.ctaBtnEl && this.onCTA) {
        utils.removeClickListener(this.ctaBtnEl, this.onCTA);
      }
    },

    init: function(initOpt) {
      var el              = document.createElement('div'),
          containerEl     = document.createElement('div'),
          bubbleContentEl = document.createElement('div'),
          self            = this,
          resizeCooldown  = false, // for updating after window resize
          onWinResize,
          winResizeTimeout,
          appendToBody,
          opt;

      this.element        = el;
      this.containerEl    = containerEl;
      this.titleEl        = document.createElement('h3');
      this.contentEl      = document.createElement('p');

      opt = {
        animate:        defaultOpts.animate,
        showPrevButton: defaultOpts.showPrevButton,
        showNextButton: defaultOpts.showNextButton,
        bubbleWidth:    defaultOpts.bubbleWidth,
        bubblePadding:  defaultOpts.bubblePadding,
        arrowWidth:     defaultOpts.arrowWidth,
        showNumber:     true,
        isTourBubble:   true
      };

      initOpt = (typeof initOpt === undefinedStr ? {} : initOpt);

      utils.extend(opt, initOpt);
      this.opt = opt;

      el.className = 'hopscotch-bubble animated'; // "animated" for fade css animation
      containerEl.className = 'hopscotch-bubble-container';

      if (opt.showNumber) {
        this.numberEl           = document.createElement('span');
        this.numberEl.className = 'hopscotch-bubble-number';
        containerEl.appendChild(this.numberEl);
      }
      else {
        utils.addClass(el, 'no-number');
      }

      bubbleContentEl.appendChild(this.titleEl);
      bubbleContentEl.appendChild(this.contentEl);
      bubbleContentEl.className = 'hopscotch-bubble-content';
      containerEl.appendChild(bubbleContentEl);
      el.appendChild(containerEl);

      this._initNavButtons();
      this.initCloseButton();

      this._initArrow();

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
        winResizeTimeout = setTimeout(function() {
          self.setPosition(self.currStep);
          resizeCooldown = false;
        }, 100);
      };

      if (window.addEventListener) {
        window.addEventListener('resize', onWinResize, false);
      }

      else if (window.attachEvent) {
        window.attachEvent('onresize', onWinResize, false);
      }

      this.hide();

      /**
       * Append to body once the DOM is ready.
       */
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        document.body.appendChild(el);
        hasCssTransitions = utils.supportsCssTransitions();
      }
      else {
        // Moz, webkit, Opera
        if (document.addEventListener) {
          appendToBody = function() {
            document.removeEventListener('DOMContentLoaded', appendToBody);
            document.body.appendChild(el);
            hasCssTransitions = utils.supportsCssTransitions();
          };

          document.addEventListener('DOMContentLoaded', appendToBody);
        }
        // IE
        else {
          appendToBody = function() {
            if (document.readyState === 'complete') {
              document.detachEvent('onreadystatechange', appendToBody);
              document.body.appendChild(el);
            }
            hasCssTransitions = utils.supportsCssTransitions();
          };

          document.attachEvent('onreadystatechange', appendToBody);
        }
      }
    }
  };

  /**
   * HopscotchCalloutManager
   *
   * @class Manages the creation and destruction of single callouts.
   * @constructor
   */
  HopscotchCalloutManager = function() {
    var callouts = {};

    /**
     * createCallout
     *
     * Creates a standalone callout. This callout has the same API
     * as a Hopscotch tour bubble.
     *
     * @param {Object} opt The options for the callout. For the most
     * part, these are the same options as you would find in a tour
     * step.
     */
    this.createCallout = function(opt) {
      var callout;

      if (opt.id) {
        if (callouts[opt.id]) {
          throw 'Callout by that id already exists. Please choose a unique id.';
        }
        opt.showNextButton = opt.showPrevButton = false;
        opt.isTourBubble = false;
        callout = new HopscotchBubble(opt);
        callouts[opt.id] = callout;
        if (opt.target) {
          callout.render(opt, null, null, function() {
            callout.show();
          });
        }
      }
      else {
        throw 'Must specify a callout id.';
      }
      return callout;
    };

    /**
     * getCallout
     *
     * Returns a callout by its id.
     *
     * @param {String} id The id of the callout to fetch.
     * @returns {Object} HopscotchBubble
     */
    this.getCallout = function(id) {
      return callouts[id];
    };

    /**
     * removeAllCallouts
     *
     * Removes all existing callouts.
     */
    this.removeAllCallouts = function() {
      var calloutId,
          callout;

      for (calloutId in callouts) {
        if (callouts.hasOwnProperty(calloutId)) {
          this.removeCallout(calloutId);
        }
      }
    };

    /**
     * removeAllCallout
     *
     * Removes an existing callout by id.
     *
     * @param {String} id The id of the callout to remove.
     */
    this.removeCallout = function(id) {
      var callout = callouts[id];

      callouts[id] = null;
      if (!callout) { return; }

      callout.destroy();
    };
  };

  /**
   * Hopscotch
   *
   * @class Creates the Hopscotch object. Used to manage tour progress and configurations.
   * @constructor
   * @param {Object} initOptions Options to be passed to `configure()`.
   */
  Hopscotch = function(initOptions) {
    var self       = this, // for targetClickNextFn
        bubble,
        calloutMgr,
        opt,
        currTour,
        currStepNum,
        cookieTourId,
        cookieTourStep,
        _configure,

    /**
     * getBubble
     *
     * Singleton accessor function for retrieving or creating bubble object.
     *
     * @private
     * @returns {Object} HopscotchBubble
     */
    getBubble = function() {
      if (!bubble) {
        bubble = new HopscotchBubble({
          animate:        opt.animate,
          bubblePadding:  opt.bubblePadding,
          bubbleWidth:    opt.bubbleWidth,
          showNextButton: opt.showNextButton,
          showPrevButton: opt.showPrevButton,
          arrowWidth:     opt.arrowWidth
        });
      }
      return bubble;
    },

    /**
     * getCurrStep
     *
     * @private
     * @returns {Object} the step object corresponding to the current value of currStepNum
     */
    getCurrStep = function() {
      var step;

      if (currStepNum < 0 || currStepNum >= currTour.steps.length) {
        step = null;
      }
      else {
        step = currTour.steps[currStepNum];
      }

      return step;
    },

    /**
     * Used for nextOnTargetClick
     *
     * @private
     */
    targetClickNextFn = function() {
      self.nextStep(false);
    },

    /**
     * adjustWindowScroll
     *
     * Checks if the bubble or target element is partially or completely
     * outside of the viewport. If it is, adjust the window scroll position
     * to bring it back into the viewport.
     *
     * @private
     * @param {Function} cb Callback to invoke after done scrolling.
     */
    adjustWindowScroll = function(cb) {
      var bubble         = getBubble(),

          // Calculate the bubble element top and bottom position
          bubbleEl       = bubble.element,
          bubbleTop      = utils.getPixelValue(bubbleEl.style.top),
          bubbleBottom   = bubbleTop + utils.getPixelValue(bubbleEl.offsetHeight),

          // Calculate the target element top and bottom position
          targetEl       = utils.getStepTarget(getCurrStep()),
          targetBounds   = targetEl.getBoundingClientRect(),
          targetElTop    = targetBounds.top + utils.getScrollTop(),
          targetElBottom = targetBounds.bottom + utils.getScrollTop(),

          // The higher of the two: bubble or target
          targetTop      = (bubbleTop < targetElTop) ? bubbleTop : targetElTop,
          // The lower of the two: bubble or target
          targetBottom   = (bubbleBottom > targetElBottom) ? bubbleBottom : targetElBottom,

          // Calculate the current viewport top and bottom
          windowTop      = utils.getScrollTop(),
          windowBottom   = windowTop + utils.getWindowHeight(),

          // This is our final target scroll value.
          scrollToVal    = targetTop - opt.scrollTopMargin,

          scrollEl,
          yuiAnim,
          yuiEase,
          direction,
          scrollIncr,
          scrollTimeout,
          scrollTimeoutFn;

      // Target and bubble are both visible in viewport
      if (targetTop >= windowTop && (targetTop <= windowTop + opt.scrollTopMargin || targetBottom <= windowBottom)) {
        if (cb) { cb(); } // HopscotchBubble.show
      }

      // Abrupt scroll to scroll target
      else if (!opt.smoothScroll) {
        window.scrollTo(0, scrollToVal);

        if (cb) { cb(); } // HopscotchBubble.show
      }

      // Smooth scroll to scroll target
      else {
        // Use YUI if it exists
        if (typeof YAHOO             !== undefinedStr &&
            typeof YAHOO.env         !== undefinedStr &&
            typeof YAHOO.env.ua      !== undefinedStr &&
            typeof YAHOO.util        !== undefinedStr &&
            typeof YAHOO.util.Scroll !== undefinedStr) {
          scrollEl = YAHOO.env.ua.webkit ? document.body : document.documentElement;
          yuiEase = YAHOO.util.Easing ? YAHOO.util.Easing.easeOut : undefined;
          yuiAnim = new YAHOO.util.Scroll(scrollEl, {
            scroll: { to: [0, scrollToVal] }
          }, opt.scrollDuration/1000, yuiEase);
          yuiAnim.onComplete.subscribe(cb);
          yuiAnim.animate();
        }

        // Use jQuery if it exists
        else if (hasJquery) {
          $('body, html').animate({ scrollTop: scrollToVal }, opt.scrollDuration, cb);
        }

        // Use my crummy setInterval scroll solution if we're using plain, vanilla Javascript.
        else {
          if (scrollToVal < 0) {
            scrollToVal = 0;
          }

          // 48 * 10 == 480ms scroll duration
          // make it slightly less than CSS transition duration because of
          // setInterval overhead.
          // To increase or decrease duration, change the divisor of scrollIncr.
          direction = (windowTop > targetTop) ? -1 : 1; // -1 means scrolling up, 1 means down
          scrollIncr = Math.abs(windowTop - scrollToVal) / (opt.scrollDuration/10);
          scrollTimeoutFn = function() {
            var scrollTop = utils.getScrollTop(),
                scrollTarget = scrollTop + (direction * scrollIncr);

            if ((direction > 0 && scrollTarget >= scrollToVal) ||
                (direction < 0 && scrollTarget <= scrollToVal)) {
              // Overshot our target. Just manually set to equal the target
              // and clear the interval
              scrollTarget = scrollToVal;
              if (cb) { cb(); } // HopscotchBubble.show
              window.scrollTo(0, scrollTarget);
              return;
            }

            window.scrollTo(0, scrollTarget);

            if (utils.getScrollTop() === scrollTop) {
              // Couldn't scroll any further.
              if (cb) { cb(); } // HopscotchBubble.show
              return;
            }

            // If we reached this point, that means there's still more to scroll.
            setTimeout(scrollTimeoutFn, 10);
          };

          scrollTimeoutFn();
        }
      }
    },

    /**
     * goToStepWithTarget
     *
     * Helper function to increment the step number until a step is found where
     * the step target exists or until we reach the end/beginning of the tour.
     *
     * @private
     * @param {Number} direction Either 1 for incrementing or -1 for decrementing
     * @param {Function} cb The callback function to be invoked when the step has been found
     */
    goToStepWithTarget = function(direction, cb) {
      var target,
          step;

      if (currStepNum + direction >= 0 &&
          currStepNum + direction < currTour.steps.length) {

        currStepNum += direction;
        step = getCurrStep();

        // This setTimeout is here because the next step may have a delay
        // (e.g., if the state of the page changed that introduced the target
        // for the next step, then we need to respect delay before calling
        // utils.getStepTarget)
        setTimeout(function() {
          target = utils.getStepTarget(step);

          if (target) {
            // We're done! Return the step number via the callback.
            cb(currStepNum);
          }
          else {
            // Haven't found a valid target yet. Recursively call
            // goToStepWithTarget.
            utils.invokeEventCallbacks('error');
            goToStepWithTarget(direction, cb);
          }
        }, utils.valOrDefault(step.delay, 0));
      }
      else {
        cb(-1); // signal that we didn't find any step with a valid target
      }
    },

    /**
     * changeStep
     *
     * Helper function to change step by going forwards or backwards 1.
     * nextStep and prevStep are publicly accessible wrappers for this function.
     *
     * @private
     * @param {Boolean} doCallbacks Flag for invoking onNext or onPrev callbacks
     * @param {Number} direction Either 1 for "next" or -1 for "prev"
     */
    changeStep = function(doCallbacks, direction) {
      var bubble = getBubble(),
          self = this,
          step,
          origStep,
          wasMultiPage,
          changeStepCb;

      bubble.hide();

      doCallbacks = utils.valOrDefault(doCallbacks, true);
      step = getCurrStep();
      origStep = step;
      wasMultiPage = step.multipage;

      /**
       * Callback for goToStepWithTarget
       *
       * @private
       */
      changeStepCb = function(stepNum) {
        if (stepNum === -1) {
          // Wasn't able to find a step with an existing element. End tour.
          return this.endTour(true);
        }

        if (doCallbacks) {
          if (direction > 0) {
            utils.invokeEventCallbacks('next', origStep.onNext);
          }
          else {
            utils.invokeEventCallbacks('prev', origStep.onPrev);
          }

          if (direction > 0 && wasMultiPage) {
            // Next step is on a different page, so no need to attempt to
            // render it.
            return;
          }
        }

        this.showStep(stepNum);
      };

      if (!wasMultiPage && opt.skipIfNoElement) {
        goToStepWithTarget(direction, function(stepNum) {
          changeStepCb.call(self, stepNum);
        });
      }
      else if (currStepNum + direction >= 0 && currStepNum + direction < currTour.steps.length) {
        // only try incrementing once, and invoke error callback if no target is found
        currStepNum += direction;
        step = getCurrStep();
        if (!utils.getStepTarget(step) && !wasMultiPage) {
          utils.invokeEventCallbacks('error');
          return this.endTour(true, false);
        }
        changeStepCb.call(this, currStepNum);
      }

      return this;
    },

    /**
     * loadTour
     *
     * Loads, but does not display, tour.
     *
     * @private
     * @param tour The tour JSON object
     */
    loadTour = function(tour) {
      var tmpOpt = {},
          prop,
          tourState,
          tourPair;

      currTour = tour;

      // Set tour-specific configurations
      for (prop in tour) {
        if (tour.hasOwnProperty(prop) &&
            prop !== 'id' &&
            prop !== 'steps') {
          tmpOpt[prop] = tour[prop];
        }
      }

      this.resetDefaultOptions(); // reset all options so there are no surprises
      _configure.call(this, tmpOpt, true);

      // Get existing tour state, if it exists.
      tourState = utils.getState(opt.cookieName);
      if (tourState) {
        tourPair            = tourState.split(':');
        cookieTourId        = tourPair[0]; // selecting tour is not supported by this framework.
        cookieTourStep      = tourPair[1];

        cookieTourStep    = parseInt(cookieTourStep, 10);

        // Check for multipage flag
        if (tourPair.length > 2 && tourPair[2] === 'mp') {
          // Increment cookie step
          if (cookieTourStep < currTour.steps.length-1) {
            ++cookieTourStep;
          }
        }
      }

      return this;
    },

    /**
     * init
     *
     * Initializes the Hopscotch object.
     *
     * @private
     */
    init = function(initOptions) {
      if (initOptions) {
        initOptions.cookieName = initOptions.cookieName || 'hopscotch.tour.state';
        this.configure(initOptions);
      }
    };

    /**
     * getCalloutManager
     *
     * Gets the callout manager.
     *
     * @returns {Object} HopscotchCalloutManager
     *
     */
    this.getCalloutManager = function() {
      if (typeof calloutMgr === undefinedStr) {
        calloutMgr = new HopscotchCalloutManager();
      }

      return calloutMgr;
    };

    /**
     * startTour
     *
     * Begins the tour.
     *
     * @param {Object} tour The tour JSON object
     * @stepNum {Number} stepNum __Optional__ The step number to start from
     * @returns {Object} Hopscotch
     *
     */
    this.startTour = function(tour, stepNum) {
      var bubble,
          step,
          foundTarget;

      // loadTour if we are calling startTour directly. (When we call startTour
      // from window onLoad handler, we'll use currTour)
      if (!currTour) {
        loadTour.call(this, tour);
      }

      if (typeof stepNum !== undefinedStr) {
        currStepNum    = stepNum;
      }

      // If document isn't ready, wait for it to finish loading.
      // (so that we can calculate positioning accurately)
      if (document.readyState !== 'complete') {
        waitingToStart = true;
        return this;
      }

      if (typeof currStepNum === undefinedStr) {
        // Check if we are resuming state.
        if (currTour.id === cookieTourId && typeof cookieTourStep !== undefinedStr) {
          currStepNum    = cookieTourStep;
          step           = getCurrStep();
          foundTarget    = utils.getStepTarget(step);
          if (!foundTarget) {
            // No target found for the step specified by the cookie. May have just refreshed
            // the page. Try previous step. (but don't change cookie)
            --currStepNum;
            step = getCurrStep();
            foundTarget = utils.getStepTarget(step);
          }
          if (!foundTarget && opt.skipIfNoElement) {
            // Previous target doesn't exist either. The user may have just
            // clicked on a link that wasn't part of the tour. Another possibility is that
            // the user clicked on the correct link, but the target is just missing for
            // whatever reason. In either case, we should just advance until we find a step
            // that has a target on the page or end the tour if we can't find such a step.
            goToStepWithTarget(1);
            foundTarget = (currStepNum !== -1) && utils.getStepTarget(currTour.steps[currStepNum]);
          }
          if (!foundTarget) {
            // Whether or not to trigger onEnd callback? Err on the safe side and don't
            // trigger. Don't want weird stuff happening on a page that wasn't meant for
            // the tour. Up to the developer to fix their tour.
            this.endTour(false, false);
            return this;
          }
        }
        else {
          currStepNum = 0;
        }
      }

      utils.invokeEventCallbacks('start');

      bubble = getBubble();
      bubble.hide(false); // make invisible for boundingRect calculations when opt.animate == true

      this.isActive = true;
      if (opt.animate) {
        bubble._initAnimate();
      }

      if (!utils.getStepTarget(getCurrStep())) {
        // First step element doesn't exist
        utils.invokeEventCallbacks('error');
        if (opt.skipIfNoElement) {
          this.nextStep(false);
        }
      }
      else {
        this.showStep(currStepNum);
      }

      return this;
    };

    /**
     * showStep
     *
     * Skips to a specific step and renders the corresponding bubble.
     *
     * @stepNum {Number} stepNum The step number to show
     * @returns {Object} Hopscotch
     */
    this.showStep = function(stepNum) {
      var step = currTour.steps[stepNum];

      setTimeout(function() {
        var tourSteps    = currTour.steps,
            numTourSteps = tourSteps.length,
            cookieVal    = currTour.id + ':' + stepNum,
            bubble       = getBubble(),
            targetEl     = utils.getStepTarget(step),
            isLast,
            showBubble;

        showBubble = function() {
          bubble.show();
          utils.invokeEventCallbacks('show', step.onShow);
        };

        // Update bubble for current step
        currStepNum    = stepNum;

        // Only do fade if we're not animating.
        if (!opt.animate) {
          bubble.hide(false);
        }

        isLast = (stepNum === numTourSteps - 1);
        bubble.render(step, stepNum, isLast, function(adjustScroll) {
          // when done adjusting window scroll, call showBubble helper fn
          if (adjustScroll) {
            adjustWindowScroll(showBubble);
          }
          else {
            showBubble();
          }

          // If we want to advance to next step when user clicks on target.
          if (step.nextOnTargetClick) {
            utils.addClickListener(targetEl, targetClickNextFn);
          }
        });

        if (step.multipage) {
          cookieVal += ':mp';
        }

        utils.setState(opt.cookieName, cookieVal, 1);
      }, step.delay || 0);
      return this;
    };

    /**
     * prevStep
     *
     * Jump to the previous step.
     *
     * @param {Boolean} doCallbacks Flag for invoking onPrev callback. Defaults to true.
     * @returns {Object} Hopscotch
     */
    this.prevStep = function(doCallbacks) {
      changeStep.call(this, doCallbacks, -1);
      return this;
    };

    /**
     * nextStep
     *
     * Jump to the next step.
     *
     * @param {Boolean} doCallbacks Flag for invoking onNext callback. Defaults to true.
     * @returns {Object} Hopscotch
     */
    this.nextStep = function(doCallbacks) {
      var step = getCurrStep(),
          targetEl = utils.getStepTarget(step);

      if (step.nextOnTargetClick) {
        // Detach the listener after we've clicked on the target OR the next button.
        utils.removeClickListener(targetEl, targetClickNextFn);
      }
      changeStep.call(this, doCallbacks, 1);
      return this;
    };

    /**
     * endTour
     *
     * Cancels out of an active tour.
     *
     * @param {Boolean} clearState Flag for clearing state. Defaults to true.
     * @param {Boolean} doCallbacks Flag for invoking 'onEnd' callbacks. Defaults to true.
     * @returns {Object} Hopscotch
     */
    this.endTour = function(clearState, doCallbacks) {
      var bubble     = getBubble();
      clearState     = utils.valOrDefault(clearState, true);
      doCallbacks    = utils.valOrDefault(doCallbacks, true);
      currStepNum    = 0;
      cookieTourStep = undefined;

      bubble.hide();
      if (clearState) {
        utils.clearState(opt.cookieName);
      }
      winHopscotch.isActive = false;

      if (currTour && doCallbacks) {
        utils.invokeEventCallbacks('end');
      }

      winHopscotch.removeCallbacks(true);

      currTour = null;

      return this;
    };

    /**
     * getCurrTour
     *
     * @return {Object} The currently loaded tour.
     */
    this.getCurrTour = function() {
      return currTour;
    };

    /**
     * getCurrStepNum
     *
     * @return {number} The current step number.
     */
    this.getCurrStepNum = function() {
      return currStepNum;
    };

    /**
     * listen
     *
     * Adds a callback for one of the event types. Valid event types are:
     *
     * @param {string} evtType "start", "end", "next", "prev", "show", "close", or "error"
     * @param {Function} cb The callback to add.
     * @param {Boolean} isTourCb Flag indicating callback is from a tour definition.
     *    For internal use only!
     * @returns {Object} Hopscotch
     */
    this.listen = function(evtType, cb, isTourCb) {
      if (evtType) {
        callbacks[evtType].push({ cb: cb, fromTour: isTourCb });
      }
      return this;
    };

    /**
     * unlisten
     *
     * Removes a callback for one of the event types, e.g. 'start', 'next', etc.
     *
     * @param {string} evtType "start", "end", "next", "prev", "show", "close", or "error"
     * @param {Function} cb The callback to remove.
     * @returns {Object} Hopscotch
     */
    this.unlisten = function(evtType, cb) {
      var evtCallbacks = callbacks[evtType],
          i,
          len;

      for (i = 0, len = evtCallbacks.length; i < len; ++i) {
        if (evtCallbacks[i] === cb) {
          evtCallbacks.splice(i, 1);
        }
      }
      return this;
    };

    /**
     * removeCallbacks
     *
     * Remove callbacks for all hopscotch events. If tourOnly is set to true, only
     * removes callbacks specified by a tour (callbacks set by external calls
     * to hopscotch.configure or hopscotch.listen will not be removed).
     *
     * @param {boolean} tourOnly Flag to indicate we should only remove callbacks added
     *    by a tour. Defaults to false.
     * @returns {Object} Hopscotch
     */
    this.removeCallbacks = function(tourOnly) {
      var cbArr,
          i,
          len,
          evtType;

      for (evtType in callbacks) {
        if (tourOnly) {
          cbArr = callbacks[evtType];
          for (i=0, len=cbArr.length; i < len; ++i) {
            if (cbArr[i].fromTour) {
              cbArr.splice(i--, 1);
              --len;
            }
          }
        }
        else {
          callbacks[evtType] = [];
        }
      }
      return this;
    };

    /**
     * registerHelper
     * ==============
     * Registers a helper function to be used as a callback function.
     *
     * @param {String} id The id of the function.
     * @param {Function} id The callback function.
     */
    this.registerHelper = function(id, fn) {
      if (typeof id === 'string' && typeof fn === 'function') {
        helpers[id] = fn;
      }
    };

    this.unregisterHelper = function(id) {
      helpers[id] = null;
    };

    /**
     * setCookieName
     *
     * Sets the cookie name (or sessionStorage name, if supported) used for multi-page
     * tour persistence.
     *
     * @param {String} name The cookie name
     * @returns {Object} Hopscotch
     */
    this.setCookieName = function(name) {
      opt.cookieName = name;
      return this;
    };

    /**
     * resetDefaultOptions
     *
     * Resets all configuration options to default.
     *
     * @returns {Object} Hopscotch
     */
    this.resetDefaultOptions = function() {
      if (!opt) { opt = {}; }

      utils.extend(opt, defaultOpts);
      return this;
    };

    /**
     * _configure
     *
     * @see this.configure
     * @private
     * @param options
     * @param {Boolean} isTourOptions Should be set to true when setting options from a tour definition.
     */
    _configure = function(options, isTourOptions) {
      var bubble,
          events = ['next', 'prev', 'start', 'end', 'show', 'error', 'close'],
          eventPropName,
          callbackProp,
          i,
          len;

      if (!opt) {
        this.resetDefaultOptions();
      }

      utils.extend(opt, options);

      if (options) {
        utils.extend(HopscotchI18N, options.i18n);
      }

      for (i = 0, len = events.length; i < len; ++i) {
        // At this point, options[eventPropName] may have changed from an array
        // to a function.
        eventPropName = 'on' + events[i].charAt(0).toUpperCase() + events[i].substring(1);
        if (options[eventPropName]) {
          this.listen(events[i],
                      options[eventPropName],
                      isTourOptions);
        }
      }

      bubble = getBubble();

      if (opt.animate) {
        bubble._initAnimate();
      }
      else {
        bubble._removeAnimate();
      }

      bubble.showCloseButton(options.showCloseButton, typeof options.showCloseButton !== undefinedStr);

      return this;
    };

    /**
     * configure
     *
     * <pre>
     * VALID OPTIONS INCLUDE...
     *
     * - bubbleWidth:     Number   - Default bubble width. Defaults to 280.
     * - bubblePadding:   Number   - Default bubble padding. Defaults to 15.
     * - animate:         Boolean  - should the tour bubble animate between steps?
     *                               Defaults to FALSE.
     * - smoothScroll:    Boolean  - should the page scroll smoothly to the next
     *                               step? Defaults to TRUE.
     * - scrollDuration:  Number   - Duration of page scroll. Only relevant when
     *                               smoothScroll is set to true. Defaults to
     *                               1000ms.
     * - scrollTopMargin: NUMBER   - When the page scrolls, how much space should there
     *                               be between the bubble/targetElement and the top
     *                               of the viewport? Defaults to 200.
     * - showCloseButton: Boolean  - should the tour bubble show a close (X) button?
     *                               Defaults to TRUE.
     * - showPrevButton:  Boolean  - should the bubble have the Previous button?
     *                               Defaults to FALSE.
     * - showNextButton:  Boolean  - should the bubble have the Next button?
     *                               Defaults to TRUE.
     * - arrowWidth:      Number   - Default arrow width. (space between the bubble
     *                               and the targetEl) Used for bubble position
     *                               calculation. Only use this option if you are
     *                               using your own custom CSS. Defaults to 20.
     * - skipIfNoElement  Boolean  - If a specified target element is not found,
     *                               should we skip to the next step? Defaults to
     *                               TRUE.
     * - onNext:          Function - A callback to be invoked after every click on
     *                               a "Next" button.
     *
     * - i18n:            Object   - For i18n purposes. Allows you to change the
     *                               text of button labels and step numbers.
     * - i18n.stepNums:   Array\<String\> - Provide a list of strings to be shown as
     *                               the step number, based on index of array. Unicode
     *                               characters are supported. (e.g., ['&#x4e00;',
     *                               '&#x4e8c;', '&#x4e09;']) If there are more steps
     *                               than provided numbers, Arabic numerals
     *                               ('4', '5', '6', etc.) will be used as default.
     * // =========
     * // CALLBACKS
     * // =========
     * - onNext:          Function - Invoked after every click on a "Next" button.
     * - onPrev:          Function - Invoked after every click on a "Prev" button.
     * - onStart:         Function - Invoked when the tour is started.
     * - onEnd:           Function - Invoked when the tour ends.
     * - onClose:         Function - Invoked when the user closes the tour before finishing.
     * - onError:         Function - Invoked when the specified target element doesn't exist on the page.
     *
     * // ====
     * // I18N
     * // ====
     * i18n:              OBJECT      - For i18n purposes. Allows you to change the text
     *                                  of button labels and step numbers.
     * i18n.nextBtn:      STRING      - Label for next button
     * i18n.prevBtn:      STRING      - Label for prev button
     * i18n.doneBtn:      STRING      - Label for done button
     * i18n.skipBtn:      STRING      - Label for skip button
     * i18n.closeTooltip: STRING      - Text for close button tooltip
     * i18n.stepNums:   ARRAY<STRING> - Provide a list of strings to be shown as
     *                                  the step number, based on index of array. Unicode
     *                                  characters are supported. (e.g., ['&#x4e00;',
     *                                  '&#x4e8c;', '&#x4e09;']) If there are more steps
     *                                  than provided numbers, Arabic numerals
     *                                  ('4', '5', '6', etc.) will be used as default.
     * </pre>
     *
     * @example hopscotch.configure({ animate: false, scrollTopMargin: 150 });
     * @example
     * hopscotch.configure({
     *   animate: false,
     *   scrollTopMargin: 150,
     *   onStart: function() {
     *     alert("Have fun!");
     *   },
     *   i18n: {
     *     nextBtn: 'Forward',
     *     prevBtn: 'Previous'
     *     closeTooltip: 'Quit'
     *   }
     * });
     *
     * @param {Object} options A hash of configuration options.
     * @returns {Object} Hopscotch
     */
    this.configure = function(options) {
      return _configure.call(this, options, false);
    };

    init.call(this, initOptions);
  };

  winHopscotch = new Hopscotch();
  context[namespace] = winHopscotch;
}(window, 'hopscotch'));