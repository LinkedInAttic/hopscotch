let validIdRegEx = /^[a-zA-Z]+[a-zA-Z0-9_-]*$/;

/**
 * Tests if a given callout ID is valid. Specifically, callout IDs
 * require the first character to be a letter and all following
 * characters to be alphanumeric, underscores, or dashes.
 *
 * @param {String} id - The ID to test.
 * @returns {Boolean} True if defined and valid, false otherwise.
 */
export function isIdValid(id) {
  return id && validIdRegEx.test(id);
}

/**
 * Get a numeric value from a number or string. Used for sanitizing
 * provided pixel values that could be expressed as a number
 * or as a string such as "10px".
 *
 * @param {Number|String} val - The value to parse.
 * @returns {Number} The parsed numeric value. If a value can't be
 *                   determined, this will return 0.
 */
export function getPixelValue(val) {
  let valType = typeof val;
  if (valType === 'number') {
    return val;
  }
  if (valType === 'string') {
    let result = parseInt(val, 10);
    return isNaN(result) ? 0 : result;
  }
  return 0;
}

/**
 * A function to get a single DOM element. Relies on document.querySelector,
 * but handles exceptions gracefully and returns null if element is not found
 * or exception is thrown
 * @private
 */
function getElement(element) {
  try {
    return document.querySelector(element);
  } catch (err) { }
  return null;
}

/**
 * Given a step, returns the target DOM element associated with it. It is
 * recommended to only assign one target per step. However, there are
 * some use cases which require multiple step targets to be supplied. In
 * this event, we will use the first target in the array that we can
 * locate on the page.
 * 
 * Param target is expected to be one of the following:
 *  1) String - a query selector string
 *  2) String [] - an array of query selector strings
 *  3) DOM Element - a target DOM element itself
 *
 * @param {String|String[]|Element} target - The element to target.
 * @returns {?Element} The matched element, or null if not found.
 */
export function getTargetEl(target) {
  if (!target) {
    return null;
  }

  if (typeof target === 'string') {
    //Just one target to test. Check and return its results.
    return getElement(target);
  } else if (Array.isArray(target)) {
    let queriedTarget;
    // Multiple items to check. Check each and return the first success.
    // Assuming they are all strings.
    for (let i = 0, len = target.length; i < len; i++) {
      if (typeof target[i] === 'string') {
        queriedTarget = getElement(target[i]);
        if (queriedTarget) {
          return queriedTarget;
        }
      }
    }
    return null;
  }

  // Assume that the target is a DOM element
  return target;
}

/**
 * Adds one or more classes to a DOM element.
 *
 * @param {Element} domEl        - The element to add the classes to.
 * @param {String} strClassNames - A comma-separated list of classes to add.
 */
export function addClass(domEl, strClassNames) {
  if (!domEl.className) {
    domEl.className = strClassNames;
  }
  else {
    let domClasses = ' ' + domEl.className + ' ';
    let arrClassNames = strClassNames.split(/\s+/);

    arrClassNames.forEach((className) => {
      if (domClasses.indexOf(' ' + className + ' ') < 0) {
        domClasses += className + ' ';
      }
    });
    domEl.className = domClasses.replace(/^\s+|\s+$/g, '');
  }
}

/**
 * Remove one or more classes from a DOM element.
 *
 * @param {Element} domEl                - The element to remove the classes from.
 * @param {String} strClassNamesToRemove - A comma-separated list of classes
 *                                         to remove.
 */
export function removeClass(domEl, strClassNamesToRemove) {
  let domClasses = ' ' + domEl.className + ' ';
  let arrClassesToRemove = strClassNamesToRemove.split(/\s+/);

  arrClassesToRemove.forEach((className) => {
    domClasses = domClasses.replace(' ' + className + ' ', ' ');
  });

  domEl.className = domClasses.replace(/^\s+|\s+$/g, '');
}

/**
 * Log error to the console
 *
 * @param {String} message - The message to log.
 */
export function logError(message) {
  if (typeof console !== 'undefined' && typeof console.error !== 'undefined') {
    console.error(message);
  }
}

/**
 * Shallow copy of obj2 into obj1
 * @private
 */
export function extend(obj1, obj2) {
  for (let prop in obj2) {
    if (obj2.hasOwnProperty(prop)) {
      obj1[prop] = obj2[prop];
    }
  }
  return obj1;
}

/**
 * Determines if el parameter of this function conforms for the DOM
 * API required by hopscotch
 */
export function isDOMElement(el) {
  if (!el || typeof el.getBoundingClientRect !== 'function') {
    return false;
  }
  let elBox = el.getBoundingClientRect();

  return typeof el.style === 'object' &&
    typeof elBox.right === 'number' &&
    typeof elBox.left === 'number' &&
    typeof elBox.top === 'number' &&
    typeof elBox.bottom === 'number' &&
    typeof elBox.height === 'number' &&
    typeof elBox.width === 'number';
}