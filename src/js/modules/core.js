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
    skippedSteps = {},
    cookieTourId,
    cookieTourStep,
    cookieSkippedSteps = [],
    _configure,

    /**
     * getBubble
     *
     * Singleton accessor function for retrieving or creating bubble object.
     *
     * @private
     * @param setOptions {Boolean} when true, transfers configuration options to the bubble
     * @returns {Object} HopscotchBubble
     */
    getBubble = function(setOptions) {
      if (!bubble) {
        bubble = new HopscotchBubble(opt);
      }
      if (setOptions) {
        utils.extend(bubble.opt, {
          bubblePadding:   getOption('bubblePadding'),
          bubbleWidth:     getOption('bubbleWidth'),
          showNextButton:  getOption('showNextButton'),
          showPrevButton:  getOption('showPrevButton'),
          showCloseButton: getOption('showCloseButton'),
          arrowWidth:      getOption('arrowWidth'),
          isRtl:           getOption('isRtl')
        });
      }
      return bubble;
    },

    /**
     * Destroy the bubble currently associated with Hopscotch.
     * This is done when we end the current tour.
     *
     * @private
     */
    destroyBubble = function() {
      if(bubble){
        bubble.destroy();
        bubble = null;
      }
    },

    /**
     * Convenience method for getting an option. Returns custom config option
     * or the default config option if no custom value exists.
     *
     * @private
     * @param name {String} config option name
     * @returns {Object} config option value
     */
    getOption = function(name) {
      if (typeof opt === 'undefined') {
        return defaultOpts[name];
      }
      return utils.valOrDefault(opt[name], defaultOpts[name]);
    },

    /**
     * getCurrStep
     *
     * @private
     * @returns {Object} the step object corresponding to the current value of currStepNum
     */
    getCurrStep = function() {
      var step;

      if (!currTour || currStepNum < 0 || currStepNum >= currTour.steps.length) {
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
      self.nextStep();
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
        scrollToVal    = targetTop - getOption('scrollTopMargin'),

        scrollEl,
        yuiAnim,
        yuiEase,
        direction,
        scrollIncr,
        scrollTimeout,
        scrollTimeoutFn;

      // Target and bubble are both visible in viewport
      if (targetTop >= windowTop && (targetTop <= windowTop + getOption('scrollTopMargin') || targetBottom <= windowBottom)) {
        if (cb) { cb(); } // HopscotchBubble.show
      }

      // Abrupt scroll to scroll target
      else if (!getOption('smoothScroll')) {
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
          }, getOption('scrollDuration')/1000, yuiEase);
          yuiAnim.onComplete.subscribe(cb);
          yuiAnim.animate();
        }

        // Use jQuery if it exists
        else if (hasJquery) {
          jQuery('body, html').animate({ scrollTop: scrollToVal }, getOption('scrollDuration'), cb);
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
          scrollIncr = Math.abs(windowTop - scrollToVal) / (getOption('scrollDuration')/10);
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
        step,
        goToStepFn;

      if (currStepNum + direction >= 0 &&
        currStepNum + direction < currTour.steps.length) {

        currStepNum += direction;
        step = getCurrStep();

        goToStepFn = function() {
          target = utils.getStepTarget(step);

          if (target) {
            //this step was previously skipped, but now its target exists,
            //remove this step from skipped steps set
            if(skippedSteps[currStepNum]) {
              delete skippedSteps[currStepNum];
            }
            // We're done! Return the step number via the callback.
            cb(currStepNum);
          }
          else {
            //mark this step as skipped, since its target wasn't found
            skippedSteps[currStepNum] = true;
            // Haven't found a valid target yet. Recursively call
            // goToStepWithTarget.
            utils.invokeEventCallbacks('error');
            goToStepWithTarget(direction, cb);
          }
        };

        if (step.delay) {
          setTimeout(goToStepFn, step.delay);
        }
        else {
          goToStepFn();
        }
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

      if (step.nextOnTargetClick) {
        // Detach the listener when tour is moving to a different step
        utils.removeEvtListener(utils.getStepTarget(step), 'click', targetClickNextFn);
      }

      origStep = step;
      if (direction > 0) {
        wasMultiPage = origStep.multipage;
      }
      else {
        wasMultiPage = (currStepNum > 0 && currTour.steps[currStepNum-1].multipage);
      }

      /**
       * Callback for goToStepWithTarget
       *
       * @private
       */
      changeStepCb = function(stepNum) {
        var doShowFollowingStep;

        if (stepNum === -1) {
          // Wasn't able to find a step with an existing element. End tour.
          return this.endTour(true);
        }

        if (doCallbacks) {
          if (direction > 0) {
            doShowFollowingStep = utils.invokeEventCallbacks('next', origStep.onNext);
          }
          else {
            doShowFollowingStep = utils.invokeEventCallbacks('prev', origStep.onPrev);
          }
        }

        // If the state of the tour is updated in a callback, assume the client
        // doesn't want to go to next step since they specifically updated.
        if (stepNum !== currStepNum) {
          return;
        }

        if (wasMultiPage) {
          // Update state for the next page
          setStateHelper();

          // Next step is on a different page, so no need to attempt to render it.
          return;
        }

        doShowFollowingStep = utils.valOrDefault(doShowFollowingStep, true);

        // If the onNext/onPrev callback returned false, halt the tour and
        // don't show the next step.
        if (doShowFollowingStep) {
          this.showStep(stepNum);
        }
        else {
          // Halt tour (but don't clear state)
          this.endTour(false);
        }
      };

      if (!wasMultiPage && getOption('skipIfNoElement')) {
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
        tourStateValues;

      // Set tour-specific configurations
      for (prop in tour) {
        if (tour.hasOwnProperty(prop) &&
          prop !== 'id' &&
          prop !== 'steps') {
          tmpOpt[prop] = tour[prop];
        }
      }

      //this.resetDefaultOptions(); // reset all options so there are no surprises
      // TODO check number of config properties of tour
      _configure.call(this, tmpOpt, true);

      // Get existing tour state, if it exists.
      tourState = utils.getState(getOption('cookieName'));
      if (tourState) {
        tourStateValues     = tourState.split(':');
        cookieTourId        = tourStateValues[0]; // selecting tour is not supported by this framework.
        cookieTourStep      = tourStateValues[1];

        if(tourStateValues.length > 2) {
          cookieSkippedSteps = tourStateValues[2].split(',');
        }

        cookieTourStep    = parseInt(cookieTourStep, 10);
      }

      return this;
    },

    /**
     * Find the first step to show for a tour. (What is the first step with a
     * target on the page?)
     */
    findStartingStep = function(startStepNum, savedSkippedSteps, cb) {
      var step,
        target;

      currStepNum = startStepNum || 0;
      skippedSteps = savedSkippedSteps || {};
      step        = getCurrStep();
      target      = utils.getStepTarget(step);

      if (target) {
        // First step had an existing target.
        cb(currStepNum);
        return;
      }

      if (!target) {
        // Previous target doesn't exist either. The user may have just
        // clicked on a link that wasn't part of the tour. Another possibility is that
        // the user clicked on the correct link, but the target is just missing for
        // whatever reason. In either case, we should just advance until we find a step
        // that has a target on the page or end the tour if we can't find such a step.
        utils.invokeEventCallbacks('error');

        //this step was skipped, since its target does not exist
        skippedSteps[currStepNum] = true;

        if (getOption('skipIfNoElement')) {
          goToStepWithTarget(1, cb);
          return;
        }
        else {
          currStepNum = -1;
          cb(currStepNum);
        }
      }
    },

    showStepHelper = function(stepNum) {
      var step         = currTour.steps[stepNum],
        bubble       = getBubble(),
        targetEl     = utils.getStepTarget(step);

      function showBubble() {
        bubble.show();
        utils.invokeEventCallbacks('show', step.onShow);
      }

      if (currStepNum !== stepNum && getCurrStep().nextOnTargetClick) {
        // Detach the listener when tour is moving to a different step
        utils.removeEvtListener(utils.getStepTarget(getCurrStep()), 'click', targetClickNextFn);
      }

      // Update bubble for current step
      currStepNum = stepNum;

      bubble.hide(false);

      bubble.render(step, stepNum, function(adjustScroll) {
        // when done adjusting window scroll, call showBubble helper fn
        if (adjustScroll) {
          adjustWindowScroll(showBubble);
        }
        else {
          showBubble();
        }

        // If we want to advance to next step when user clicks on target.
        if (step.nextOnTargetClick) {
          utils.addEvtListener(targetEl, 'click', targetClickNextFn);
        }
      });

      setStateHelper();
    },

    setStateHelper = function() {
      var cookieVal = currTour.id + ':' + currStepNum,
        skipedStepIndexes = winHopscotch.getSkippedStepsIndexes();

      if(skipedStepIndexes && skipedStepIndexes.length > 0) {
        cookieVal += ':' + skipedStepIndexes.join(',');
      }

      utils.setState(getOption('cookieName'), cookieVal, 1);
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
        //initOptions.cookieName = initOptions.cookieName || 'hopscotch.tour.state';
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
      currStepNum,
      skippedSteps = {},
      self = this;

    // loadTour if we are calling startTour directly. (When we call startTour
    // from window onLoad handler, we'll use currTour)
    if (!currTour) {

      // Sanity check! Is there a tour?
      if(!tour){
        throw new Error('Tour data is required for startTour.');
      }

      // Check validity of tour ID. If invalid, throw an error.
      if(!tour.id || !validIdRegEx.test(tour.id)) {
        throw new Error('Tour ID is using an invalid format. Use alphanumeric, underscores, and/or hyphens only. First character must be a letter.');
      }

      currTour = tour;
      loadTour.call(this, tour);

    }

    if (typeof stepNum !== undefinedStr) {
      if (stepNum >= currTour.steps.length) {
        throw new Error('Specified step number out of bounds.');
      }
      currStepNum = stepNum;
    }

    // If document isn't ready, wait for it to finish loading.
    // (so that we can calculate positioning accurately)
    if (!utils.documentIsReady()) {
      waitingToStart = true;
      return this;
    }

    if (typeof currStepNum === "undefined" && currTour.id === cookieTourId && typeof cookieTourStep !== undefinedStr) {
      currStepNum = cookieTourStep;
      if(cookieSkippedSteps.length > 0){
        for(var i = 0, len = cookieSkippedSteps.length; i < len; i++) {
          skippedSteps[cookieSkippedSteps[i]] = true;
        }
      }
    }
    else if (!currStepNum) {
      currStepNum = 0;
    }

    // Find the current step we should begin the tour on, and then actually start the tour.
    findStartingStep(currStepNum, skippedSteps, function(stepNum) {
      var target = (stepNum !== -1) && utils.getStepTarget(currTour.steps[stepNum]);

      if (!target) {
        // Should we trigger onEnd callback? Let's err on the side of caution
        // and not trigger it. Don't want weird stuff happening on a page that
        // wasn't meant for the tour. Up to the developer to fix their tour.
        self.endTour(false, false);
        return;
      }

      utils.invokeEventCallbacks('start');

      bubble = getBubble();
      // TODO: do we still need this call to .hide()? No longer using opt.animate...
      // Leaving it in for now to play it safe
      bubble.hide(false); // make invisible for boundingRect calculations when opt.animate == true

      self.isActive = true;

      if (!utils.getStepTarget(getCurrStep())) {
        // First step element doesn't exist
        utils.invokeEventCallbacks('error');
        if (getOption('skipIfNoElement')) {
          self.nextStep(false);
        }
      }
      else {
        self.showStep(stepNum);
      }
    });

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
    if(!utils.getStepTarget(step)) {
      return;
    }

    if (step.delay) {
      setTimeout(function() {
        showStepHelper(stepNum);
      }, step.delay);
    }
    else {
      showStepHelper(stepNum);
    }
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
    var bubble     = getBubble(),
      currentStep;

    clearState     = utils.valOrDefault(clearState, true);
    doCallbacks    = utils.valOrDefault(doCallbacks, true);

    //remove event listener if current step had it added
    if(currTour) {
      currentStep = getCurrStep();
      if(currentStep && currentStep.nextOnTargetClick) {
        utils.removeEvtListener(utils.getStepTarget(currentStep), 'click', targetClickNextFn);
      }
    }

    currStepNum    = 0;
    cookieTourStep = undefined;

    bubble.hide();
    if (clearState) {
      utils.clearState(getOption('cookieName'));
    }
    if (this.isActive) {
      this.isActive = false;

      if (currTour && doCallbacks) {
        utils.invokeEventCallbacks('end');
      }
    }

    this.removeCallbacks(null, true);
    this.resetDefaultOptions();
    destroyBubble();

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
   * getCurrTarget
   *
   * @return {Object} The currently visible target.
   */
  this.getCurrTarget = function() {
    return utils.getStepTarget(getCurrStep());
  };

  /**
   * getCurrStepNum
   *
   * @return {number} The current zero-based step number.
   */
  this.getCurrStepNum = function() {
    return currStepNum;
  };

  /**
   * getSkippedStepsIndexes
   *
   * @return {Array} Array of skipped step indexes
   */
  this.getSkippedStepsIndexes = function() {
    var skippedStepsIdxArray = [],
      stepIds;

    for(stepIds in skippedSteps){
      skippedStepsIdxArray.push(stepIds);
    }

    return skippedStepsIdxArray;
  };

  /**
   * refreshBubblePosition
   *
   * Tell hopscotch that the position of the current tour element changed
   * and the bubble therefore needs to be redrawn. Also refreshes position
   * of all Hopscotch Callouts on the page.
   *
   * @returns {Object} Hopscotch
   */
  this.refreshBubblePosition = function() {
    var currStep = getCurrStep();
    if(currStep){
      getBubble().setPosition(currStep);
    }
    this.getCalloutManager().refreshCalloutPositions();
    return this;
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
   * Remove callbacks for hopscotch events. If tourOnly is set to true, only
   * removes callbacks specified by a tour (callbacks set by external calls
   * to hopscotch.configure or hopscotch.listen will not be removed). If
   * evtName is null or undefined, callbacks for all events will be removed.
   *
   * @param {string} evtName Optional Event name for which we should remove callbacks
   * @param {boolean} tourOnly Optional flag to indicate we should only remove callbacks added
   *    by a tour. Defaults to false.
   * @returns {Object} Hopscotch
   */
  this.removeCallbacks = function(evtName, tourOnly) {
    var cbArr,
      i,
      len,
      evt;

    // If evtName is null or undefined, remove callbacks for all events.
    for (evt in callbacks) {
      if (!evtName || evtName === evt) {
        if (tourOnly) {
          cbArr = callbacks[evt];
          for (i=0, len=cbArr.length; i < len; ++i) {
            if (cbArr[i].fromTour) {
              cbArr.splice(i--, 1);
              --len;
            }
          }
        }
        else {
          callbacks[evt] = [];
        }
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

  this.invokeHelper = function(id) {
    var args = [],
      i,
      len;

    for (i = 1, len = arguments.length; i < len; ++i) {
      args.push(arguments[i]);
    }
    if (helpers[id]) {
      helpers[id].call(null, args);
    }
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
    opt = {};
    return this;
  };

  /**
   * resetDefaultI18N
   *
   * Resets all i18n.
   *
   * @returns {Object} Hopscotch
   */
  this.resetDefaultI18N = function() {
    customI18N = {};
    return this;
  };

  /**
   * hasState
   *
   * Returns state from a previous tour run, if it exists.
   *
   * @returns {String} State of previous tour run, or empty string if none exists.
   */
  this.getState = function() {
    return utils.getState(getOption('cookieName'));
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
      utils.extend(customI18N, options.i18n);
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

    bubble = getBubble(true);

    return this;
  };

  /**
   * configure
   *
   * <pre>
   * VALID OPTIONS INCLUDE...
   *
   * - bubbleWidth:     Number   - Default bubble width. Defaults to 280.
   * - bubblePadding:   Number   - DEPRECATED. Default bubble padding. Defaults to 15.
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
   * - isRtl:           Boolean  - Set to true when instantiating in a right-to-left
   *                               language environment, or if mirrored positioning is
   *                               needed.
   *                               Defaults to FALSE.
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
   * @example hopscotch.configure({ scrollDuration: 1000, scrollTopMargin: 150 });
   * @example
   * hopscotch.configure({
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

  /**
   * Set the template that should be used for rendering Hopscotch bubbles.
   * If a string, it's assumed your template is available in the
   * hopscotch.templates namespace.
   *
   * @param {String|Function(obj)} The template to use for rendering.
   * @returns {Object} The Hopscotch object (for chaining).
   */
  this.setRenderer = function(render){
    var typeOfRender = typeof render;

    if(typeOfRender === 'string'){
      templateToUse = render;
      customRenderer = undefined;
    }
    else if(typeOfRender === 'function'){
      customRenderer = render;
    }
    return this;
  };

  /**
   * Sets the escaping method to be used by JST templates.
   *
   * @param {Function} - The escape method to use.
   * @returns {Object} The Hopscotch object (for chaining).
   */
  this.setEscaper = function(esc){
    if (typeof esc === 'function'){
      customEscape = esc;
    }
    return this;
  };

  init.call(this, initOptions);
};