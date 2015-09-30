let validIdRegEx = /^[a-zA-Z]+[a-zA-Z0-9_-]*$/;

export function isIdValid(id) {
  return id && validIdRegEx.test(id);
}

export function getPixelValue(val) {
  let valType = typeof val;
  if (valType === 'number') { return val; }
  if (valType === 'string') { return parseInt(val, 10); }
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
 * addClass
 * ========
 * Adds one or more classes to a DOM element.
 *
 * @private
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
 * removeClass
 * ===========
 * Remove one or more classes from a DOM element.
 *
 * @private
 */
export function removeClass(domEl, strClassNamesToRemove) {
  let domClasses = ' ' + domEl.className + ' ';
  let arrClassesToRemove = strClassNamesToRemove.split(/\s+/);

  arrClassesToRemove.forEach((className) => {
    domClasses = domClasses.replace(' ' + className + ' ', ' ');
  });

  domEl.className = domClasses.replace(/^\s+|\s+$/g, '');
}