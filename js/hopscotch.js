/**
 *
 * Thoughts:
 * =========
 *
 * Require jQuery only when browser is IE<8?
 * support > 1 bubble at a time?
 *
 * Feature ideas:
 * ==============
 * offset for steps, to allow for manual position correction
 *
 */

(function() {
  var HopscotchManager,
      HopscotchBubble,
      utils,
      context = typeof window !== 'undefined' ? window : exports,
      hasBoundingClientRect = typeof document.body.getBoundingClientRect !== 'undefined';

  if (context.hopscotchManager) {
    // Hopscotch Manager already exists.
    return;
  }

  utils = {
    addClass: function(domEl, classToAdd) {
      var domClasses,
          i, len, found = false;

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
          i, len, found = false;

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

    extractPixelValue: function(val) {
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
    }
  };

  HopscotchBubble = function(opt) {
    this.init = function() {
      this.element   = document.createElement('div');
      this.titleEl   = document.createElement('h3');
      this.contentEl = document.createElement('p');

      this.element.setAttribute('id', 'hopscotch-bubble');
      this.element.appendChild(this.titleEl);
      this.element.appendChild(this.contentEl);
      document.body.appendChild(this.element);
    };

    this.setTitle = function(titleStr) {
      if (titleStr) {
        this.titleEl.textContent = titleStr;
        utils.removeClass(this.titleEl, 'hide');
      }
      else {
        utils.addClass(this.titleEl, 'hide');
      }
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
    };

    this.hide = function() {
      utils.addClass(this.element, 'hide');
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
          targetElBoundBox,
          top,
          left,
          targetEl = document.querySelector(step.targetSelector),
          scrollPos = window.pageYOffset,
          el = this.element;

      bubbleWidth = utils.extractPixelValue(step.width) || this.defaultWidth;
      bubblePadding = utils.getValueOrDefault(step.padding, 10);

      if (typeof scrollPos === 'undefined') {
        // Most likely IE <=8, which doesn't support pageYOffset
        scrollPos = document.documentElement.scrollTop;
      }
      if (hasBoundingClientRect) {
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
      }

      if (step.xOffset) {
        left += utils.extractPixelValue(step.xOffset);
      }
      if (step.yOffset) {
        top += utils.extractPixelValue(step.yOffset);
      }

      top += scrollPos; // adjust for scroll

      el.style.top = top + 'px';
      el.style.left = left + 'px';
      el.style.width = bubbleWidth + 'px';
      el.style.padding = bubblePadding + 'px';
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
      if (this.animate) {
        utils.addClass(this.element, 'animate');
      }
    };

    this.defaultWidth = utils.getValueOrDefault(opt.bubbleWidth, 280);
    this.defaultPadding = utils.getValueOrDefault(opt.bubblePadding, 20);
    this.animate = opt.animate;

    this.init();
  };

  HopscotchManager = function() {};
  HopscotchManager.prototype = {

    getInstance: function() {

      if (!this._hopscotchInstance) {
        this._hopscotchInstance = {
          // PUBLIC METHODS
          /**
           * loadTours
           * =========
           * Accepts an array of tours defined as JSON objects.
           */
          loadTours: function(tours) {
            this._tours = tours;
          },

          getTourById: function(id) {
            var i, len, tour;
            for (i=0, len=this._tours.length; i<len; ++i) {
              if (this._tours[i].id === id) {
                return this._tours[i];
              }
            }
          },

          startTour: function(tour) {
            var self = this;
            this._currTour = tour;
            this.currStep = 0;
            this.showStep(this.currStep);
            setTimeout(function() {
              self._getBubble().initAnimate();
            }, 50);
          },

          showStep: function(stepIdx) {
            var step,
                targetEl,
                targetElBoundBox,
                bubbleEl;

            if (!this._currTour) {
              throw "No tour currently selected!";
            }

            step = this._currTour.steps[stepIdx];
            bubble = this._getBubble();

            // Update bubble for current step
            bubble.setTitle(step.title);
            bubble.setContent(step.content);
            setTimeout(function() {
              bubble.setPosition(step);
            }, 10);
          },

          prevStep: function() {
            if (this.currStep <= 0) {
              // TODO: all done!
              alert('at the first step. can\'t go back any further.');
            }
            else {
              this.showStep(--this.currStep);
            }
          },

          nextStep: function() {
            if (!this._currTour) {
              throw "No tour was selected prior to calling nextStep!";
            }
            if (this.currStep >= this._currTour.steps.length-1) {
              // TODO: all done!
              alert('all done!');
            }
            else {
              this.showStep(++this.currStep);
            }
          },

          setOptions: function(opt) {
            this._opt = opt;
          },

          // PRIVATE METHODS
          /**
           * _getBubble
           * ==========
           * Retrieves the "singleton" bubble div or creates it
           * if it doesn't exist yet.
           */
          _getBubble: function() {
            if (!this._bubble) {
              this._bubble = new HopscotchBubble(this._opt);
            }

            return this._bubble;
          },
        };
      }
      return this._hopscotchInstance;
    }

  };

  context.hopscotchManager = new HopscotchManager();
}());
