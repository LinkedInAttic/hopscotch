function getElementOffset(element) {
  let top = 0,
    left = 0,
    width = element.getBoundingClientRect().width,
    height = element.getBoundingClientRect().height;

  do {
    top += element.offsetTop || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while (element);

  return {
    top: top,
    left: left,
    bottom: top + height,
    right: left + width
  };
};

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
  return (calloutPos.bottom + arrowEl.offsetHeight) === targetPos.top;
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
  return (calloutPos.top - arrowEl.offsetHeight) === targetPos.bottom;
}

function isPlacedOnLeft(calloutPos, arrowEl, targetPos) {
  //placement: left
  //arrow should be to the left of the target
  //callout should be to the left of the arrow
  //        ----------------   ----------------
  //        |   Callout    |>  |   Target     |
  //        ----------------   ----------------
  return (calloutPos.right + arrowEl.offsetWidth) === targetPos.left;
}

function isPlacedOnRight(calloutPos, arrowEl, targetPos) {
  //placement: right
  //arrow should be to the right of the target
  //callout should be to the right of the arrow
  //        ----------------   ----------------
  //        |   Target     | < |   Callout    |
  //        ----------------   ----------------
  return (calloutPos.left - arrowEl.offsetWidth) === targetPos.right;
}

function verifyCalloutPlacement(target, expectedPlacement) {
  let callout = document.querySelector('.hopscotch-bubble');
  let arrow = document.querySelector('.hopscotch-arrow');
  let actualPlacement = 'unknown';

  if (callout && arrow) {

    let calloutPos = getElementOffset(callout);
    let targetPos = getElementOffset(target);

    if (isPlacedOnTop(calloutPos, arrow, targetPos)) {
      actualPlacement = 'top';
    } else if (isPlacedOnBottom(calloutPos, arrow, targetPos)) {
      actualPlacement = 'bottom';
    } else if (isPlacedOnLeft(calloutPos, arrow, targetPos)) {
      actualPlacement = 'left';
    } else if (isPlacedOnRight(calloutPos, arrow, targetPos)) {
      actualPlacement = 'right';
    }

    expect('placement:' + actualPlacement).toEqual('placement:' + expectedPlacement);
  } else {
    throw new Error('Callout element should exist in the DOM');
  }
}

function verifyCalloutIsShown() {
  let hsCallout = document.querySelector('.hopscotch-bubble'),
    hsArrow = document.querySelector('.hopscotch-arrow');

  expect(hsCallout).toBeDefined();
  expect(hsArrow).toBeDefined();
}

function verifyCalloutIsNotShown() {
  let hsCallout = document.querySelector('.hopscotch-bubble'),
    hsArrow = document.querySelector('.hopscotch-arrow');

  expect(hsCallout).not.toBeDefined();
  expect(hsArrow).not.toBeDefined();
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
 * Checks that callout is horizontally offset from target by an expected offset 
 */
function verifyXOffset(target, placement, expectedOffset) {
  let callout = document.querySelector('.hopscotch-bubble');
  let calloutArrow = document.querySelector('.hopscotch-arrow');
  let calloutElBox = callout.getBoundingClientRect();
  let targetElBox = target.getBoundingClientRect();
  let isRtl = document.body.getAttribute('dir') === 'rtl';
  let prop = isRtl ? 'right' : 'left';
  let actualOffset;

  //check that offsets are correct for a given placement
  if (placement === 'top' || placement === 'bottom') {
    //make sure callout is where it's supposed to be
    verifyCalloutPlacement(target, placement);

    if (expectedOffset === 'center') {
      let calloutCenter = calloutElBox.left + (calloutElBox.width / 2);
      let targetCenter = targetElBox.left + (targetElBox.width / 2);
      actualOffset = (calloutCenter === targetCenter) ? 'center' : 'not centered';
    } else {
      //By default left side of the callout placed on top of the target element is
      //aligned with the left side of the target element
      //So when xOffset is applied, left side of the callout element is shifted to the
      //right or the left of the target element's left side
      actualOffset = calloutElBox[prop] - targetElBox[prop];
    }
  } else if (placement === 'left') {
    if (isRtl) {
      actualOffset = (calloutElBox.left - calloutArrow.offsetWidth) - targetElBox.right;
    } else {
      actualOffset = (calloutElBox.right + calloutArrow.offsetWidth) - targetElBox.left;
    }
  } else if (placement === 'right') {
    if (isRtl) {
      actualOffset = (calloutElBox.right + calloutArrow.offsetWidth) - targetElBox.left;
    } else {
      actualOffset = (calloutElBox.left - calloutArrow.offsetWidth) - targetElBox.right;
    }
  }

  expect(actualOffset).toEqual(expectedOffset);
}

/**
 * Checks that callout is vertically offset from target by an expected offset 
 */
function verifyYOffset(target, placement, expectedOffset) {
  let callout = document.querySelector('.hopscotch-bubble');
  let calloutArrow = document.querySelector('.hopscotch-arrow');
  let calloutElBox = callout.getBoundingClientRect();
  let targetElBox = target.getBoundingClientRect();
  let actualOffset;

  //check that offsets are correct for a given placement
  if (placement === 'top') {
    actualOffset = (calloutElBox.bottom + calloutArrow.offsetHeight) - targetElBox.top;
  } else if (placement === 'bottom') {
    actualOffset = (calloutElBox.top - calloutArrow.offsetHeight) - targetElBox.bottom;
  } else if (placement === 'left' || placement === 'right') {
    if (expectedOffset === 'center') {
      let calloutCenter = Math.ceil(calloutElBox.top + (calloutElBox.height / 2));
      let targetCenter = Math.ceil(targetElBox.top + (targetElBox.height / 2));
      actualOffset = (calloutCenter === targetCenter) ? 'center' : 'not centered';
    } else {
      actualOffset = calloutElBox.top - targetElBox.top;
    }
  }

  expect(actualOffset).toEqual(expectedOffset);
}

let PlacementTestUtils = {
  verifyCalloutPlacement,
  verifyCalloutIsShown,
  verifyCalloutIsNotShown,
  ensurePageScroll,
  resetPageScroll,
  verifyXOffset,
  verifyYOffset
};

export default PlacementTestUtils;