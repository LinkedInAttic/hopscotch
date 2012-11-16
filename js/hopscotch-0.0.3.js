(function(context, namespace) {
  var Hopscotch,
      HopscotchBubble,
      HopscotchI18N,
      utils,
      callbacks,
      winLoadHandler,
      winHopscotch      = context[namespace],
      undefinedStr      = 'undefined',
      waitingToStart    = false, // is a tour waiting for the document to finish
                                 // loading so that it can start?
      hasJquery         = (typeof window.jQuery !== undefinedStr),
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
     */
    addClass: function(domEl, classToAdd) {
      var domClasses,
          i, len;

      if (domEl.className.length === 0) {
        domEl.className = classToAdd;
      }
      else {
        domClasses = domEl.className.split(' ');
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
     */
    removeClass: function(domEl, classToRemove) {
      var domClasses,
          classesToRemove,
          currClass,
          i,
          j,
          toRemoveLen,
          domClassLen;

      classesToRemove = classToRemove.split(' ');
      domClasses = domEl.className.split(' ');
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

    getWindowHeight: function() {
      return window.innerHeight ? window.innerHeight : document.documentElement.clientHeight;
    },

    getWindowWidth: function() {
      return window.innerWidth ? window.innerWidth : document.documentElement.clientWidth;
    },

    addClickListener: function(el, fn) {
      return el.addEventListener ? el.addEventListener('click', fn, false) : el.attachEvent('onclick', fn);
    },

    evtPreventDefault: function(evt) {
      if (evt.preventDefault) {
        evt.preventDefault();
      }
      else if (event) {
        event.returnValue = false;
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
      var result;

      if (!step || !step.target) { return null; }
      if (typeof step.target === 'string') {
        // Check if it's querySelector-eligible. Only accepting IDs and classes,
        // because that's the only thing that makes sense. Tag name and pseudo-class
        // are just silly.
        if (/[#\.].*/.test(step.target)) {
          if (document.querySelector) {
            return document.querySelector(step.target);
          }
          if (hasJquery) {
            result = jQuery(step.target);
            return result.length ? result[0] : null;
          }
          if (window.Sizzle) {
            result = Sizzle(step.target);
            return result.length ? result[0] : null;
          }
          if (step.target[0] === '#' && step.target.indexOf(' ') === -1) {
            return document.getElementById(step.target.substring(1));
          }
          // Can't extract element. Likely IE <=7 and no jQuery/Sizzle.
          return null;
        }
        // Else assume it's a string id.
        return document.getElementById(step.target);
      }
      return step.target;
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

  /**
   * HopscotchBubble
   *
   * @class The HopscotchBubble class is a singleton class which manages the properties of the bubble.
   * @private
   */
  HopscotchBubble = function(opt) {
    var isShowing = false,
        currStep,

    /**
     * @private
     */
    createButton = function(id, text) {
      var btnEl = document.createElement('input');
      btnEl.id = id;
      btnEl.type = 'button';
      btnEl.value = text;
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
     * @private
     */
    showButton = function(btnEl, show, permanent) {
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

    /**
     * setPosition
     *
     * Sets the position of the bubble using the bounding rectangle of the
     * target element and the orientation and offset information specified by
     * the step JSON.
     *
     * @private
     */
    setPosition = function(step) {
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

      bubbleWidth   = utils.getPixelValue(step.width) || opt.bubbleWidth;
      bubblePadding = utils.valOrDefault(step.padding, opt.bubblePadding);
      utils.removeClass(el, 'fade-in-down fade-in-up fade-in-left fade-in-right');

      // SET POSITION
      boundingRect = targetEl.getBoundingClientRect();
      if (step.orientation === 'top') {
        bubbleHeight = el.offsetHeight;
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

      if (opt.animate && hasJquery && !hasCssTransitions) {
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
    init = function() {
      var el              = document.createElement('div'),
          containerEl     = document.createElement('div'),
          bubbleContentEl = document.createElement('div'),
          self            = this,
          resizeCooldown  = false, // for updating after window resize
          onWinResize,
          winResizeTimeout;

      this.element         = el;
      this.containerEl     = containerEl;
      this.titleEl         = document.createElement('h3');
      this.numberEl        = document.createElement('span');
      this.contentEl       = document.createElement('p');

      el.id = 'hopscotch-bubble';
      utils.addClass(el, 'animated'); // for fade css animation
      containerEl.id = 'hopscotch-bubble-container';
      this.numberEl.id = 'hopscotch-bubble-number';
      containerEl.appendChild(this.numberEl);
      bubbleContentEl.appendChild(this.titleEl);
      bubbleContentEl.appendChild(this.contentEl);
      bubbleContentEl.id = 'hopscotch-bubble-content';
      containerEl.appendChild(bubbleContentEl);
      el.appendChild(containerEl);

      this.initNavButtons();
      this.initCloseButton();

      this.initArrow();

      /**
       * Not pretty, but IE doesn't support Function.bind(), so I'm
       * relying on closures to keep a handle of "this".
       * Reset position of bubble when window is resized
       *
       * @private
       */
      onWinResize = function() {
        if (resizeCooldown || !isShowing) {
          return;
        }

        resizeCooldown = true;
        winResizeTimeout = setTimeout(function() {
          setPosition.call(self, currStep, false);
          resizeCooldown = false;
        }, 200);
      };

      if (window.addEventListener) {
        window.addEventListener('resize', onWinResize, false);
      }

      else if (window.attachEvent) {
        window.attachEvent('onresize', onWinResize, false);
      }

      this.hide();
      document.body.appendChild(el);
      return this;
    };

    this.initNavButtons = function() {
      var buttonsEl  = document.createElement('div');

      this.prevBtnEl = createButton('hopscotch-prev', HopscotchI18N.prevBtn);
      this.nextBtnEl = createButton('hopscotch-next', HopscotchI18N.nextBtn);
      this.doneBtnEl = createButton('hopscotch-done', HopscotchI18N.doneBtn);
      utils.addClass(this.doneBtnEl, 'hide');

      buttonsEl.appendChild(this.prevBtnEl);
      buttonsEl.appendChild(this.nextBtnEl);
      buttonsEl.appendChild(this.doneBtnEl);

      // Attach click listeners
      utils.addClickListener(this.prevBtnEl, function(evt) {
        winHopscotch.prevStep(true);
      });

      utils.addClickListener(this.nextBtnEl, function(evt) {
        winHopscotch.nextStep(true);
      });
      utils.addClickListener(this.doneBtnEl, winHopscotch.endTour);

      buttonsEl.id = 'hopscotch-actions';
      this.buttonsEl = buttonsEl;

      this.containerEl.appendChild(buttonsEl);
      return this;
    };

    this.initCloseButton = function() {
      var closeBtnEl = document.createElement('a');

      closeBtnEl.id = 'hopscotch-bubble-close';
      closeBtnEl.href = '#';
      closeBtnEl.title = HopscotchI18N.closeTooltip;
      closeBtnEl.innerHTML = HopscotchI18N.closeTooltip;

      utils.addClickListener(closeBtnEl, function(evt) {
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

      this.closeBtnEl = closeBtnEl;
      this.containerEl.appendChild(closeBtnEl);
      return this;
    };

    this.initArrow = function() {
      var arrowEl,
          arrowBorderEl;

      this.arrowEl = document.createElement('div');
      this.arrowEl.id = 'hopscotch-bubble-arrow-container';

      arrowBorderEl = document.createElement('div');
      arrowBorderEl.className = 'hopscotch-bubble-arrow-border';

      arrowEl = document.createElement('div');
      arrowEl.className = 'hopscotch-bubble-arrow';

      this.arrowEl.appendChild(arrowBorderEl);
      this.arrowEl.appendChild(arrowEl);

      this.element.appendChild(this.arrowEl);
      return this;
    };

    this.renderStep = function(step, idx, isLast, callback) {
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

      this.showPrevButton(this.prevBtnEl && showPrev && idx > 0);
      this.showNextButton(this.nextBtnEl && showNext && !isLast);
      this.nextBtnEl.value = step.showSkip ? HopscotchI18N.skipBtn : HopscotchI18N.nextBtn;

      if (isLast) {
        utils.removeClass(this.doneBtnEl, 'hide');
      }
      else {
        utils.addClass(this.doneBtnEl, 'hide');
      }

      this.setArrow(step.orientation);

      // Set dimensions
      bubbleWidth   = utils.getPixelValue(step.width) || opt.bubbleWidth;
      bubblePadding = utils.valOrDefault(step.padding, opt.bubblePadding);
      this.containerEl.style.width = bubbleWidth + 'px';
      this.containerEl.style.padding = bubblePadding + 'px';

      this.element.style.zIndex = (step.zindex ? step.zindex : '');

      if (step.orientation === 'top') {
        // Timeout to get correct height of bubble for positioning.
        setTimeout(function() {
          setPosition.call(self, step);
          // only want to adjust window scroll for non-fixed elements
          if (callback) {
            if (!step.fixedElement) { callback(); }
            else { self.show(); }
          }
        }, 5);
      }
      else {
        // Don't care about height for the other orientations.
        setPosition.call(this, step);
        // only want to adjust window scroll for non-fixed elements
        if (callback) {
          if (!step.fixedElement) { callback(); }
          else { self.show(); }
        }
      }

      return this;
    };

    this.setTitle = function(titleStr) {
      if (titleStr) {
        this.titleEl.innerHTML = titleStr;
        utils.removeClass(this.titleEl, 'hide');
      }
      else {
        utils.addClass(this.titleEl, 'hide');
      }
      return this;
    };

    this.setContent = function(contentStr) {
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
    };

    this.setNum = function(idx) {
      if (HopscotchI18N.stepNums && idx < HopscotchI18N.stepNums.length) {
        idx = HopscotchI18N.stepNums[idx];
      }
      else {
        idx = idx + 1;
      }
      this.numberEl.innerHTML = idx;
    };

    this.setArrow = function(orientation) {
      // Whatever the orientation is, we want to arrow to appear
      // "opposite" of the orientation. E.g., a top orientation
      // requires a bottom arrow.
      if (orientation === 'top') {
        this.arrowEl.className = 'down';
      }
      else if (orientation === 'bottom') {
        this.arrowEl.className = 'up';
      }
      else if (orientation === 'left') {
        this.arrowEl.className = 'right';
      }
      else if (orientation === 'right') {
        this.arrowEl.className = 'left';
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

      utils.removeClass(this.element, 'hide');
      if (opt.animate) {
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
      isShowing = true;
      return this;
    };

    this.hide = function(remove) {
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
        if (!opt.animate) {
          utils.addClass(el, 'invisible');
        }
      }
      utils.removeClass(el, 'animate fade-in-up fade-in-down fade-in-right fade-in-left');
      isShowing = false;
      return this;
    };

    this.showPrevButton = function(show, permanent) {
      showButton(this.prevBtnEl, show, permanent);
    };

    this.showNextButton = function(show, permanent) {
      showButton(this.nextBtnEl, show, permanent);
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
        utils.addClass(self.element, 'animate');
      }, 50);
    };

    this.removeAnimate = function() {
      utils.removeClass(this.element, 'animate');
    };

    init.call(this);
  };

  /**
   * Hopscotch
   *
   * @class Creates the Hopscotch object. Used to manage tour progress and configurations.
   * @constructor
   * @param {Object} initOptions Options to be passed to `configure()`.
   */
  Hopscotch = function(initOptions) {
    var cookieName = 'hopscotch.tour.state',
        self       = this, // for targetClickNextFn
        bubble,
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
        bubble = new HopscotchBubble(opt);
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
        return null;
      }
      else {
        step = currTour.steps[currStepNum];
      }

      return step;
    },

    // Used for nextOnTargetClick
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
          scrollInt;

      // Target and bubble are both visible in viewport
      if (targetTop >= windowTop && (targetTop <= windowTop + opt.scrollTopMargin || targetBottom <= windowBottom)) {
        if (cb) { cb(); } // HopscotchBubble.show
        return;
      }

      // Abrupt scroll to scroll target
      else if (!opt.smoothScroll) {
        window.scrollTo(0, scrollToVal);

        if (cb) { cb(); } // HopscotchBubble.show
        return;
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
          scrollInt = setInterval(function() {
            var scrollTop = utils.getScrollTop(),
                scrollTarget = scrollTop + (direction * scrollIncr);

            if ((direction > 0 && scrollTarget >= scrollToVal) ||
                direction < 0 && scrollTarget <= scrollToVal) {
              // Overshot our target. Just manually set to equal the target
              // and clear the interval
              scrollTarget = scrollToVal;
              clearInterval(scrollInt);
              if (cb) { cb(); } // HopscotchBubble.show
              window.scrollTo(0, scrollTarget);
              return;
            }

            window.scrollTo(0, scrollTarget);

            if (utils.getScrollTop() === scrollTop) {
              // Couldn't scroll any further. Clear interval.
              clearInterval(scrollInt);

              if (cb) { cb(); } // HopscotchBubble.show
            }
          }, 10);
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
     * @returns {Number} step number we landed on
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
            utils.invokeCallbacks('error', [currTour.id, currStepNum]);
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
          origStepNum,
          changeStepCb;

      bubble.hide();

      doCallbacks = utils.valOrDefault(doCallbacks, true);
      step = getCurrStep();
      origStepNum = currStepNum;

      // Callback for goToStepWithTarget
      changeStepCb = function(stepNum) {
        if (stepNum === -1) {
          // Wasn't able to find a step with an existing element. End tour.
          return this.endTour(true);
        }

        if (doCallbacks) {
          // invoke callbacks
          if (direction > 0 && step.onNext) {
            step.onNext();
          }
          else if (direction < 0 && step.onPrev) {
            step.onPrev();
          }
          utils.invokeCallbacks(direction > 0 ? 'next' : 'prev', [currTour.id, origStepNum]);
        }

        this.showStep(stepNum);
      };

      if (opt.skipIfNoElement) {
        goToStepWithTarget(direction, function(stepNum) {
          changeStepCb.call(self, stepNum);
        });
      }
      else if (currStepNum + direction >= 0 && currStepNum + direction < currTour.steps.length) {
        // only try incrementing once, and invoke error callback if no target is found
        currStepNum += direction;
        step = getCurrStep();
        if (!utils.getStepTarget(step)) {
          utils.invokeCallbacks('error', [currTour.id, currStepNum]);
          return this.endTour(true, false);
        }
        this.changeStepCb(currStepNum);
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
        this.configure(initOptions);
      }
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

      utils.invokeCallbacks('start', [currTour.id, currStepNum]);

      bubble = getBubble();
      bubble.hide(false); // make invisible for boundingRect calculations when opt.animate == true

      this.isActive = true;
      if (opt.animate) {
        bubble.initAnimate();
      }

      if (!utils.getStepTarget(getCurrStep())) {
        // First step element doesn't exist
        utils.invokeCallbacks('error', [currTour.id, currStepNum]);
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
            isLast;

        // Update bubble for current step
        currStepNum    = stepNum;

        // Only do fade if we're not animating.
        if (!opt.animate) {
          bubble.hide(false);
        }

        isLast = (stepNum === numTourSteps - 1);
        bubble.renderStep(step, stepNum, isLast, function() {
          // when done adjusting window scroll, call bubble.show()
          adjustWindowScroll(function() {
            bubble.show();
          });

          if (step.onShow) { step.onShow(); }

          // If we want to advance to next step when user clicks on target.
          if (step.nextOnTargetClick) {
            utils.addClickListener(targetEl, targetClickNextFn);
          }
        });
        utils.invokeCallbacks('show', [currTour.id, currStepNum]);

        if (step.multipage) {
          cookieVal += ':mp';
        }

        utils.setState(opt.cookieName, cookieVal, 1);
      }, step.delay ? step.delay : 0);
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
        targetEl.removeEventListener ? targetEl.removeEventListener('click', targetClickNextFn, false) : targetEl.detachEvent('click', targetClickNextFn);
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
        utils.invokeCallbacks('end', [currTour.id]);
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
      if (evtType && cb) {
        callbacks[evtType].push({ cb: cb, fromTour: isTourCb });
      }
      return this;
    };

    /**
     * removeCallback
     *
     * Removes a callback for one of the event types, e.g. 'start', 'next', etc.
     *
     * @param {string} evtType "start", "end", "next", "prev", "show", "close", or "error"
     * @param {Function} cb The callback to remove.
     * @returns {Object} Hopscotch
     */
    this.removeCallback = function(evtType, cb) {
      var cbs = callbacks[evtType],
          i,
          len;

      for (i = 0, len = cbs.length; i < len; ++i) {
        if (cb === cbs[i].cb) {
          cbs.splice(i, 1);
        }
      }
      return this;
    };

    /**
     * removeCallbacks
     *
     * Remove callbacks for a hopscotch event. If tourOnly is set to true, only
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
     * setCookieName
     *
     * Sets the cookie name (or sessionStorage name, if supported) used for multi-page
     * tour persistence.
     *
     * @param {String} name The cookie name
     * @returns {Object} Hopscotch
     */
    this.setCookieName = function(name) {
      cookieName     = name;
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
      var bubble;

      if (!opt) {
        this.resetDefaultOptions();
      }

      utils.extend(opt, options);

      if (options) {
        utils.extend(HopscotchI18N, options.i18n);
      }

      this.listen('next', options.onNext, isTourOptions)
          .listen('prev', options.onPrev, isTourOptions)
          .listen('start', options.onStart, isTourOptions)
          .listen('end', options.onEnd, isTourOptions)
          .listen('show', options.onShow, isTourOptions)
          .listen('error', options.onError, isTourOptions)
          .listen('close', options.onClose, isTourOptions);

      bubble = getBubble();

      if (opt.animate) {
        bubble.initAnimate();
      }
      else {
        bubble.removeAnimate();
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
