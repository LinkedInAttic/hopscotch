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
var utils = {
  /**
   * addClass
   * ========
   * Adds one or more classes to a DOM element.
   *
   * @private
   */
  addClass: function(domEl, classToAdd) {
    var domClasses,
        classToAddArr,
        setClass,
        i,
        len;

    if (!domEl.className) {
      domEl.className = classToAdd;
    }
    else {
      classToAddArr = classToAdd.split(/\s+/);
      domClasses = ' ' + domEl.className + ' ';
      for (i = 0, len = classToAddArr.length; i < len; ++i) {
        if (domClasses.indexOf(' ' + classToAddArr[i] + ' ') < 0) {
          domClasses += classToAddArr[i] + ' ';
        }
      }
      domEl.className = domClasses.replace(/^\s+|\s+$/g,'');
    }
  },

  /**
   * removeClass
   * ===========
   * Remove one or more classes from a DOM element.
   *
   * @private
   */
  removeClass: function(domEl, classToRemove) {
    var domClasses,
        classToRemoveArr,
        currClass,
        i,
        len;

    classToRemoveArr = classToRemove.split(/\s+/);
    domClasses = ' ' + domEl.className + ' ';
    for (i = 0, len = classToRemoveArr.length; i < len; ++i) {
      domClasses = domClasses.replace(' ' + classToRemoveArr[i] + ' ', ' ');
    }
    domEl.className = domClasses.replace(/^\s+|\s+$/g,'');
  },

  /**
   * hasClass
   * ========
   * Determine if a given DOM element has a class.
   */
  hasClass: function(domEl, classToCheck){
    var classes;

    if(!domEl.className){ return false; }
    classes = ' ' + domEl.className + ' ';
    return (classes.indexOf(' ' + classToCheck + ' ') !== -1);
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
        return fn.apply(this, arr.slice(1));
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
        return utils.invokeCallbackArrayHelper(arr);
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
      return cb();
    }
    if (typeof cb === 'string' && helpers[cb]) { // name of a helper
      return helpers[cb]();
    }
    else { // assuming array
      return utils.invokeCallbackArray(cb);
    }
  },

  /**
   * If stepCb (the step-specific helper callback) is passed in, then invoke
   * it first. Then invoke tour-wide helper.
   *
   * @private
   */
  invokeEventCallbacks: function(evtType, stepCb) {
    var cbArr = callbacks[evtType],
        callback,
        fn,
        i,
        len;

    if (stepCb) {
      return this.invokeCallback(stepCb);
    }

    for (i=0, len=cbArr.length; i<len; ++i) {
      this.invokeCallback(cbArr[i].cb);
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
  addEvtListener: function(el, evtName, fn) {
    if(el) {
      return el.addEventListener ? el.addEventListener(evtName, fn, false) : el.attachEvent('on' + evtName, fn);
    }
  },

  /**
   * @private
   */
  removeEvtListener: function(el, evtName, fn) {
    if(el) {
      return el.removeEventListener ? el.removeEventListener(evtName, fn, false) : el.detachEvent('on' + evtName, fn);
    }
  },

  documentIsReady: function() {
    return document.readyState === 'complete';
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
   * Helper function to get a single target DOM element. We will try to
   * locate the DOM element through several ways, in the following order:
   *
   * 1) Passing the string into document.querySelector
   * 2) Passing the string to jQuery, if it exists
   * 3) Passing the string to Sizzle, if it exists
   * 4) Calling document.getElementById if it is a plain id
   *
   * Default case is to assume the string is a plain id and call
   * document.getElementById on it.
   *
   * @private
   */
  getStepTargetHelper: function(target){
    var result = document.getElementById(target);

    //Backwards compatibility: assume the string is an id
    if (result) {
      return result;
    }
    if (hasJquery) {
      result = jQuery(target);
      return result.length ? result[0] : null;
    }
    if (Sizzle) {
      result = new Sizzle(target);
      return result.length ? result[0] : null;
    }
    if (document.querySelector) {
      try {
        return document.querySelector(target);
      } catch (err) {}
    }
    // Regex test for id. Following the HTML 4 spec for valid id formats.
    // (http://www.w3.org/TR/html4/types.html#type-id)
    if (/^#[a-zA-Z][\w-_:.]*$/.test(target)) {
      return document.getElementById(target.substring(1));
    }

    return null;
  },

  /**
   * Given a step, returns the target DOM element associated with it. It is
   * recommended to only assign one target per step. However, there are
   * some use cases which require multiple step targets to be supplied. In
   * this event, we will use the first target in the array that we can
   * locate on the page. See the comments for getStepTargetHelper for more
   * information.
   *
   * @private
   */
  getStepTarget: function(step) {
    var queriedTarget;

    if (!step || !step.target) {
      return null;
    }

    if (typeof step.target === 'string') {
      //Just one target to test. Check and return its results.
      return utils.getStepTargetHelper(step.target);
    }
    else if (Array.isArray(step.target)) {
      // Multiple items to check. Check each and return the first success.
      // Assuming they are all strings.
      var i,
          len;

      for (i = 0, len = step.target.length; i < len; i++){
        if (typeof step.target[i] === 'string') {
          queriedTarget = utils.getStepTargetHelper(step.target[i]);

          if (queriedTarget) {
            return queriedTarget;
          }
        }
      }
      return null;
    }

    // Assume that the step.target is a DOM element
    return step.target;
  },

  /**
   * Convenience method for getting an i18n string. Returns custom i18n value
   * or the default i18n value if no custom value exists.
   *
   * @private
   */
  getI18NString: function(key) {
    return customI18N[key] || HopscotchI18N[key];
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

    if (hasSessionStorage && isStorageWritable) {
      try{
        sessionStorage.setItem(name, value);
      }
      catch(err){
        isStorageWritable = false;
        this.setState(name, value, days);
      }
    }
    else {
      if(hasSessionStorage){
        //Clear out existing sessionStorage key so the new value we set to cookie gets read.
        //(If we're here, we've run into an error while trying to write to sessionStorage).
        sessionStorage.removeItem(name);
      }
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

    //return value from session storage if we have it
    if (hasSessionStorage) {
      state = sessionStorage.getItem(name);
      if(state){
        return state;
      }
    }

    //else, try cookies
    for(i=0;i < ca.length;i++) {
      c = ca[i];
      while (c.charAt(0)===' ') {c = c.substring(1,c.length);}
      if (c.indexOf(nameEQ) === 0) {
        state = c.substring(nameEQ.length,c.length);
        break;
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
  },

  /**
   * Originally called it orientation, but placement is more intuitive.
   * Allowing both for now for backwards compatibility.
   * @private
   */
  normalizePlacement: function(step) {
    if (!step.placement && step.orientation) {
      step.placement = step.orientation;
    }
  },

  /**
   * If step is right-to-left enabled, flip the placement and xOffset, but only once.
   * @private
   */
  flipPlacement: function(step){
    if(step.isRtl && !step._isFlipped){
      var props = ['orientation', 'placement'], prop, i;
      if(step.xOffset){
        step.xOffset = -1 * this.getPixelValue(step.xOffset);
      }
      for(i in props){
        prop = props[i];
        if(step.hasOwnProperty(prop) && rtlMatches.hasOwnProperty(step[prop])) {
          step[prop] = rtlMatches[step[prop]];
        }
      }
      step._isFlipped = true;
    }
  }
};