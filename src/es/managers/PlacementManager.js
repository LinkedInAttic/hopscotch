import * as Utils from '../modules/utils.js';

/* PUBLIC INTERFACE AND EXPORT STATEMENT FOR THIS MODULE */

/**
  PlacementManager handles evertyhing related to callout positioning,
  including arrow position, placement of the callout, respositioning of the callout
  for responsive designs, etc.
*/
export default class PlacementManager {
  /**
   * Sets the callout's position on the page, using the configuration state
   * of the callout provided.
   *
   * @param {Callout} callout - The callout to place.
   */
  static setCalloutPosition(callout) {
    //make sure that placement is set to a valid value
    let placementStrategy = placementStrategies[callout.config.get('placement')];
    if (!placementStrategy) {
      throw new Error('Bubble placement failed because placement is invalid or undefined!');
    }

    //if callout is RTL enabled we need to adjust
    //placement and xOffset values
    placementStrategy = adjustPlacementForRtl(callout, placementStrategy);

    //update callout's arrow to point
    //in the direction of the target element
    positionArrow(callout, placementStrategy);

    //adjust position of the callout element
    //to be placed next to the target 
    positionCallout(callout, placementStrategy);
  }
}

/* END PUBLIC INTERFACE AND EXPORT STATEMENT FOR THIS MODULE */
/* PRIVATE FUNCTIONS AND VARIABLES FOR THIS MODULE */

function setArrowPositionVertical(arrowEl, calloutEl, horizontalProp, arrowOffset) {
  if (arrowOffset == 'center') {
    //reset to baseline, so we can accurately calculate border width
    arrowEl.style[horizontalProp] = '0px';

    let calloutElBox = calloutEl.getBoundingClientRect();
    let arrowElBox = arrowEl.getBoundingClientRect();
    let calloutBorderWidth = Math.abs(arrowElBox[horizontalProp] - calloutElBox[horizontalProp]);
    arrowEl.style[horizontalProp] = Math.floor((calloutEl.offsetWidth / 2) - (arrowEl.offsetWidth / 2) - calloutBorderWidth) + 'px';
  } else {
    //getPixelValue will return 0 if value is not a number
    arrowEl.style[horizontalProp] = Utils.getPixelValue(arrowOffset) + 'px';
  }
}

function setArrowPositionHorizontal(arrowEl, calloutEl, horizontalProp, arrowOffset) {
  if (arrowOffset == 'center') {
    //reset to baseline, so we can accurately calculate border width
    arrowEl.style.top = '0px';

    let calloutElBox = calloutEl.getBoundingClientRect();
    let arrowElBox = arrowEl.getBoundingClientRect();
    let calloutBorderWidth = Math.abs(arrowElBox.top - calloutElBox.top);
    arrowEl.style.top = Math.floor((calloutEl.offsetHeight / 2) - (arrowEl.offsetHeight / 2) - calloutBorderWidth) + 'px';
  } else {
    arrowEl.style.top = Utils.getPixelValue(arrowOffset) + 'px';
  }
}

let placementStrategies = {
  'top': {
    arrowPlacement: 'down',
    calculateCalloutPosition(targetElBox, calloutElBox, arrowElBox, isRtl) {
      let verticalLeftPosition = isRtl ? targetElBox.right - calloutElBox.width : targetElBox.left;
      let top = (targetElBox.top - calloutElBox.height) - arrowElBox.height;
      let left = verticalLeftPosition;
      return { top, left };
    },
    setArrowPosition: setArrowPositionVertical
  },
  'bottom': {
    arrowPlacement: 'up',
    calculateCalloutPosition(targetElBox, calloutElBox, arrowElBox, isRtl) {
      let verticalLeftPosition = isRtl ? targetElBox.right - calloutElBox.width : targetElBox.left;
      let top = targetElBox.bottom + arrowElBox.height;
      let left = verticalLeftPosition;
      return { top, left };
    },
    setArrowPosition: setArrowPositionVertical
  },
  'left': {
    arrowPlacement: 'right',
    rtlPlacement: 'right',
    calculateCalloutPosition(targetElBox, calloutElBox, arrowElBox, isRtl) {
      let top = targetElBox.top;
      let left = targetElBox.left - calloutElBox.width - arrowElBox.width;
      return { top, left };
    },
    setArrowPosition: setArrowPositionHorizontal
  },
  'right': {
    arrowPlacement: 'left',
    rtlPlacement: 'left',
    calculateCalloutPosition(targetElBox, calloutElBox, arrowElBox, isRtl) {
      let top = targetElBox.top;
      let left = targetElBox.right + arrowElBox.width;
      return { top, left };
    },
    setArrowPosition: setArrowPositionHorizontal
  }
};

/**
  * If step is right-to-left enabled, flip the placement and xOffset.
  * Will adjust placement only once and will set _isFlippedForRtl option to keep track of this
  * If placement is set on a global or tour level and callout does not have this config
  * tour\global config will stay intact and new setting will be added into the callout's config
  * @private
  */
function adjustPlacementForRtl(callout, placementStrategy) {
  let isRtl = callout.config.get('isRtl');
  let isFlippedForRtl = callout.config.get('_isFlippedForRtl');

  if (isRtl && !isFlippedForRtl) {
    let calloutXOffset = callout.config.get('xOffset');
    let rtlPlacement = placementStrategy.rtlPlacement;

    //flip xOffset
    if (calloutXOffset && calloutXOffset !== 'center') {
      callout.config.set('xOffset', -1 * Utils.getPixelValue(calloutXOffset));
    }
    //flip placement for right and left placements only
    if (rtlPlacement) {
      callout.config.set('placement', rtlPlacement);
      placementStrategy = placementStrategies[rtlPlacement];
    }
  }
  return placementStrategy;
}

/**
  * Adds correct placement class to the callout's arrow element if it exists.
  * Arrow class will be determined based on Callout's 'placement' option.
  * @private
  */
function positionArrow(callout, placementStrategy) {
  let arrowEl = callout.el.querySelector('.hopscotch-arrow');
  if (!arrowEl) {
    return;
  }

  //Remove any stale position classes
  Utils.removeClass(arrowEl, 'down up right left');
  //Have arrow point in the direction of the target
  Utils.addClass(arrowEl, placementStrategy.arrowPlacement);

  //Position arrow correctly relative to the callout
  let arrowOffset = callout.config.get('arrowOffset');
  let horizontalProp = callout.config.get('isRtl') ? 'right' : 'left';
  placementStrategy.setArrowPosition(arrowEl, callout.el, horizontalProp, arrowOffset);
}

/**
 * This function sets callout's top and left coordinates as well as it's position (fixed vs absolute)
 * Top and left coordinates are calculated based on target element's position, page scroll as well
 * as xOffset and yOffset configuration options 
 */
function positionCallout(callout, placementStrategy) {
  //User can configure their own way of finding target element
  //via hopscotch.configure. For example jQuery
  // hopscotch.configure({
  //  getTarget: function(target){
  //    return jQUery(target);
  //  }
  // });
  //If not specified getTarget defaults to Utils.getTargetEl
  let getTarget = callout.config.get('getTarget');
  if (typeof getTarget !== 'function') {
    throw new Error('Can not find target element because \'getTarget\' is not a function');
  }

  let targetEl = getTarget(callout.config.get('target'));
  if (!targetEl) {
    throw new Error('Must specify an existing target element via \'target\' option.');
  }

  let isTargetFixed = isFixedElement(targetEl);
  let targetElBox = targetEl.getBoundingClientRect();
  let calloutElBox = callout.el.getBoundingClientRect();
  let arrowEl = callout.el.querySelector('.hopscotch-arrow');
  let arrowElBox = arrowEl.getBoundingClientRect();
  let calloutPosition = placementStrategy.calculateCalloutPosition(
    targetElBox,
    calloutElBox,
    arrowElBox,
    callout.config.get('isRtl')
    );
  
  //Adjust position if xOffset and yOffset are specified
  //horizontal offset
  let placement = callout.config.get('placement');
  let xOffset = callout.config.get('xOffset');
  if (xOffset === 'center') {
    if (placement === 'left' || placement === 'right') {
      Utils.logError('Can not use xOffset \'center\' with placement \'left\' or \'right\'. Callout will overlay the target.');
    } else {
      calloutPosition.left = Math.floor(targetElBox.left + targetEl.offsetWidth / 2) - Math.floor(calloutElBox.width / 2);
    }
  }
  else {
    calloutPosition.left += Utils.getPixelValue(xOffset);
  }
  //vertical offset
  let yOffset = callout.config.get('yOffset');
  if (yOffset === 'center') {
    if (placement === 'top' || placement === 'bottom') {
      Utils.logError('Can not use yOffset \'center\' with placement \'top\' or \'bottom\'. Callout will overlay the target.');
    } else {
      calloutPosition.top = Math.floor(targetElBox.top + targetEl.offsetHeight / 2) - Math.floor(calloutElBox.height / 2);
    }
  }
  else {
    calloutPosition.top += Utils.getPixelValue(yOffset);
  }

  // Adjust TOP for scroll position
  if (!isTargetFixed) {
    let scrollPosition = getScrollPosition();
    calloutPosition.top += scrollPosition.top;
    calloutPosition.left += scrollPosition.left;
  }

  //Set the position
  //If target element is fixed, callout needs to be fixed as well
  //Otherwise it should have absolute position
  callout.el.style.position = isTargetFixed ? 'fixed' : 'absolute';
  callout.el.style.top = calloutPosition.top + 'px';
  callout.el.style.left = calloutPosition.left + 'px';
}

/**
 * Returns top and left scroll positions
 * @private
 */
function getScrollPosition() {
  let top = 0;
  let left = 0;

  if (typeof window.pageYOffset !== 'undefined') {
    top = window.pageYOffset;
    left = window.pageXOffset;
  }

  return { top, left };
}

/**
 * Looks up the DOM tree to see if any of the parent elements have fixed position
 * @private
 */
function isFixedElement(el) {
  if (!el.style) {
    return false;
  } else if (el.style.position === 'fixed') {
    return true;
  } else if (el.parentNode) {
    return isFixedElement(el.parentNode);
  }
  return false;
}
/* END PRIVATE FUNCTIONS AND VARIABLES FOR THIS MODULE */