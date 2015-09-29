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

function isPlacedOnTop(calloutPos, arrowPos, targetPos, distanceFromTarget) {
  //placement: top
  //callout should be above arrow
  //arrow should be above target
  //         _______________
  //        |   Callout      |
  //        |_______________|
  //              V
  //         _______________
  //        |   Target      |
  //        |_______________|
  // arrowPos.top - base of the arrow
  // arrowPos.bottom - tip of the arrow
  return (calloutPos.bottom > arrowPos.top)
    && (arrowPos.bottom > calloutPos.bottom)
    && (Math.abs(arrowPos.bottom - targetPos.top) < distanceFromTarget);
}

function isPlacedOnBottom(calloutPos, arrowPos, targetPos, distanceFromTarget) {
  //placement: bottom
  //arrow should be below target
  //callout should be above arrow
  // arrowPos.bottom - base of the arrow
  // arrowPos.top - tip of the arrow
  //        ----------------
  //        |   Target     |
  //        ----------------
  //              ^
  //        ----------------
  //        |   Callout     |
  //        ----------------
  return (Math.abs(arrowPos.top - targetPos.bottom) < distanceFromTarget) &&
    (arrowPos.top < calloutPos.top) &&
    (calloutPos.top > targetPos.bottom);
}

function isPlacedOnLeft(calloutPos, arrowPos, targetPos, distanceFromTarget) {
  //placement: left
  //arrow should be to the left of the target
  //callout should be to the left of the arrow
  // arrowPos.left - base of the arrow
  // arrowPos.right - tip of the arrow
  //        ----------------   ----------------
  //        |   Callout     |>  |   Target     |
  //        ----------------   ----------------
  return (Math.abs(arrowPos.right - targetPos.left) < distanceFromTarget) &&
    (arrowPos.left < calloutPos.right) &&
    (calloutPos.right < targetPos.left);
}

function isPlacedOnRight(calloutPos, arrowPos, targetPos, distanceFromTarget) {
  //placement: right
  //arrow should be to the right of the target
  //callout should be to the right of the arrow
  // arrowPos.left - tip of the arrow
  // arrowPos.right - base of the arrow
  //        ----------------   ----------------
  //        |   Target     | < |   Callout     |
  //        ----------------   ----------------
  return (Math.abs(arrowPos.left - targetPos.right) < distanceFromTarget) &&
    (arrowPos.left < calloutPos.right) &&
    (calloutPos.left > targetPos.right);
}

function verifyCalloutPlacement(target, expectedPlacement) {
  let hsCallout = document.querySelector('.hopscotch-bubble'),
    hsArrow = document.querySelector('.hopscotch-arrow'),
    calloutPos,
    arrowPos,
    targetPos,
    distanceFromTarget = 10, //max 10 px from target
    actualPlacement = 'unknown';

  if (hsCallout && hsArrow) {

    calloutPos = getElementOffset(hsCallout);
    arrowPos = getElementOffset(hsArrow);
    targetPos = getElementOffset(target);

    if (isPlacedOnTop(calloutPos, arrowPos, targetPos, distanceFromTarget)) {
      actualPlacement = 'top';
    } else if (isPlacedOnBottom(calloutPos, arrowPos, targetPos, distanceFromTarget)) {
      actualPlacement = 'bottom';
    } else if (isPlacedOnLeft(calloutPos, arrowPos, targetPos, distanceFromTarget)) {
      actualPlacement = 'left';
    } else if (isPlacedOnRight(calloutPos, arrowPos, targetPos, distanceFromTarget)) {
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

let PlacementTestUtils = {
  verifyCalloutPlacement,
  verifyCalloutIsShown,
  verifyCalloutIsNotShown
};

export default PlacementTestUtils;