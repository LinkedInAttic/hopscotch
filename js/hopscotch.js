/**
 *
 * Thoughts:
 * =========
 *
 * support > 1 bubble at a time? gahhhhhhhhh
 * offset for steps, to allow for manual position correction
 *
 * TODO:
 * =====
 * event listener for window resize? (to reposition bubble);
 * test css conflicts on different sites
 * improve auto-scrolling?
 *
 */

(function() {
  var Hopscotch,
      HopscotchBubble,
      utils,
      context             = (typeof window !== 'undefined') ? window : exports,
      hasAddEventListener = typeof document.body.addEventListener !== 'undefined',
      hasJquery           = (typeof jQuery !== 'undefined');

  if (context.hopscotch) {
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

    removeClass: function(domEl, classToRemove) {
      var domClasses = domEl.className.split(' '),
          i, len;

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
        case 'number':
          return val;
        default:
          throw 'Invalid pixel value: ' + typeof val + '!';
      }
    },

    getValueOrDefault: function(val, valDefault) {
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
    }
  };

  HopscotchBubble = function(opt) {
    var createButton = function(id, text) {
      var btnEl = document.createElement('input');
      btnEl.setAttribute('id', id);
      btnEl.setAttribute('type', 'button');
      btnEl.setAttribute('value', text);
      utils.addClass(btnEl, 'hopscotch-nav-button');
      return btnEl;
    },

    /**
     * adjustWindowScroll
     * ==================
     * Checks if the bubble or target element is partially or completely
     * outside of the viewport. If it is, adjust the window scroll position
     * to bring it back into the viewport.
     */
    adjustWindowScroll = function(el, boundingRect) {
      var bubbleTop    = utils.getPixelValue(el.style.top),
          bubbleBottom = bubbleTop + el.offsetHeight,
          windowTop    = utils.getScrollTop(),
          windowBottom = windowTop + utils.getWindowHeight(),
          endScrollVal = bubbleTop - 50,
          direction    = (windowTop > bubbleTop) ? -1 : 1, // -1 means scrolling up, 1 means down
          scrollIncr   = Math.abs(windowTop - bubbleTop) / 45,
          scrollInt;

      if (endScrollVal < 0) {
        endScrollVal = 0;
      }

      if (bubbleTop < windowTop || bubbleBottom > windowBottom) {
        // 45 * 10 == 450ms scroll duration
        // make it slightly less than CSS transition duration because of
        // setInterval overhead.
        // To increase or decrease duration, change the divisor of scrollIncr.
        scrollInt = setInterval(function() {
          var scrollTop = utils.getScrollTop(),
              scrollTarget = scrollTop + (direction * scrollIncr);

          if ((direction > 0 && scrollTarget >= endScrollVal)
              || direction < 0 && scrollTarget <= endScrollVal) {
            // Overshot our target. Just manually set to equal the target
            // and clear the interval
            scrollTarget = endScrollVal;
            clearInterval(scrollInt);
          }

          window.scrollTo(0, scrollTarget);

          if (utils.getScrollTop() === scrollTop) {
            // Couldn't scroll any further. Clear interval.
            clearInterval(scrollInt);
          }
        }, 10);
      }
    };

    this.init = function() {
      var el           = document.createElement('div');

      this.element     = el;
      this.containerEl = document.createElement('div');
      this.titleEl     = document.createElement('h3');
      this.contentEl   = document.createElement('p');

      el.setAttribute('id', 'hopscotch-bubble');
      this.containerEl.setAttribute('id', 'hopscotch-bubble-container');
      this.containerEl.appendChild(this.titleEl);
      this.containerEl.appendChild(this.contentEl);
      el.appendChild(this.containerEl);

      if (this.showNavButtons) {
        this.initNavButtons();
      }

      if (this.showCloseButton) {
        this.initCloseButton();
      }

      document.body.appendChild(el);
      return this;
    };

    this.initNavButtons = function() {
      var buttonsEl  = document.createElement('div');

      this.prevBtnEl = createButton('hopscotch-prev', 'Prev');
      this.nextBtnEl = createButton('hopscotch-next', 'Next');

      buttonsEl.setAttribute('id', 'hopscotch-actions');
      buttonsEl.appendChild(this.prevBtnEl);
      buttonsEl.appendChild(this.nextBtnEl);
      this.buttonsEl = buttonsEl;

      utils.addClickListener(this.prevBtnEl, function(evt) {
        context.hopscotch.prevStep();
      });
      utils.addClickListener(this.nextBtnEl, function(evt) {
        context.hopscotch.nextStep();
      });

      this.containerEl.appendChild(buttonsEl);
      return this;
    };

    this.initCloseButton = function() {
      var closeBtnEl = document.createElement('a'),
          self = this;

      closeBtnEl.setAttribute('id', 'hopscotch-bubble-close');
      closeBtnEl.setAttribute('href', '#');
      closeBtnEl.innerHTML = 'x';

      utils.addClickListener(closeBtnEl, function(evt) {
        context.hopscotch.cancelTour();
        utils.evtPreventDefault(evt);
      });

      this.containerEl.appendChild(closeBtnEl);
      return this;
    };

    this.renderStep = function(step, btnToHide) {
      var self = this;
      if (step.title) { this.setTitle(step.title); }
      if (step.content) { this.setContent(step.content); }

      utils.removeClass(this.prevBtnEl, 'hide');
      utils.removeClass(this.nextBtnEl, 'hide');
      if (btnToHide === 'prev') {
        utils.addClass(this.prevBtnEl, 'hide');
      }
      else if (btnToHide === 'next') {
        utils.addClass(this.nextBtnEl, 'hide');
      }

      // Timeout to get correct height of bubble.
      setTimeout(function() {
        self.setPosition(step);
      }, 10);
      return this;
    };

    this.setTitle = function(titleStr) {
      if (titleStr) {
        this.titleEl.textContent = titleStr;
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

    this.show = function() {
      utils.removeClass(this.element, 'hide');
      return this;
    };

    this.hide = function() {
      utils.addClass(this.element, 'hide');
      return this;
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

      bubbleWidth = utils.getPixelValue(step.width) || this.defaultWidth;
      bubblePadding = utils.getValueOrDefault(step.padding, 10);

      // SET POSITION
      boundingRect = targetEl.getBoundingClientRect();
      if (step.orientation === 'top') {
        bubbleHeight = el.offsetHeight;
        top = (boundingRect.top - bubbleHeight);
        left = boundingRect.left;
      }
      else if (step.orientation === 'bottom') {
        top = boundingRect.bottom;
        left = boundingRect.left;
      }
      else if (step.orientation === 'left') {
        top = boundingRect.top;
        left = boundingRect.left - bubbleWidth - 2*bubblePadding;
      }
      else if (step.orientation === 'right') {
        top = boundingRect.top;
        left = boundingRect.right;
      }
      else {
        throw "Invalid bubble orientation: " + step.orientation + ". Valid orientations are: top, bottom, left, right.";
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

      el.style.top = top + 'px';
      el.style.left = left + 'px';
      this.containerEl.style.width = bubbleWidth + 'px';
      this.containerEl.style.padding = bubblePadding + 'px';

      adjustWindowScroll(this.element, boundingRect);
    };

    /**
     * initAnimate
     * ===========
     * This function exists due to how Chrome handles CSS transitions. Most
     * other browsers will not animate a transition until the element exists
     * on the page. Chrome treats DOM elements as starting from the (0, 0)
     * position, and will animate from the upper left corner on creation of
     * the DOM element. (e.g., if you create a new DOM element using
     * Javascript and specify CSS top: 100px, left: 50px, then append the
     * DOM element to the document.body, it will create it at 0, 0 and then
     * animate it to 50, 100)
     *
     * Solution is to add the animate class (which defines our transition)
     * only after the element is created.
     */
    this.initAnimate = function() {
      utils.addClass(this.element, 'animate');
    };

    this.defaultWidth = utils.getValueOrDefault(opt.bubbleWidth, 280);
    this.defaultPadding = utils.getValueOrDefault(opt.bubblePadding, 20);
    this.showCloseButton = typeof opt.showCloseButton !== 'undefined' ? opt.showCloseButton : true;
    this.showNavButtons = opt.showNavButtons;

    this.init();
  };

  Hopscotch = function() {
    var bubble,
        opt,

    /**
     * getBubble
     * ==========
     * Retrieves the "singleton" bubble div or creates it
     * if it doesn't exist yet.
     */
    getBubble = function() {
      if (!bubble) {
        bubble = new HopscotchBubble(opt);
      }

      return bubble;
    };

    // PUBLIC METHODS
    /**
     * loadTours
     * =========
     * Accepts an array of tours defined as JSON objects.
     */
    this.loadTours = function(tours) {
      this._tours = tours;
    };

    this.getTourById = function(id) {
      var i, len;
      for (i=0, len=this._tours.length; i<len; ++i) {
        if (this._tours[i].id === id) {
          return this._tours[i];
        }
      }
    };

    this.startTour = function(tour) {
      var self = this;
      this._currTour = tour;
      this.currStepIdx = 0;
      this.showStep(this.currStepIdx);
      if (opt.animate) {
        setTimeout(function() {
          getBubble().show().initAnimate();
        }, 50);
      }
    };

    this.showStep = function(stepIdx) {
      var step = this._currTour.steps[stepIdx],
          numTourSteps = this._currTour.steps.length,
          btnToHide = null;

      if (!this._currTour) {
        throw "No tour currently selected!";
      }

      // Update bubble for current step
      this.currStepIdx = stepIdx;
      if (stepIdx === 0) {
        btnToHide = 'prev';
      }
      else if (stepIdx === numTourSteps - 1) {
        btnToHide = 'next';
      }
      getBubble().renderStep(step, btnToHide);
    };

    this.prevStep = function() {
      if (this.currStepIdx <= 0) {
        // TODO: all done!
        alert('at the first step. can\'t go back any further.');
      }
      else {
        this.showStep(--this.currStepIdx);
      }
    };

    this.nextStep = function() {
      if (!this._currTour) {
        throw "No tour was selected prior to calling nextStep!";
      }
      if (this.currStepIdx >= this._currTour.steps.length-1) {
        // TODO: all done!
        alert('all done!');
      }
      else {
        this.showStep(++this.currStepIdx);
      }
    };

    /**
     * cancelTour
     * ==========
     * Cancels out of an active tour. No state is preserved.
     */
    this.cancelTour = function() {
      if (this._currTour) {
        this._currTour = null;
      }
      this.currStepIdx = -1;
      getBubble().hide();
    };

    this.configure = function(options) {
      opt = options;
    };
  };

  context.hopscotch = new Hopscotch();
}());
