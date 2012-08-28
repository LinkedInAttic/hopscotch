/**
 *
 * Thoughts:
 * =========
 *
 * support > 1 bubble at a time? gahhhhhhhhh
 * "center" option (for block-level elements that span width of document)
 *
 * TODO:
 * =====
 * test css conflicts on different sites
 * improve auto-scrolling?
 *
 * position screws up when you align it with a position:fixed element
 * delay for displaying a step
 *
 * onShow, onHide callbacks?
 * support horizontal smooth scroll????????
 *
 * in addition to targetId, do we want to support specifying targetEl directly?
 *
 * flag to see if user has already taken a tour?
 *
 * http://daneden.me/animate/ for fade animation
 *
 * multiple start/end callbacks
 *
 */

(function(context, namespace) {
  var Hopscotch,
      HopscotchBubble,
      HopscotchI18N,
      utils,
      callbacks,
      undefinedStr      = 'undefined',
      winHopscotch      = context[namespace],
      waitingToStart    = false, // is a tour waiting for the document to finish
                                 // loading so that it can start?
      hasSessionStorage = (typeof window.sessionStorage !== undefinedStr),
      docStyle          = document.body.style,
      hasCssTransitions = (typeof docStyle.MozTransition    !== undefinedStr ||
                           typeof docStyle.MsTransition     !== undefinedStr ||
                           typeof docStyle.webkitTransition !== undefinedStr ||
                           typeof docStyle.OTransition      !== undefinedStr ||
                           typeof docStyle.transition       !== undefinedStr);

  if (winHopscotch) {
    // Hopscotch already exists.
    return;
  }

  $(window).load(function() {
    if (waitingToStart) {
      winHopscotch.startTour();
    }
  });

  /**
   * utils
   * =====
   * A set of utility functions, mostly for standardizing to manipulate
   * and extract information from the DOM. Basically these are things I
   * would normally use jQuery for, but I don't want to require it for
   * this framework.
   */
  utils = {
    getPixelValue: function(val) {
      var valType = typeof val;
      if (valType === 'number') { return val; }
      if (valType === 'string') { return parseInt(val, 10); }
      return 0;
    },

    // Inspired by Python...
    valOrDefault: function(val, valDefault) {
      return typeof val !== undefinedStr ? val : valDefault;
    },

    invokeCallbacks: function(evtType, args) {
      var cbArr = callbacks[evtType],
          i = 0,
          len = cbArr.length;

      for (; i<len; ++i) {
        cbArr[i].cb.apply(this, args);
      }
    },

    getScrollTop: function() {
      if (typeof window.pageYOffset !== undefinedStr) {
        return window.pageYOffset;
      }
      else {
        // Most likely IE <=8, which doesn't support pageYOffset
        return document.documentElement.scrollTop;
      }
    },

    getScrollLeft: function() {
      if (typeof window.pageXOffset !== undefinedStr) {
        return window.pageXOffset;
      }
      else {
        // Most likely IE <=8, which doesn't support pageXOffset
        return document.documentElement.scrollLeft;
      }
    },

    extend: function(obj1, obj2) {
      var prop;
      for (prop in obj2) {
        if (obj2.hasOwnProperty(prop)) {
          obj1[prop] = obj2[prop];
        }
      }
    },

    getStepTarget: function(step) {
      if (typeof step.target === 'string') {
        return $('#' + step.target);
      }
      return $(step.target);
    },

    // Tour session persistence for multi-page tours. Uses HTML5 sessionStorage if available, then
    // falls back to using cookies.
    //
    // The following cookie-related logic is borrowed from:
    // http://www.quirksmode.org/js/cookies.html

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
          expires = "; expires="+date.toGMTString();
        }
        document.cookie = name+"="+value+expires+"; path=/";
      }
    },

    getState: function(name) {
      var nameEQ = name + "=",
          ca = document.cookie.split(';'),
          i,
          c;

      if (hasSessionStorage) {
        return sessionStorage.getItem(name);
      }
      else {
        for(i=0;i < ca.length;i++) {
          c = ca[i];
          while (c.charAt(0)===' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
      }
    },

    clearState: function(name) {
      if (hasSessionStorage) {
        sessionStorage.removeItem(name);
      }
      else {
        this.setState(name,"",-1);
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

  HopscotchI18N = {
    stepNums: null,
    nextBtn: 'Next',
    prevBtn: 'Back',
    doneBtn: 'Done',
    skipBtn: 'Skip',
    closeTooltip: 'Close'
  };

  HopscotchBubble = function(opt) {
    var isShowing = false,
        currStep,

    createButton = function(id, text) {
      var $btnEl = $('<input>');
      $btnEl.attr({
        id:    id,
        type:  'button',
        value: text
      });
      $btnEl.addClass('hopscotch-nav-button');

      if (id.indexOf('prev') >= 0) {
        $btnEl.addClass('prev');
      }
      else {
        $btnEl.addClass('next');
      }
      return $btnEl;
    },

    showButton = function($btnEl, show, permanent) {
      // permanent is a flag that indicates we should never show the button
      var classname = permanent ? 'hide-all' : 'hide';

      if (typeof show === undefinedStr) {
        show = true;
      }

      if (show) { $btnEl.removeClass(classname); }
      else      { $btnEl.addClass(classname); }
    },

    /**
     * setPosition
     * ===========
     * Sets the position of the bubble using the bounding rectangle of the
     * target element and the orientation and offset information specified by
     * the step JSON.
     */
    setPosition = function(bubble, step) {
      var bubbleWidth,
          bubbleHeight,
          bubblePadding,
          boundingRect,
          top,
          left,
          bubbleBorder = 6,
          targetEl     = utils.getStepTarget(step)[0],
          $el          = bubble.$element,
          $arrowEl     = bubble.$arrowEl,
          arrowOffset  = utils.getPixelValue(step.arrowOffset),
          position     = step.fixedElement ? 'fixed' : 'absolute';

      bubbleWidth   = utils.getPixelValue(step.width) || opt.bubbleWidth;
      bubblePadding = utils.valOrDefault(step.padding, opt.bubblePadding);

      $el.removeClass('fade-in-down fade-in-up fade-in-left fade-in-right');

      // SET POSITION
      boundingRect = targetEl.getBoundingClientRect();
      if (step.orientation === 'top') {
        bubbleHeight = $el.height();
        top = (boundingRect.top - bubbleHeight) - opt.arrowWidth;
        left = boundingRect.left;
      }
      else if (step.orientation === 'bottom') {
        top = boundingRect.bottom + opt.arrowWidth;
        left = boundingRect.left;
      }
      else if (step.orientation === 'left') {
        top = boundingRect.top;
        left = boundingRect.left - bubbleWidth - 2*bubblePadding - 2*bubbleBorder - opt.arrowWidth;
      }
      else if (step.orientation === 'right') {
        top = boundingRect.top;
        left = boundingRect.right + opt.arrowWidth;
      }

      // SET (OR RESET) ARROW OFFSETS
      if (!arrowOffset) {
        $arrowEl.css({
          top:  '',
          left: ''
        });
      }
      else if (step.orientation === 'top' || step.orientation === 'bottom') {
        $arrowEl.css({
          left: arrowOffset + 'px',
          top: ''
        });
      }
      else if (step.orientation === 'left' || step.orientation === 'right') {
        $arrowEl.css({
          top: arrowOffset + 'px',
          left: ''
        });
      }

      // SET OFFSETS
      left += utils.getPixelValue(step.xOffset);
      top += utils.getPixelValue(step.yOffset);

      // ADJUST TOP FOR SCROLL POSITION
      if (!step.fixedElement) {
        top += utils.getScrollTop();
        left += utils.getScrollLeft();
      }

      if (opt.animate && !hasCssTransitions) {
        $el.animate({
          top: top + 'px',
          left: left + 'px'
        }).css('position', position);
      }
      else {
        $el.css({
          top: top + 'px',
          left: left + 'px',
          position: position
        });
      }
    };

    this.init = function() {
      var $el              = $('<div>'),
          $containerEl     = $('<div>'),
          $bubbleContentEl = $('<div>'),
          self            = this,
          resizeCooldown  = false, // for updating after window resize
          winResizeTimeout;

      this.$element         = $el;
      this.$containerEl     = $containerEl;
      this.$titleEl         = $('<h3>');
      this.$numberEl        = $('<span>');
      this.$contentEl       = $('<p>');

      this.$numberEl.attr('id', 'hopscotch-bubble-number');

      $bubbleContentEl.append(this.$titleEl, this.$contentEl)
                      .attr('id', 'hopscotch-bubble-content');

      $containerEl.attr('id', 'hopscotch-bubble-container')
                  .append(this.$numberEl, $bubbleContentEl);

      $el.attr('id', 'hopscotch-bubble')
         .addClass('animated') // for fade css animation
         .append($containerEl);

      this.initNavButtons();
      this.initCloseButton();

      this.initArrow();

      // Not pretty, but IE doesn't support Function.bind(), so I'm
      // relying on closures to keep a handle of "this".
      // Reset position of bubble when window is resized
      $(window).on('resize', function() {
        if (resizeCooldown || !isShowing) {
          return;
        }
        resizeCooldown = true;
        winResizeTimeout = setTimeout(function() {
          setPosition(self, currStep, false);
          resizeCooldown = false;
        }, 200);
      });

      this.hide(false);
      $('body').append($el);
      return this;
    };

    this.initNavButtons = function() {
      var $buttonsEl  = $('<div>');

      this.$prevBtnEl = createButton('hopscotch-prev', HopscotchI18N.prevBtn);
      this.$nextBtnEl = createButton('hopscotch-next', HopscotchI18N.nextBtn);
      this.$doneBtnEl = createButton('hopscotch-done', HopscotchI18N.doneBtn);
      this.$doneBtnEl.addClass('hide');


      // Attach click listeners
      this.$prevBtnEl.click(function(evt) {
        winHopscotch.prevStep();
      });
      this.$nextBtnEl.click(function(evt) {
        winHopscotch.nextStep();
      });
      this.$doneBtnEl.click(winHopscotch.endTour);

      $buttonsEl.attr('id', 'hopscotch-actions')
                .append(this.$prevBtnEl,
                        this.$nextBtnEl,
                        this.$doneBtnEl);

      this.buttonsEl = $buttonsEl;

      this.$containerEl.append($buttonsEl);
      return this;
    };

    this.initCloseButton = function() {
      var $closeBtnEl = $('<a>');

      $closeBtnEl.text(HopscotchI18N.closeTooltip)
                 .attr({
                   id: 'hopscotch-bubble-close',
                   href: '#',
                   title: HopscotchI18N.closeTooltip
                 })
                 .click(function(evt) {
                   var currStepNum   = winHopscotch.getCurrStepNum(),
                       currTour      = winHopscotch.getCurrTour(),
                       doEndCallback = (currStepNum === currTour.steps.length-1);

                   utils.invokeCallbacks('close', [currTour.id, currStepNum]);

                   winHopscotch.endTour(true, doEndCallback);

                   if (evt.preventDefault) {
                     evt.preventDefault();
                   }
                   else if (event) {
                     event.returnValue = false;
                   }
                 });

      this.closeBtnEl = $closeBtnEl;
      this.$containerEl.append($closeBtnEl);
      return this;
    };

    this.initArrow = function() {
      var $arrowEl,
          $arrowBorderEl;

      this.$arrowEl = $('<div>').attr('id', 'hopscotch-bubble-arrow-container');

      $arrowBorderEl = $('<div>').addClass('hopscotch-bubble-arrow-border');

      $arrowEl = $('<div>').addClass('hopscotch-bubble-arrow');

      this.$arrowEl.append($arrowBorderEl, $arrowEl);

      this.$element.append(this.$arrowEl);
      return this;
    };

    this.renderStep = function(step, idx, subIdx, isLast, callback) {
      var self     = this,
          showNext = utils.valOrDefault(step.showNextButton, opt.showNextButton),
          showPrev = utils.valOrDefault(step.showPrevButton, opt.showPrevButton),
          bubbleWidth,
          bubblePadding;

      currStep = step;
      this.setTitle(step.title ? step.title : '');
      this.setContent(step.content ? step.content : '');
      this.setNum(idx);
      this.orientation = step.orientation;

      this.showPrevButton(this.$prevBtnEl && showPrev && (idx > 0 || subIdx > 0));
      this.showNextButton(this.$nextBtnEl && showNext && !isLast);
      this.$nextBtnEl.val(step.showSkip ? HopscotchI18N.skipBtn : HopscotchI18N.nextBtn);

      if (isLast) {
        this.$doneBtnEl.removeClass('hide');
      }
      else {
        this.$doneBtnEl.addClass('hide');
      }

      this.setArrow(step.orientation);

      // Set dimensions
      bubbleWidth   = utils.getPixelValue(step.width) || opt.bubbleWidth;
      bubblePadding = utils.valOrDefault(step.padding, opt.bubblePadding);
      this.$containerEl.css({
        width: bubbleWidth + 'px',
        padding: bubblePadding + 'px'
      });

      this.$element.css('zIndex', step.zindex ? step.zindex : '');

      if (step.orientation === 'top') {
        // Timeout to get correct height of bubble for positioning.
        setTimeout(function() {
          setPosition(self, step);
          if (callback) {
            if (!step.fixedElement) { callback(); }
            else { self.show(); }
          }
        }, 5);
      }
      else {
        // Don't care about height for the other orientations.
        setPosition(this, step);
        if (callback) {
          if (!step.fixedElement) { callback(); }
          else { self.show(); }
        }
      }

      return this;
    };

    this.setTitle = function(titleStr) {
      // CAREFUL!! Using $.html(), so don't use any user-generated
      // content here. (or if you must, escape it first)
      if (titleStr) {
        this.$titleEl.html(titleStr)
                     .removeClass('hide');
      }
      else {
        this.$titleEl.addClass('hide');
      }
      return this;
    };

    this.setContent = function(contentStr) {
      // CAREFUL!! Using $.html(), so don't use any user-generated
      // content here. (or if you must, escape it first)
      if (contentStr) {
        this.$contentEl.html(contentStr)
                      .removeClass('hide');
      }
      else {
        this.$contentEl.addClass('hide');
      }
      return this;
    };

    this.setNum = function(idx) {
      if (HopscotchI18N.stepNums && idx < HopscotchI18N.stepNums.length) {
        idx = HopscotchI18N.stepNums[idx];
      }
      else {
        idx = idx + 1;
      }
      this.$numberEl.html(idx);
    };

    this.setArrow = function(orientation) {
      // Whatever the orientation is, we want to arrow to appear
      // "opposite" of the orientation. E.g., a top orientation
      // requires a bottom arrow.
      if (orientation === 'top') {
        this.$arrowEl.removeClass()
                     .addClass('down');
      }
      else if (orientation === 'bottom') {
        this.$arrowEl.removeClass()
                     .addClass('up');
      }
      else if (orientation === 'left') {
        this.$arrowEl.removeClass()
                     .addClass('right');
      }
      else if (orientation === 'right') {
        this.$arrowEl.removeClass()
                     .addClass('left');
      }
    };

    this.getArrowDirection = function() {
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
    };

    this.show = function() {
      var self      = this,
          className = 'fade-in-' + this.getArrowDirection(),
          fadeDur   = 1000;

      this.$element.removeClass('hide');
      if (opt.animate) {
        setTimeout(function() {
          self.$element.addClass('animate');
        }, 50);
      }
      else {
        this.$element.addClass(className);
        setTimeout(function() {
          self.$element.removeClass('invisible');
        }, 50);
        setTimeout(function() {
          self.$element.removeClass(className);
        }, fadeDur);
      }
      isShowing = true;
      return this;
    };

    this.hide = function(remove) {
      remove = utils.valOrDefault(remove, true);
      this.$element.removeClass('animate fade-in-up fade-in-down fade-in-right fade-in-left')
                   .css({
                     top: '',
                     left: ''
                   });
      if (remove) {
        this.$element.addClass('hide')
                     .removeClass('invisible');
      }
      else {
        this.$element.addClass('invisible')
                     .removeClass('hide');
      }
      isShowing = false;
      return this;
    };

    this.showPrevButton = function(show, permanent) {
      showButton(this.$prevBtnEl, show, permanent);
    };

    this.showNextButton = function(show, permanent) {
      showButton(this.$nextBtnEl, show, permanent);
    };

    this.showCloseButton = function(show, permanent) {
      showButton(this.closeBtnEl, show, permanent);
    };


    /**
     * initAnimate
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
     */
    this.initAnimate = function() {
      var self = this;
      setTimeout(function() {
        self.$element.addClass('animate');
      }, 50);
    };

    this.removeAnimate = function() {
      this.$element.removeClass('animate');
    };

    this.init();
  };

  Hopscotch = function(initOptions) {
    var cookieName = 'hopscotch.tour.state',
        bubble,
        opt,
        currTour,
        currStepNum,
        currSubstepNum,
        cookieTourId,
        cookieTourStep,
        cookieTourSubstep,
        _configure,

    /**
     * getBubble
     * ==========
     * Retrieves the "singleton" bubble div or creates it if it doesn't
     * exist yet.
     */
    getBubble = function() {
      if (!bubble) {
        bubble = new HopscotchBubble(opt);
      }
      return bubble;
    },

    getCurrStep = function() {
      var step = currTour.steps[currStepNum];

      return (step.length > 0) ? step[currSubstepNum] : step;
    },

    isInMultiPartStep = function() {
      return currTour.steps[currStepNum].length > 0;
    },

    /**
     * incrementStep
     * =============
     * Sets current step num and substep num to the next step in the tour.
     * Returns true if successful, false if not.
     */
    incrementStep = function() {
      var numSubsteps = currTour.steps[currStepNum].length;
      if (currSubstepNum < numSubsteps-1) {
        ++currSubstepNum;
        return true;
      }
      else if (currStepNum < currTour.steps.length-1) {
        ++currStepNum;
        currSubstepNum = isInMultiPartStep() ? 0 : undefined;
        return true;
      }
      return false;
    },

    /**
     * decrementStep
     * =============
     * Sets current step num and substep num to the previous step in the tour.
     * Returns true if successful, false if not.
     */
    decrementStep = function() {
      var numPrevSubsteps;
      if (currSubstepNum > 0) {
        --currSubstepNum;
        return true;
      }
      else if (currStepNum > 0) {
        numPrevSubsteps = currTour.steps[--currStepNum].length;
        if (numPrevSubsteps) {
          currSubstepNum = numPrevSubsteps-1;
        }
        else {
          currSubstepNum = undefined;
        }
        return true;
      }
      return false;
    },

    /**
     * adjustWindowScroll
     * ==================
     * Checks if the bubble or target element is partially or completely
     * outside of the viewport. If it is, adjust the window scroll position
     * to bring it back into the viewport.
     */
    adjustWindowScroll = function(cb) {
      var $bubbleEl    = getBubble().$element,
          bubbleTop    = utils.getPixelValue($bubbleEl.css('top')),
          targetEl     = utils.getStepTarget(getCurrStep())[0],
          targetBounds = targetEl.getBoundingClientRect(),
          targetElTop  = targetBounds.top + utils.getScrollTop(),
          targetTop    = (bubbleTop < targetElTop) ? bubbleTop : targetElTop, // target whichever is higher
          scrollToVal  = targetTop - opt.scrollTopMargin; // This is our final target scroll value.

      $('body, html').animate({ scrollTop: scrollToVal }, opt.scrollDuration, cb);
    };

    this.init = function() {
      if (initOptions) {
        this.configure(initOptions);
      }
      return this;
    };

    /**
     * loadTour
     * ========
     * Loads, but does not display, tour. (Give the developer a chance to
     * override tour-specified configuration options before displaying)
     */
    this.loadTour = function(tour) {
      var tmpOpt = {},
          bubble,
          prop,
          tourState,
          tourPair,
          stepPair;

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
        cookieTourSubstep   = undefined;
        stepPair            = cookieTourStep.split('-');

        if (stepPair.length > 1) {
          cookieTourStep    = parseInt(stepPair[0], 10);
          cookieTourSubstep = parseInt(stepPair[1], 10);
        }
        else {
          cookieTourStep    = parseInt(cookieTourStep, 10);
        }

        // Check for multipage flag
        if (tourPair.length > 2 && tourPair[2] === 'mp') {
          // Increment cookie step
          if (cookieTourSubstep && cookieTourSubstep < currTour.steps[cookieTourStep].length-1) {
            ++cookieTourSubstep;
          }
          else if (cookieTourStep < currTour.steps.length-1) {
            ++cookieTourStep;
            if (currTour.steps[cookieTourStep].length > 0) {
              cookieTourSubstep = 0;
            }
            else {
              cookieTourSubstep = undefined;
            }
          }
        }
      }

      // Initialize whether to show or hide nav buttons
      bubble = getBubble();
      bubble.showPrevButton(opt.showPrevButton, true);
      bubble.showNextButton(opt.showNextButton, true);
      return this;
    };

    this.startTour = function(stepNum, substepNum) {
      var bubble,
          step;

      if (!currTour) {
        throw "Need to load a tour before you start it!";
      }

      // If document isn't ready, wait for it to finish loading.
      // (so that we can calculate positioning accurately)
      if (document.readyState !== 'complete') {
        waitingToStart = true;
        return this;
      }

      if (typeof stepNum !== undefinedStr) {
        currStepNum    = stepNum;
        currSubstepNum = substepNum;
      }

      // Check if we are resuming state.
      else if (currTour.id === cookieTourId && typeof cookieTourStep !== undefinedStr) {
        currStepNum    = cookieTourStep;
        currSubstepNum = cookieTourSubstep;
        step           = getCurrStep();
        if (!utils.getStepTarget(step)) {
          // May have just refreshed the page. Previous step should work. (but don't change cookie)
          decrementStep();
          step = getCurrStep();
          if (!utils.getStepTarget(step)) {
            // Previous target doesn't exist either. The user may have just
            // clicked on a link that wasn't part of the tour. Let's just "end"
            // the tour and depend on the cookie to pick the user back up where
            // she left off.
            this.endTour(false, false);
            return this;
          }
        }
      }
      else {
        currStepNum = 0;
      }

      if (!currSubstepNum && isInMultiPartStep()) {
        // Multi-part step
        currSubstepNum = 0;
      }

      utils.invokeCallbacks('start', [currTour.id, currStepNum]);

      this.isActive = true;
      if (opt.animate) {
        bubble.initAnimate();
      }

      // Check if first step element exists
      if (!utils.getStepTarget(getCurrStep())) {
        utils.invokeCallbacks('error', [currTour.id, currStepNum]);
        if (opt.skipIfNoElement) {
          this.nextStep(false);
        }
      }
      else {
        this.showStep(currStepNum, currSubstepNum);
      }
      return this;
    };

    this.showStep = function(stepIdx, substepIdx) {
      var tourSteps    = currTour.steps,
          step         = tourSteps[stepIdx],
          numTourSteps = tourSteps.length,
          cookieVal    = currTour.id + ':' + stepIdx,
          bubble       = getBubble(),
          delay        = utils.valOrDefault(step.delay, 0),
          isLast;

      // Update bubble for current step
      currStepNum    = stepIdx;
      currSubstepNum = substepIdx;

      if (typeof substepIdx !== undefinedStr && isInMultiPartStep()) {
        step = step[substepIdx];
        cookieVal += '-' + substepIdx;
      }

      isLast = (stepIdx === numTourSteps - 1) || (substepIdx >= step.length - 1);
      setTimeout(function() {
        bubble.renderStep(step, stepIdx, substepIdx, isLast, function() {
          // when done adjusting window scroll, call bubble.show()
          adjustWindowScroll(function() {
            bubble.show.call(bubble);
          });
        });
        utils.invokeCallbacks('show', [currTour.id, currStepNum]);
      }, delay);

      if (step.multipage) {
        cookieVal += ':mp';
      }

      utils.setState(opt.cookieName, cookieVal, 1);
      return this;
    };

    this.prevStep = function() {
      var step        = getCurrStep(),
          foundTarget = [];

      // invoke callbacks
      if (step.onPrev) {
        step.onPrev();
      }
      utils.invokeCallbacks('prev', [currTour.id, currStepNum]);

      if (opt.skipIfNoElement) {
        // decrement step until we find a target or until we reach beginning
        while (foundTarget.length === 0 && decrementStep()) {
          step = getCurrStep();
          foundTarget = utils.getStepTarget(step);
          if (foundTarget.length === 0) {
            utils.invokeCallbacks('error', [currTour.id, currStepNum]);
          }
        }
        if (foundTarget.length === 0) {
          return this.endTour(true, false);
        }
      }
      else if (decrementStep()) {
        // only try decrementing once, and invoke error callback if no target
        // is found
        step = getCurrStep();
        if (!utils.getStepTarget(step)) {
          utils.invokeCallbacks('error', [currTour.id, currStepNum]);
          return this.endTour(true, false);
        }
      }

      bubble.hide(false);
      this.showStep(currStepNum, currSubstepNum);

      return this;
    };

    this.nextStep = function(btnClick) {
      var step                 = getCurrStep(),
          origStepNum          = currStepNum,
          foundTarget          = [];

      btnClick = utils.valOrDefault(btnClick, true);

      if (opt.skipIfNoElement) {
        // increment step until we find a target or until we reach beginning
        while (foundTarget.length === 0 && incrementStep()) {
          step = getCurrStep();
          foundTarget = utils.getStepTarget(step);
          if (foundTarget.length === 0) {
            utils.invokeCallbacks('error', [currTour.id, currStepNum]);
          }
        }
        if (!foundTarget.length) {
          return this.endTour(true, false);
        }
      }
      else if (incrementStep()) {
        // only try incrementing once, and invoke error callback if no target
        // is found
        step = getCurrStep();
        if (!utils.getStepTarget(step)) {
          utils.invokeCallbacks('error', [currTour.id, currStepNum]);
          return this.endTour(true, false);
        }
      }

      if (btnClick) {
        // invoke callbacks -- only if it resulted from a button click
        if (step.onNext) {
          step.onNext();
        }
        utils.invokeCallbacks('next', [currTour.id, origStepNum]);
      }

      bubble.hide(false);
      this.showStep(currStepNum, currSubstepNum);

      return this;
    };

    /**
     * endTour
     * ==========
     * Cancels out of an active tour. No state is preserved.
     */
    this.endTour = function(clearCookie, doCallback) {
      var bubble     = getBubble();
      clearCookie    = utils.valOrDefault(clearCookie, true);
      doCallback     = utils.valOrDefault(doCallback, true);
      currStepNum    = 0;
      currSubstepNum = undefined;
      cookieTourStep = undefined;

      bubble.hide();
      if (clearCookie) {
        utils.clearState(opt.cookieName);
      }
      winHopscotch.isActive = false;

      if (doCallback) {
        utils.invokeCallbacks('end', [currTour.id]);
      }

      winHopscotch.removeCallbacks(true);

      return this;
    };

    this.getCurrTour = function() {
      return currTour;
    };

    this.getCurrStepNum = function() {
      return currStepNum;
    };

    this.getCurrSubstepNum = function() {
      return currSubstepNum;
    };

    this.hasTakenTour = function(tourId) {
      if (hasSessionStorage) {
        utils.getState(opt.cookieName + '_history');
      }
      return false;
    };

    this.setHasTakenTour = function(tourId) {
      var history;
      if (hasSessionStorage && !this.hasTakenTour(tourId)) {
        history = utils.getState(opt.cookieName + '_history');
        if (history) {
          history += ';'+tourId;
        }
        else {
          history = tourId;
        }
      }
    };

    this.clearHasTakenTour = function(tourId) {
      var history,
          tourIds,
          i,
          len,
          historyName = opt.cookieName + '_history',
          found = false;

      if (hasSessionStorage) {
        history = utils.getState(historyName);
        if (history) {
          tourIds = history.split(';');
          for (i=0, len=tourIds.length; i<len; ++i) {
            if (tourIds[i] === tourId) {
              tourIds.splice(i, 1);
              found = true;
              break;
            }
          }
          if (found) {
            utils.setState(historyName, tourIds.join(';'));
          }
        }
      }
    };

    /**
     * addCallback
     * ===========
     */
    this.addCallback = function(evtType, cb, isTourCb) {
      if (cb) {
        callbacks[evtType].push({ cb: cb, fromTour: isTourCb });
      }
      return this;
    };

    /**
     * removeCallbacks
     * ===============
     * Remove callbacks specified from hopscotch.configure(). If tourOnly
     * is set to true, only removes callbacks specified by a tour (callbacks
     * set by external calls to hopscotch.configure will not be removed).
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

    this.setCookieName = function(name) {
      cookieName     = name;
      opt.cookieName = name;
    };

    this.resetDefaultOptions = function() {
      opt = {
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
        skipIfNoElement: true,
        cookieName:      cookieName
      };
    };

    /**
     * _configure
     * ==========
     * VALID OPTIONS INCLUDE...
     * bubbleWidth:     Number   - Default bubble width. Defaults to 280.
     * bubblePadding:   Number   - Default bubble padding. Defaults to 15.
     * animate:         Boolean  - should the tour bubble animate between steps?
     *                             Defaults to FALSE.
     * smoothScroll:    Boolean  - should the page scroll smoothly to the next
     *                             step? Defaults to TRUE.
     * scrollDuration:  Number   - Duration of page scroll. Only relevant when
     *                             smoothScroll is set to true. Defaults to
     *                             1000ms.
     * scrollTopMargin: NUMBER   - When the page scrolls, how much space should there
     *                             be between the bubble/targetElement and the top
     *                             of the viewport? Defaults to 200.
     * showCloseButton: Boolean  - should the tour bubble show a close (X) button?
     *                             Defaults to TRUE.
     * showPrevButton:  Boolean  - should the bubble have the Previous button?
     *                             Defaults to FALSE.
     * showNextButton:  Boolean  - should the bubble have the Next button?
     *                             Defaults to TRUE.
     * arrowWidth:      Number   - Default arrow width. (space between the bubble
     *                             and the targetEl) Need to provide the option
     *                             to set this here in case developer wants to
     *                             use own CSS. Defaults to 28.
     * skipIfNoElement  Boolean  - If a specified target element is not found,
     *                             should we skip to the next step? Defaults to
     *                             TRUE.
     * onNext:          Function - A callback to be invoked after every click on
     *                             a "Next" button.
     *
     * i18n:            Object   - For i18n purposes. Allows you to change the
     *                             text of button labels and step numbers.
     * i18n.stepNums:   Array<String> - Provide a list of strings to be shown as
     *                             the step number, based on index of array. Unicode
     *                             characters are supported. (e.g., ['&#x4e00;',
     *                             '&#x4e8c;', '&#x4e09;']) If there are more steps
     *                             than provided numbers, Arabic numerals
     *                             ('4', '5', '6', etc.) will be used as default.
     *
     * isTourOptions:   This is a flag for the purpose of removing tour-specific
     *                  callbacks once a tour ends. This is only used
     *                  internally.
     */
    _configure = function(options, isTourOptions) {
      var bubble;

      if (!opt) {
        this.resetDefaultOptions();
      }

      utils.extend(opt, options);

      if (options) {
        utils.extend(HopscotchI18N, options.i18n);
      }

      this.addCallback('next', options.onNext, isTourOptions)
          .addCallback('prev', options.onPrev, isTourOptions)
          .addCallback('start', options.onStart, isTourOptions)
          .addCallback('end', options.onEnd, isTourOptions)
          .addCallback('show', options.onShow, isTourOptions)
          .addCallback('error', options.onError, isTourOptions)
          .addCallback('close', options.onClose, isTourOptions);

      bubble = getBubble();

      if (opt.animate) {
        bubble.initAnimate();
      }
      else {
        bubble.removeAnimate();
      }

      bubble.showPrevButton(opt.showPrevButton, true);
      bubble.showNextButton(opt.showNextButton, true);
      bubble.showCloseButton(opt.showCloseButton, true);

      return this;
    };

    /**
     * configure
     * =========
     * Just a wrapper for _configure, to make sure developers don't try and set
     * isTourOptions.
     */
    this.configure = function(options) {
      return _configure.call(this, options, false);
    };

    this.init(initOptions);
  };

  winHopscotch = new Hopscotch();
  context[namespace] = winHopscotch;
}(window, 'hopscotch'));
