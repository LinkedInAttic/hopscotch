/* jshint laxbreak:true */

var testUtils = (function () {

  var getElementOffset = function (element) {
    var top = 0,
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

  function isPlacedOnTop(bubblePos, arrowPos, targetPos, distanceFromTarget) {
    //placement: top
    //bubble should be above arrow
    //arrow should be above target
    //         _______________
    //        |   Bubble      |
    //        |_______________|
    //              V
    //         _______________
    //        |   Target      |
    //        |_______________|
    // arrowPos.top - base of the arrow
    // arrowPos.bottom - tip of the arrow
    return (bubblePos.bottom > arrowPos.top)
        && (arrowPos.bottom > bubblePos.bottom)
        && (Math.abs(arrowPos.bottom - targetPos.top) < distanceFromTarget);
  }

  function isPlacedOnBottom(bubblePos, arrowPos, targetPos, distanceFromTarget) {
    //placement: bottom
    //arrow should be below target
    //bubble should be above arrow
    // arrowPos.bottom - base of the arrow
    // arrowPos.top - tip of the arrow
    //        ----------------
    //        |   Target     |
    //        ----------------
    //              ^
    //        ----------------
    //        |   Bubble     |
    //        ----------------
    return (Math.abs(arrowPos.top - targetPos.bottom) < distanceFromTarget) &&
        (arrowPos.top < bubblePos.top) &&
        (bubblePos.top > targetPos.bottom);
  }

  function isPlacedOnLeft(bubblePos, arrowPos, targetPos, distanceFromTarget) {
    //placement: left
    //arrow should be to the left of the target
    //bubble should be to the left of the arrow
    // arrowPos.left - base of the arrow
    // arrowPos.right - tip of the arrow
    //        ----------------   ----------------
    //        |   Bubble     |>  |   Target     |
    //        ----------------   ----------------
    return (Math.abs(arrowPos.right - targetPos.left) < distanceFromTarget) &&
        (arrowPos.left < bubblePos.right) &&
        (bubblePos.right < targetPos.left);
  }

  function isPlacedOnRight(bubblePos, arrowPos, targetPos, distanceFromTarget) {
    //placement: right
    //arrow should be to the right of the target
    //bubble should be to the right of the arrow
    // arrowPos.left - tip of the arrow
    // arrowPos.right - base of the arrow
    //        ----------------   ----------------
    //        |   Target     | < |   Bubble     |
    //        ----------------   ----------------
    return (Math.abs(arrowPos.left - targetPos.right) < distanceFromTarget) &&
        (arrowPos.left < bubblePos.right) &&
        (bubblePos.left > targetPos.right);
  }

  function verifyBubblePlacement(target, expectedPlacement) {
    var $hsBubble = $('.hopscotch-bubble'),
        $hsArrow = $('.hopscotch-arrow'),
        bubblePos,
        arrowPos,
        targetPos,
        distanceFromTarget = 10, //max 10 px from target
        actualPlacement = 'unknown';

    if ($hsBubble.length > 0 && $hsArrow.length > 0) {

      bubblePos = getElementOffset($hsBubble[0]);
      arrowPos = getElementOffset($hsArrow[0]);
      targetPos = getElementOffset(target);

      if (isPlacedOnTop(bubblePos, arrowPos, targetPos, distanceFromTarget)) {
        actualPlacement = 'top';
      } else if (isPlacedOnBottom(bubblePos, arrowPos, targetPos, distanceFromTarget)) {
        actualPlacement = 'bottom';
      } else if (isPlacedOnLeft(bubblePos, arrowPos, targetPos, distanceFromTarget)) {
        actualPlacement = 'left';
      } else if (isPlacedOnRight(bubblePos, arrowPos, targetPos, distanceFromTarget)) {
        actualPlacement = 'right';
      }

      expect('placement:' + actualPlacement).toEqual('placement:' + expectedPlacement);
    } else {
      throw new Error('Bubble element should exist in the DOM');
    }
  }

  function verifyBubbleIsShown() {
    var $hsBubble = $('.hopscotch-bubble'),
        $hsArrow = $('.hopscotch-arrow');

    expect($hsBubble.length).toEqual(1);
    expect($hsArrow.length).toEqual(1);
  }

  function verifyBubbleIsNotShown() {
    var $hsBubble = $('.hopscotch-bubble'),
        $hsArrow = $('.hopscotch-arrow');

    expect($hsBubble.length).toEqual(0);
    expect($hsArrow.length).toEqual(0);
  }

  return {
    verifyBubblePlacement: verifyBubblePlacement,
    verifyBubbleIsShown: verifyBubbleIsShown,
    verifyBubbleIsNotShown: verifyBubbleIsNotShown
  };
}());