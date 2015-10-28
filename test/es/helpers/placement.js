const OFFSET_CENTER = 'center';
const PLACEMENT_TOP = 'top';
const PLACEMENT_BOTTOM = 'bottom';
const PLACEMENT_LEFT = 'left';
const PLACEMENT_RIGHT = 'right';
const QUERY_SELECTOR_CALLOUT = '.hopscotch-bubble';
const QUERY_SELECTOR_ARROW = '.hopscotch-bubble-arrow-container';
const PLACEMENT_DEVIATION = 1;

function hasExpectedPlacement(actual, expected) {
  let diff = Math.abs(actual - expected);
  return diff <= PLACEMENT_DEVIATION;
}

function isPlacedOnTop(calloutPos, arrowEl, targetPos) {
  // placement: top
  // callout should be above arrow
  // arrow should be above target
  //         _______________
  //        |   Callout     |
  //        |_______________|
  //              V
  //         _______________
  //        |   Target      |
  //        |_______________|
  let actualPlacement = Math.floor(calloutPos.bottom + arrowEl.offsetHeight);
  let expectedPlacement = Math.floor(targetPos.top);

  return hasExpectedPlacement(actualPlacement, expectedPlacement);
}

function isPlacedOnBottom(calloutPos, arrowEl, targetPos) {
  // placement: bottom
  // arrow should be below target
  // callout should be above arrow
  //        ----------------
  //        |   Target     |
  //        ----------------
  //              ^
  //        ----------------
  //        |   Callout    |
  //        ----------------
  let actualPlacement = Math.floor(calloutPos.top - arrowEl.offsetHeight);
  let expectedPlacement = Math.round(targetPos.bottom);

  return hasExpectedPlacement(actualPlacement, expectedPlacement);
}

function isPlacedOnLeft(calloutPos, arrowEl, targetPos) {
  //placement: left
  //arrow should be to the left of the target
  //callout should be to the left of the arrow
  //        ----------------   ----------------
  //        |   Callout    |>  |   Target     |
  //        ----------------   ----------------
  let actualPlacement = Math.floor(calloutPos.right + arrowEl.offsetWidth);
  let expectedPlacement = Math.floor(targetPos.left);

  return hasExpectedPlacement(actualPlacement, expectedPlacement);
}

function isPlacedOnRight(calloutPos, arrowEl, targetPos) {
  //placement: right
  //arrow should be to the right of the target
  //callout should be to the right of the arrow
  //        ----------------   ----------------
  //        |   Target     | < |   Callout    |
  //        ----------------   ----------------
  let actualPlacement = Math.floor(calloutPos.left - arrowEl.offsetWidth);
  let expectedPlacement = Math.floor(targetPos.right);

  return hasExpectedPlacement(actualPlacement, expectedPlacement);
}

function verifyCalloutPlacement(target, expectedPlacement) {
  let callout = document.querySelector(QUERY_SELECTOR_CALLOUT);
  let arrow = document.querySelector(QUERY_SELECTOR_ARROW);
  let actualPlacement = 'unknown';

  if (callout && arrow) {

    let calloutPos = callout.getBoundingClientRect();
    let targetPos = target.getBoundingClientRect();

    if (isPlacedOnTop(calloutPos, arrow, targetPos)) {
      actualPlacement = PLACEMENT_TOP;
    } else if (isPlacedOnBottom(calloutPos, arrow, targetPos)) {
      actualPlacement = PLACEMENT_BOTTOM;
    } else if (isPlacedOnLeft(calloutPos, arrow, targetPos)) {
      actualPlacement = PLACEMENT_LEFT;
    } else if (isPlacedOnRight(calloutPos, arrow, targetPos)) {
      actualPlacement = PLACEMENT_RIGHT;
    }

    expect('placement:' + actualPlacement).toEqual('placement:' + expectedPlacement);
  } else {
    throw new Error('Callout element should exist in the DOM');
  }
}

/**
 * Makes sure that page height is larger than viewport and scrolls to
 * the bottom of the page
 */
function ensurePageScroll() {
  let viewportHeight = document.documentElement.clientHeight;
  let documentHeight = document.body.offsetHeight;

  if ((documentHeight - viewportHeight) < 100) {
    //try adding padding to the body element until we have scroll
    document.body.style.paddingTop = (viewportHeight - documentHeight + 100) + 'px';
  }
  //scroll to the bottom of the page
  window.scrollTo(0, document.body.scrollHeight);
}

/**
 * Undo ensurePageScroll effects
 * Resets top body padding and scrolls to the top of the page
 * @private
 */
function resetPageScroll() {
  document.body.style.padding = 0;
  window.scrollTo(0, 0);
}

/**
 * Verifies that elements are centered vertically
 * @private
 */
function verifyHorizontalCentersAligned(el1, el2) {
  let el1Box = el1.getBoundingClientRect();
  let el2Box = el2.getBoundingClientRect();
  let el1Center = Math.floor(el1Box.left + (el1.offsetWidth / 2));
  let el2Center = Math.floor(el2Box.left + (el2.offsetWidth / 2));
  expect(el1Center).toEqual(el2Center);
}

/**
 * Verifies that elements are centered vertically
 * @private
 */
function verifyVerticalCentersAligned(el1, el2) {
  let el1Box = el1.getBoundingClientRect();
  let el2Box = el2.getBoundingClientRect();
  let el1Center = Math.floor(el1Box.top + (el1.offsetHeight / 2));
  let el2Center = Math.floor(el2Box.top + (el2.offsetHeight / 2));
  expect(el1Center).toEqual(el2Center);
}

/**
 * Verifies that left edge of the el1 has expected offset from the left edge of the el2
 * In RTL mode this function will compare positions of the right side of the elements
 * @private
 */
function verifyHorizontalOffset(el1, el2, expectedOffset, isRTL) {
  let el1Box = el1.getBoundingClientRect();
  let el2Box = el2.getBoundingClientRect();
  let actualOffset;
  if (isRTL) {
    actualOffset = Math.floor(el1Box.right - el2Box.right);
  } else {
    actualOffset = Math.floor(el1Box.left - el2Box.left);
  }

  expect(hasExpectedPlacement(actualOffset, expectedOffset)).toEqual(true);
}

/**
 * Verifies that offset between top positions of both elements equals to expected offset
 * @private
 */
function verifyVerticalOffset(el1, el2, expectedOffset) {
  let el1Box = el1.getBoundingClientRect();
  let el2Box = el2.getBoundingClientRect();
  let actualOffset = Math.floor(el1Box.top - el2Box.top);

  expect(hasExpectedPlacement(actualOffset, expectedOffset)).toEqual(true);
}

/**
 * Checks that callout is horizontally offset from target by an expected offset
 */
function verifyXOffset(target, placement, expectedOffset, isRtl) {
  let callout = document.querySelector(QUERY_SELECTOR_CALLOUT);
  let arrow = document.querySelector(QUERY_SELECTOR_ARROW);
  let calloutElBox = callout.getBoundingClientRect();
  let targetElBox = target.getBoundingClientRect();
  let actualOffset;

  //check that offsets are correct for a given placement
  if (placement === PLACEMENT_TOP || placement === PLACEMENT_BOTTOM) {
    if (expectedOffset === OFFSET_CENTER) {
      return verifyHorizontalCentersAligned(callout, target);
    } else {
      return verifyHorizontalOffset(callout, target, expectedOffset, isRtl);
    }
  } else if (placement === PLACEMENT_LEFT) {
    if (isRtl) {
      actualOffset = (calloutElBox.left - arrow.offsetWidth) - targetElBox.right;
    } else {
      actualOffset = (calloutElBox.right + arrow.offsetWidth) - targetElBox.left;
    }
  } else if (placement === PLACEMENT_RIGHT) {
    if (isRtl) {
      actualOffset = (calloutElBox.right + arrow.offsetWidth) - targetElBox.left;
    } else {
      actualOffset = (calloutElBox.left - arrow.offsetWidth) - targetElBox.right;
    }
  }

  expect(hasExpectedPlacement(actualOffset, expectedOffset)).toEqual(true);
}

/**
 * Checks that callout is vertically offset from target by an expected offset
 */
function verifyYOffset(target, placement, expectedOffset) {
  let callout = document.querySelector(QUERY_SELECTOR_CALLOUT);
  let arrow = document.querySelector(QUERY_SELECTOR_ARROW);
  let calloutElBox = callout.getBoundingClientRect();
  let targetElBox = target.getBoundingClientRect();
  let actualOffset;

  //check that offsets are correct for a given placement
  if (placement === PLACEMENT_TOP) {
    actualOffset = (calloutElBox.bottom + arrow.offsetHeight) - targetElBox.top;
  } else if (placement === PLACEMENT_BOTTOM) {
    actualOffset = (calloutElBox.top - arrow.offsetHeight) - targetElBox.bottom;
  } else if (placement === PLACEMENT_LEFT || placement === PLACEMENT_RIGHT) {
    if (expectedOffset === OFFSET_CENTER) {
      return verifyVerticalCentersAligned(callout, target);
    } else {
      actualOffset = calloutElBox.top - targetElBox.top;
    }
  }

  expect(hasExpectedPlacement(actualOffset, expectedOffset)).toEqual(true);
}

/**
 * Checks that arrow has expected offset relative to the callout
 */
function verifyArrowOffset(placement, expectedOffset, isRTL) {
  let callout = document.querySelector(QUERY_SELECTOR_CALLOUT + ' .hopscotch-bubble-container');
  let arrow = document.querySelector(QUERY_SELECTOR_ARROW);

  if (expectedOffset === OFFSET_CENTER) {
    if (placement === PLACEMENT_TOP || placement === PLACEMENT_BOTTOM) {
      return verifyHorizontalCentersAligned(callout, arrow);
    } else {
      return verifyVerticalCentersAligned(callout, arrow);
    }
  } else {
    if (placement === PLACEMENT_TOP || placement === PLACEMENT_BOTTOM) {
      verifyHorizontalOffset(arrow, callout, expectedOffset, isRTL);
    } else {
      verifyVerticalOffset(arrow, callout, expectedOffset);
    }
  }
}

let PlacementTestUtils = {
  verifyCalloutPlacement,
  ensurePageScroll,
  resetPageScroll,
  verifyXOffset,
  verifyYOffset,
  verifyArrowOffset
};

export default PlacementTestUtils;