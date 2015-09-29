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
 * Private function to get a single target DOM element. We will try to
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
function getElement(element) {
  let result = document.getElementById(element);

  //Backwards compatibility: assume the string is an id
  if (result) {
    return result;
  }
  if (typeof jQuery !== 'undefined') {
    result = jQuery(element);
    return result.length ? result[0] : null;
  }
  if (typeof Sizzle !== 'undefined') {
    result = new Sizzle(element);
    return result.length ? result[0] : null;
  }
  if (document.querySelector) {
    try {
      return document.querySelector(element);
    } catch (err) { }
  }
  // Regex test for id. Following the HTML 4 spec for valid id formats.
  // (http://www.w3.org/TR/html4/types.html#type-id)
  if (/^#[a-zA-Z][\w-_:.]*$/.test(element)) {
    return document.getElementById(element.substring(1));
  }

  return null;
}

/**
 * Given a step, returns the target DOM element associated with it. It is
 * recommended to only assign one target per  However, there are
 * some use cases which require multiple step targets to be supplied. In
 * this event, we will use the first target in the array that we can
 * locate on the page. See the comments for getElement for more
 * information.
 *
 */
export function getTargetEl(target) {
  let queriedTarget;

  if (!target) {
    return null;
  }

  if (typeof target === 'string') {
    //Just one target to test. Check and return its results.
    return getElement(target);
  }
  else if (Array.isArray(target)) {
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
