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
 * event listener for window resize? (to reposition bubble);
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
 * how to i18n the step numbers?
 *
 * http://daneden.me/animate/ for bounce animation
 *
 */

(function() {
  var Hopscotch,
      HopscotchBubble,
      utils,
      hasJquery         = (typeof jQuery !== 'undefined'),
      docStyle          = document.body.style,
      hasCssTransitions = (typeof docStyle.MozTransition !== 'undefined' ||
                           typeof docStyle.MsTransition !== 'undefined' ||
                           typeof docStyle.webkitTransition !== 'undefined' ||
                           typeof docStyle.OTransition !== 'undefined' ||
                           typeof docStyle.transition !== 'undefined');

  if (window.hopscotch) {
    // Hopscotch already exists.
    return;
  }

  /**
   * utils
   * =====
   * A set of utility functions, mostly for standardizing to manipulate
   * and extract information from the DOM. Basically these are things I
   * would normally use jQuery for, but I don't want to require it for
   * this framework.
   */
  utils = {
    /**
     * addClass
     * ========
     * Adds a class to a DOM element.
     */
    addClass: function(domEl, classToAdd) {
      var domClasses,
          i, len;

      if (hasJquery) {
        $(domEl).addClass(classToAdd);
      }

      else if (domEl.className.length === 0) {
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

    removeClass: function(domEl, classToRemove) {
      var domClasses, i, len;

      if (hasJquery) {
        $(domEl).removeClass(classToRemove);
        return;
      }

      domClasses = domEl.className.split(' ');
      for (i = 0, len = domClasses.length; i < len; ++i) {
        if (domClasses[i] === classToRemove) {
          break;
        }
      }

      if (i < len) {
        domClasses.splice(i, 1); // remove class from list
        domEl.className = domClasses.join(' ');
      }
    },

    getPixelValue: function(val) {
      switch(typeof val) {
        case 'undefined':
          return 0;
        case 'string':
          return parseInt(val, 10); 
        default:
          return val;
      }
    },

    // Inspired by Python...
    getValOrDefault: function(val, valDefault) {
      return typeof val !== 'undefined' ? val : valDefault;
    },

    getScrollTop: function() {
      if (typeof window.pageYOffset !== 'undefined') {
        return window.pageYOffset;
      }
      else {
        // Most likely IE <=8, which doesn't support pageYOffset
        return document.documentElement.scrollTop;
      }
    },

    getScrollLeft: function() {
      if (typeof window.pageXOffset !== 'undefined') {
        return window.pageXOffset;
      }
      else {
        // Most likely IE <=8, which doesn't support pageXOffset
        return document.documentElement.scrollLeft;
      }
    },

    getWindowHeight: function() {
      if (window.innerHeight) {
        return window.innerHeight;
      }
      else {
        return document.documentElement.clientHeight;
      }
    },

    getWindowWidth: function() {
      if (window.innerWidth) {
        return window.innerWidth;
      }
      else {
        return document.documentElement.clientWidth;
      }
    },

    addClickListener: function(el, fn, prvtDefault) {
      if (el.addEventListener) {
        el.addEventListener('click', fn);
      }
      else {
        el.attachEvent('onclick', fn);
      }
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

    // The following three cookie-related functions are borrowed from
    // http://www.quirksmode.org/js/cookies.html
    createCookie: function(name,value,days) {
      if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
      }
      else var expires = "";
      document.cookie = name+"="+value+expires+"; path=/";
    },

    readCookie: function(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
      }
      return null;
    },

    eraseCookie: function(name) {
      this.createCookie(name,"",-1);
    }
  };

  HopscotchBubble = function(opt) {
    var prevBtnCallback,
        nextBtnCallback,
        currStep,
        isShowing = false,

    createButton = function(id, text) {
      var btnEl = document.createElement('input');
      btnEl.setAttribute('id', id);
      btnEl.setAttribute('type', 'button');
      btnEl.setAttribute('value', text);
      utils.addClass(btnEl, 'hopscotch-nav-button');
      return btnEl;
    };

    this.init = function() {
      var el = document.createElement('div');

      this.element     = el;
      this.containerEl = document.createElement('div');
      this.titleEl     = document.createElement('h3');
      this.numberEl    = document.createElement('span');
      this.contentEl   = document.createElement('p');

      el.setAttribute('id', 'hopscotch-bubble');
      this.containerEl.setAttribute('id', 'hopscotch-bubble-container');
      this.numberEl.setAttribute('id', 'hopscotch-bubble-number');
      this.containerEl.appendChild(this.titleEl);
      this.containerEl.appendChild(this.numberEl);
      this.containerEl.appendChild(this.contentEl);
      el.appendChild(this.containerEl);

      this.initNavButtons();

      if (opt && opt.showCloseButton) {
        this.initCloseButton();
      }

      this.initArrow();

      window.onresize = this.handleWinResize.bind(this);

      document.body.appendChild(el);
      return this;
    };

    this.initNavButtons = function() {
      var buttonsEl  = document.createElement('div');

      this.prevBtnEl = createButton('hopscotch-prev', 'Back');
      this.nextBtnEl = createButton('hopscotch-next', 'Next');
      this.doneBtnEl = createButton('hopscotch-done', 'Done');
      utils.addClass(this.doneBtnEl, 'hide');

      buttonsEl.appendChild(this.prevBtnEl);
      buttonsEl.appendChild(this.nextBtnEl);
      buttonsEl.appendChild(this.doneBtnEl);

      // Attach click listeners
      utils.addClickListener(this.prevBtnEl, function(evt) {
        if (prevBtnCallback) {
          prevBtnCallback();
        }
        window.hopscotch.prevStep();
      });
      utils.addClickListener(this.nextBtnEl, function(evt) {
        if (nextBtnCallback) {
          nextBtnCallback();
        }
        window.hopscotch.nextStep();
      });
      utils.addClickListener(this.doneBtnEl, window.hopscotch.endTour);

      buttonsEl.setAttribute('id', 'hopscotch-actions');
      this.buttonsEl = buttonsEl;

      this.containerEl.appendChild(buttonsEl);
      return this;
    };

    this.initCloseButton = function() {
      var closeBtnEl = document.createElement('a');

      closeBtnEl.setAttribute('id', 'hopscotch-bubble-close');
      closeBtnEl.setAttribute('href', '#');
      closeBtnEl.setAttribute('title', 'Close');
      closeBtnEl.innerHTML = 'x';

      utils.addClickListener(closeBtnEl, function(evt) {
        window.hopscotch.endTour();
        utils.evtPreventDefault(evt);
      });

      this.containerEl.appendChild(closeBtnEl);
      return this;
    };

    this.initArrow = function() {
      this.arrowEl = document.createElement('div');
      this.arrowEl.setAttribute('id', 'hopscotch-bubble-arrow');
      this.containerEl.appendChild(this.arrowEl);
    };

    this.renderStep = function(step, idx, isLast, callback) {
      var self = this,
          showNext = (typeof step.showNextBtn === 'undefined' || step.showNextBtn),
          showPrev = (typeof step.showPrevBtn === 'undefined' || step.showPrevBtn),
          bubbleWidth,
          bubblePadding;

      currStep = step;

      if (step.title) { this.setTitle(step.title); }
      if (step.content) { this.setContent(step.content); }
      this.setNum(idx);

      this.showPrevButton(this.prevBtnEl && showPrev && idx > 0);
      this.showNextButton(this.nextBtnEl && showNext && !isLast);
      if (isLast) {
        utils.removeClass(this.doneBtnEl, 'hide');
      }
      else {
        utils.addClass(this.doneBtnEl, 'hide');
      }

      this.setArrow(step.orientation);

      // Set dimensions
      bubbleWidth = utils.getPixelValue(step.width) || opt.bubbleWidth;
      bubblePadding = utils.getValOrDefault(step.padding, opt.bubblePadding);
      this.containerEl.style.width = bubbleWidth + 'px';
      this.containerEl.style.padding = bubblePadding + 'px';

      if (step.orientation === 'top') {
        // Timeout to get correct height of bubble for positioning.
        setTimeout(function() {
          self.setPosition(step);
          if (callback) { callback(); }
        }, 5);
      }
      else {
        // Don't care about height for the other orientations.
        this.setPosition(step);
        if (callback) { callback(); }
      }

      // Set or clear new nav callbacks
      prevBtnCallback = step.prevCallback;
      nextBtnCallback = step.nextCallback;

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
      this.numberEl.innerHTML = idx+1;
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

    this.show = function() {
      var self = this;
      if (opt.animate) {
        setTimeout(function() {
          utils.addClass(self.element, 'animate');
        }, 50);
      }
      utils.removeClass(this.element, 'hide');
      isShowing = true;
      return this;
    };

    this.hide = function() {
      utils.addClass(this.element, 'hide');
      utils.removeClass(this.element, 'animate');
      isShowing = false;
      return this;
    };

    this.showPrevButton = function(show, permanent) {
      var classname = 'hide';

      if (permanent) {
        // permanent is a flag that indicates we should always/never show the button
        classname = 'hide-all';
      }
      if (typeof show === 'undefined') {
        show = true;
      }

      if (show) { utils.removeClass(this.prevBtnEl, classname); }
      else { utils.addClass(this.prevBtnEl, classname); }
    };

    this.showNextButton = function(show, permanent) {
      var classname = 'hide';

      if (permanent) {
        // permanent is a flag that indicates we should always/never show the button
        classname = 'hide-all';
      }
      if (typeof show === 'undefined') {
        show = true;
      }

      if (show) { utils.removeClass(this.nextBtnEl, classname); }
      else { utils.addClass(this.nextBtnEl, classname); }
    };

    this.handleWinResize = function() {
      var self = this,
          cooldownActive = false, // for updating after window resize
          winResizeTimeout;

      if (cooldownActive || !isShowing) {
        return;
      }
      cooldownActive = true;
      winResizeTimeout = setTimeout(function() {
        // currStep should not be null
        self.setPosition(currStep);
        cooldownActive = false;
      }, 40);
    };

    /**
     * setPosition
     * ===========
     * Sets the position of the bubble using the bounding rectangle of the
     * target element and the orientation and offset information specified by
     * the step JSON.
     */
    this.setPosition = function(step) {
      var bubbleWidth,
          bubbleHeight,
          bubblePadding,
          boundingRect,
          top,
          left,
          targetEl = document.getElementById(step.targetId),
          el = this.element;

      bubbleWidth = utils.getPixelValue(step.width) || opt.bubbleWidth;
      bubblePadding = utils.getValOrDefault(step.padding, opt.bubblePadding);

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
        left = boundingRect.left - bubbleWidth - 2*bubblePadding - opt.arrowWidth;
      }
      else if (step.orientation === 'right') {
        top = boundingRect.top;
        left = boundingRect.right + opt.arrowWidth;
      }

      if (!step.arrowOffset) {
        this.arrowEl.style.top = '';
        this.arrowEl.style.left = '';
      }
      else if (step.orientation === 'top' || step.orientation === 'bottom') {
        this.arrowEl.style.left = step.arrowOffset + 'px';
      }
      else if (step.orientation === 'left' || step.orientation === 'right') {
        this.arrowEl.style.top = step.arrowOffset + 'px';
      }

      // SET OFFSETS
      if (step.xOffset) {
        left += utils.getPixelValue(step.xOffset);
      }
      if (step.yOffset) {
        top += utils.getPixelValue(step.yOffset);
      }

      // ADJUST TOP FOR SCROLL POSITION
      top += utils.getScrollTop();
      left += utils.getScrollLeft();

      if (!hasCssTransitions && hasJquery && opt.animate) {
        $(el).animate({
          top: top + 'px',
          left: left + 'px'
        });
      }
      else { // hasCssTransitions || !hasJquery || !opt.animate
        el.style.top = top + 'px';
        el.style.left = left + 'px';
      }
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

    this.init();
  };

  Hopscotch = function(initOptions) {
    var bubble,
        opt,
        currTour,
        currStep,
        cookieTourId,
        cookieTourStep,

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
      return currTour.steps[currStepNum];
    },

    /**
     * adjustWindowScroll
     * ==================
     * Checks if the bubble or target element is partially or completely
     * outside of the viewport. If it is, adjust the window scroll position
     * to bring it back into the viewport.
     */
    adjustWindowScroll = function() {
      var bubbleEl       = getBubble().element,
          bubbleTop      = utils.getPixelValue(bubbleEl.style.top),
          bubbleBottom   = bubbleTop + utils.getPixelValue(bubbleEl.offsetHeight),
          targetEl       = document.getElementById(getCurrStep().targetId),
          targetBounds   = targetEl.getBoundingClientRect(),
          targetElTop    = targetBounds.top + utils.getScrollTop(),
          targetElBottom = targetBounds.bottom + utils.getScrollTop(),
          targetTop      = (bubbleTop < targetElTop) ? bubbleTop : targetElTop, // target whichever is higher
          targetBottom   = (bubbleBottom > targetElBottom) ? bubbleBottom : targetElBottom, // whichever is lower
          windowTop      = utils.getScrollTop(),
          windowBottom   = windowTop + utils.getWindowHeight(),
          scrollToVal    = targetTop - 50, // This is our final target scroll value.
          scrollEl,
          yuiAnim,
          yuiEase,
          direction,
          scrollIncr,
          scrollInt;

      // Leverage jQuery if it's present for scrolling
      if (hasJquery) {
        $('body, html').animate({ scrollTop: scrollToVal }, opt.scrollDuration);
        return;
      }
      else if (typeof YAHOO             !== 'undefined' &&
               typeof YAHOO.env         !== 'undefined' &&
               typeof YAHOO.env.ua      !== 'undefined' &&
               typeof YAHOO.util        !== 'undefined' &&
               typeof YAHOO.util.Scroll !== 'undefined') {
        scrollEl = YAHOO.env.ua.webkit ? document.body : document.documentElement;
        yuiEase = YAHOO.util.Easing ? YAHOO.util.Easing.easeOut : undefined;
        yuiAnim = new YAHOO.util.Scroll(scrollEl, {
          scroll: { to: [0, scrollToVal] }
        }, opt.scrollDuration/1000, yuiEase);
        yuiAnim.animate();
        return;
      }

      if (scrollToVal < 0) {
        scrollToVal = 0;
      }

      if (targetTop >= windowTop && targetTop <= windowTop + 50) {
        return;
      }

      if (targetTop < windowTop || targetBottom > windowBottom) {
        if (opt.smoothScroll) {
          // 48 * 10 == 480ms scroll duration
          // make it slightly less than CSS transition duration because of
          // setInterval overhead.
          // To increase or decrease duration, change the divisor of scrollIncr.
          direction = (windowTop > targetTop) ? -1 : 1; // -1 means scrolling up, 1 means down
          scrollIncr = Math.abs(windowTop - targetTop) / (opt.scrollDuration/10);
          scrollInt = setInterval(function() {
            var scrollTop = utils.getScrollTop(),
                scrollTarget = scrollTop + (direction * scrollIncr);

            if ((direction > 0 && scrollTarget >= scrollToVal) ||
                direction < 0 && scrollTarget <= scrollToVal) {
              // Overshot our target. Just manually set to equal the target
              // and clear the interval
              scrollTarget = scrollToVal;
              clearInterval(scrollInt);
            }

            window.scrollTo(0, scrollTarget);

            if (utils.getScrollTop() === scrollTop) {
              // Couldn't scroll any further. Clear interval.
              clearInterval(scrollInt);
            }
          }, 10);
        }
        else {
          window.scrollTo(0, scrollToVal);
        }
      }
    };

    this.init = function() {
      var tourState,
          tourPair;

      if (initOptions) {
        this.configure(initOptions);
      }

      tourState = utils.readCookie('hopscotch.tour.next');
      if (tourState) {
        tourPair      = tourState.split(':');
        cookieTourId   = tourPair[0]; // selecting tour is not supported by this framework.
        cookieTourStep = parseInt(tourPair[1], 10);
        if (tourPair.length > 2 && tourPair[2] === 'mp') {
          // multipage... increment tour step by 1
          ++cookieTourStep;
        }
      }
    };

    /**
     * loadTour
     * ========
     * Loads, but does not display, tour. (Give the developer a chance to
     * override tour-specified configuration options before displaying)
     */
    this.loadTour = function(tour) {
      var tmpOpt = {},
          bubble;
      currTour = tour;

      // Set tour-specific configurations
      for (prop in tour) {
        if (tour.hasOwnProperty(prop) &&
            prop !== 'id' &&
            prop !== 'steps') {
          tmpOpt[prop] = tour[prop];
        }
      }
      this.configure(tmpOpt);

      // Initialize whether to show or hide nav buttons
      bubble = getBubble();
      bubble.showPrevButton(opt.showPrevButton, true);
      bubble.showNextButton(opt.showNextButton, true);
    };

    /*
    this.getTourById = function(id) {
      var i, len;
      for (i=0, len=this._tours.length; i<len; ++i) {
        if (this._tours[i].id === id) {
          return this._tours[i];
        }
      }
    };
    */

    this.startTour = function() {
      var bubble;
      if (!currTour) {
        throw "Need to load a tour before you start it!";
      }

      // Check if we are resuming state.
      if (currTour.id === cookieTourId && typeof cookieTourStep !== 'undefined') {
        currStepNum = cookieTourStep;
        if (!document.getElementById(currTour.steps[currStepNum].targetId)) {
          // May have just refreshed the page. Previous step should work. (but don't change cookie)
          --currStepNum;
        }
      }
      else {
        currStepNum = 0;
      }

      this.showStep(currStepNum);
      bubble = getBubble().show();

      if (opt.animate) {
        bubble.initAnimate();
      }
      this.isActive = true;
    };

    this.showStep = function(stepIdx) {
      var step         = currTour.steps[stepIdx],
          numTourSteps = currTour.steps.length,
          btnToHide    = null,
          cookieVal    = currTour.id + ':' + stepIdx;

      if (!currTour) {
        throw "No tour currently selected!";
      }

      // Update bubble for current step
      currStepNum = stepIdx;
      getBubble().renderStep(step, stepIdx, (stepIdx === numTourSteps - 1), adjustWindowScroll);

      if (step.multiPage) {
        cookieVal += ':mp';
      }
      utils.createCookie('hopscotch.tour.next', cookieVal, 7);
    };

    this.prevStep = function() {
      if (currStepNum > 0) {
        this.showStep(--currStepNum);
      }
    };

    this.nextStep = function() {
      if (currStepNum < currTour.steps.length-1) {
        this.showStep(++currStepNum);
      }
    };

    /**
     * endTour
     * ==========
     * Cancels out of an active tour. No state is preserved.
     */
    this.endTour = function() {
      getBubble().hide();
      currStepNum = cookieTourStep = 0;
      utils.eraseCookie('hopscotch.tour.next');
      this.isActive = false;
    };

    /**
     * configure
     * =========
     * VALID OPTIONS INCLUDE...
     * bubbleWidth:     Number  - Default bubble width. Defaults to 280.
     * bubblePadding:   Number  - Default bubble padding. Defaults to 10.
     * animate:         Boolean - should the tour bubble animate between steps?
     *                            Defaults to FALSE.
     * smoothScroll:    Boolean - should the page scroll smoothly to the next
     *                            step? Defaults to TRUE.
     * scrollDuration:  Number  - Duration of page scroll. Only relevant when
     *                            smoothScroll is set to true. Defaults to 1000ms.
     * showCloseButton: Boolean - should the tour bubble show a close (X) button?
     *                            Defaults to TRUE.
     * showPrevButton:  Boolean - should the bubble have the Previous button?
     *                            Defaults to FALSE.
     * showNextButton:  Boolean - should the bubble have the Next button?
     *                            Defaults to TRUE.
     * arrowWidth:      Number  - Default arrow width. (space between the bubble
     *                            and the targetEl) Need to provide the option to
     *                            set this here in case developer wants to use own
     *                            CSS. Defaults to 20.
     */
    this.configure = function(options) {
      if (!opt) {
        opt = {};
      }
      utils.extend(opt, options);
      opt.animate         = utils.getValOrDefault(opt.animate, false);
      opt.smoothScroll    = utils.getValOrDefault(opt.smoothScroll, true);
      opt.scrollDuration  = utils.getValOrDefault(opt.scrollDuration, 1000);
      opt.showCloseButton = utils.getValOrDefault(opt.showCloseButton, true);
      opt.bubbleWidth     = utils.getValOrDefault(opt.bubbleWidth, 280);
      opt.bubblePadding   = utils.getValOrDefault(opt.bubblePadding, 10);
      opt.showPrevButton  = utils.getValOrDefault(opt.showPrevButton, false);
      opt.showNextButton  = utils.getValOrDefault(opt.showNextButton, true);
      opt.arrowWidth      = utils.getValOrDefault(opt.arrowWidth, 20);
    };

    this.init(initOptions);

    // DEBUG
    // =====
    // REMOVE THIS LATER!!!
    this.clearCookie = function() {
      utils.eraseCookie('hopscotch.tour.next');
    };
  };

  window.hopscotch = new Hopscotch();
}());
