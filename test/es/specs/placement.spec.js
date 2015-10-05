import PlacementTestUtils from '../helpers/placement.js';

function setupFixture() {
  //create an element for shopping list
  let shoppingListDiv = document.createElement('div'); 
  //set up shopping list
  shoppingListDiv.id = 'shopping-list';
  shoppingListDiv.style.margin = '40px auto';
  shoppingListDiv.style.width = '400px';
  shoppingListDiv.innerHTML =
  '<style> #shopping-list li { margin-top: 5px; padding: 5px 3px; border: 1px solid black; list-style: none;}</style>' +
  '<ul>' +
  '  <li>This is an example list for the sake of having some UI to point to.</li>' +
  '  <li id="milk">Milk</li>' +
  '  <li id="eggs">Eggs</li>' +
  '  <li id="lettuce">Lettuce</li>' +
  '  <li id="bread">Bread</li>' +
  '  <li id="yogurt">Yogurt</li>' +
  '</ul>' +
  '<div class="fixedTarget" style="position: fixed; right: 300px; top: 150px; background: #CCC; padding: 10px;">' +
  '  Fixed positioned element' +
  '  <span>With child element in it</span>' +
  '</div>';
  //insert shopping list into the DOM
  document.body.appendChild(shoppingListDiv);
}
setupFixture();

let placementTests = [
  {
    placement: 'top',
    position: 'above the target',
    rtlPlacement: 'top',
    rtlPosition: 'above the target'
  },
  {
    placement: 'bottom',
    position: 'below the target',
    rtlPlacement: 'bottom',
    rtlPosition: 'below the target'
  },
  {
    placement: 'left',
    position: 'to the left of the target',
    rtlPlacement: 'right',
    rtlPosition: 'to the right of the target'
  },
  {
    placement: 'right',
    position: 'to the right of the target',
    rtlPlacement: 'left',
    rtlPosition: 'to the right of the target'
  }
];

describe('Callout placement', () => {
  let calloutManager = hopscotch.getCalloutManager();
  let targetEl = document.querySelector('#yogurt');

  placementTests.forEach((pInfo) => {
    describe(pInfo.placement, () => {

      afterEach(() => {
        //when debugging this, scroll to the bottom of the page
        //so we can see the callout
        //This is a convenient function to place a breakpoint
        //so you can see how callout is positioned after each test
        window.scrollTo(0, document.body.scrollHeight);
        PlacementTestUtils.resetPageScroll();
        calloutManager.removeAllCallouts();
        document.body.setAttribute('dir', 'ltr');
      });

      it('Callout should be shown ' + pInfo.position, () => {
        calloutManager.createCallout({
          id: 'callout-placement-' + pInfo.placement,
          target: targetEl,
          placement: pInfo.placement,
          title: 'Callout with placement \'' + pInfo.placement + '\'',
          content: 'This wonderful callout should apear ' + pInfo.position
        });

        PlacementTestUtils.verifyCalloutPlacement(targetEl, pInfo.placement);
      });

      it('Callout should be shown ' + pInfo.position + 'when page is scrolled', () => {
        //make sure page is scrolled, so that callout placement needs to be adjusted
        //to account for scroll 
        PlacementTestUtils.ensurePageScroll();

        calloutManager.createCallout({
          id: 'callout-placement-' + pInfo.placement,
          target: targetEl,
          placement: pInfo.placement,
          title: 'Callout with placement \'' + pInfo.placement + '\'',
          content: 'This wonderful callout should apear ' + pInfo.position
        });

        PlacementTestUtils.verifyCalloutPlacement(targetEl, pInfo.placement);
      });

      it('Callout should be shown ' + pInfo.rtlPosition + ' when isRtl flag is true', () => {
        //change the direction of the page to get real RTL experience
        document.body.setAttribute('dir', 'rtl');

        calloutManager.createCallout({
          id: 'callout-placement-' + pInfo.placement,
          target: targetEl,
          placement: pInfo.placement,
          title: 'Rtl callout with placement \'' + pInfo.placement + '\'',
          content: 'This wonderful callout should apear ' + pInfo.rtlPosition,
          isRtl: true
        });

        PlacementTestUtils.verifyCalloutPlacement(targetEl, pInfo.rtlPlacement);
      });
    });
  });

  describe('invalid', () => {
    afterEach(() => {
      calloutManager.removeAllCallouts();
    });

    it('Should throw an exception when placement is not provided', () => {
      expect(() => {
        calloutManager.createCallout({
          id: 'callout-placement-missing',
          target: targetEl,
          title: 'Callout missing placement',
          content: 'This wonderful callout should not apear.'
        });
      }).toThrow(new Error('Bubble placement failed because placement is invalid or undefined!'));
    });

    it('Should throw an exception when placement is null', () => {
      expect(() => {
        calloutManager.createCallout({
          id: 'callout-placement-null',
          target: targetEl,
          placement: null,
          title: 'Callout with null placement',
          content: 'This wonderful callout should not apear.'
        });
      }).toThrow(new Error('Bubble placement failed because placement is invalid or undefined!'));
    });

    it('Should throw an exception when provided placement value is not one of the supported values', () => {
      expect(() => {
        calloutManager.createCallout({
          id: 'callout-placement-willy-nilly',
          target: targetEl,
          placement: 'willy nilly',
          title: 'Callout with willy nilly placement',
          content: 'This wonderful callout should not apear.'
        });
      }).toThrow(new Error('Bubble placement failed because placement is invalid or undefined!'));
    });
  });
});

describe('Callout placement for fixed target', () => {
  let calloutManager = hopscotch.getCalloutManager();
  let targetEl = document.querySelector('.fixedTarget');

  afterEach(() => {
    PlacementTestUtils.resetPageScroll();
    calloutManager.removeAllCallouts();
  });

  it('Should appear next to the fixed target element', () => {
    calloutManager.createCallout({
      id: 'callout-with-fixed-target',
      target: targetEl,
      placement: 'top',
      title: 'Callout with fixed target',
      content: 'This wonderful callout should appear next to the fixed target'
    });
    PlacementTestUtils.verifyCalloutPlacement(targetEl, 'top');

    let callout = calloutManager.getCallout('callout-with-fixed-target');
    expect(callout.el.style.position).toEqual('fixed');
  });

  it('Should treat target as fixed, if one of the parent elements is fixed', () => {
    //a normal element withing fixed element
    let childEl = targetEl.querySelector('span');
    calloutManager.createCallout({
      id: 'callout-fixed',
      target: childEl,
      placement: 'top',
      title: 'Callout with fixed target',
      content: 'This wonderful callout should appear next to the fixed target'
    });
    PlacementTestUtils.verifyCalloutPlacement(childEl, 'top');

    let callout = calloutManager.getCallout('callout-fixed');
    expect(callout.el.style.position).toEqual('fixed');
  });

  it('Should appear next to the fixed target element even if the page is scrolled', () => {
    PlacementTestUtils.ensurePageScroll();
    calloutManager.createCallout({
      id: 'callout-with-fixed-target-with-scroll',
      target: targetEl,
      placement: 'top',
      title: 'Callout with fixed target',
      content: 'This wonderful callout should appear next to the fixed target'
    });
    PlacementTestUtils.verifyCalloutPlacement(targetEl, 'top');

    let callout = calloutManager.getCallout('callout-with-fixed-target-with-scroll');
    expect(callout.el.style.position).toEqual('fixed');
  });

});

describe('Callout offsets', () => {
  let calloutManager = hopscotch.getCalloutManager();
  let targetEl = document.querySelector('#bread');


  describe('Positive xOffset \'50px\'', () => {
    afterEach(() => {
      calloutManager.removeAllCallouts();
      //reset text direction
      document.body.setAttribute('dir', 'ltr');
    });

    placementTests.forEach((pInfo) => {
      it('Callout with placement\'' + pInfo.placement + '\' should move 50px to the right', () => {
        calloutManager.createCallout({
          id: 'xOffset-' + pInfo.placement,
          target: targetEl,
          placement: pInfo.placement,
          title: 'Callout with pacement \'' + pInfo.placement + '\'',
          content: 'Awesome callout!',
          xOffset: '50px'
        });

        PlacementTestUtils.verifyXOffset(targetEl, pInfo.placement, 50);
      });

      it('Rtl callout with placement\'' + pInfo.placement + '\' should move 50px to the left', () => {
        //change the direction of the page to get real RTL experience
        document.body.setAttribute('dir', 'rtl');

        calloutManager.createCallout({
          id: 'xOffset-rtl-' + pInfo.placement,
          target: targetEl,
          placement: pInfo.placement,
          title: 'Callout with xOffset',
          content: 'Awesome callout!',
          xOffset: '50px',
          isRtl: true
        });

        PlacementTestUtils.verifyXOffset(targetEl, pInfo.placement, -50);
      });
    });
  });

  describe('Negative xOffset \'-50px\'', () => {
    afterEach(() => {
      calloutManager.removeAllCallouts();
      //reset text direction
      document.body.setAttribute('dir', 'ltr');
    });

    placementTests.forEach((pInfo) => {
      it('Callout with placement\'' + pInfo.placement + '\' should move 50px to the left', () => {
        calloutManager.createCallout({
          id: 'xOffset-' + pInfo.placement,
          target: targetEl,
          placement: pInfo.placement,
          title: 'Callout with xOffset',
          content: 'Awesome callout!',
          xOffset: '-50px'
        });

        PlacementTestUtils.verifyXOffset(targetEl, pInfo.placement, -50);
      });

      it('Rtl callout with placement\'' + pInfo.placement + '\' should move 50px to the right', () => {
        //change the direction of the page to get real RTL experience
        document.body.setAttribute('dir', 'rtl');

        calloutManager.createCallout({
          id: 'xOffset-rtl-' + pInfo.placement,
          target: targetEl,
          placement: pInfo.placement,
          title: 'Callout with xOffset',
          content: 'Awesome callout!',
          xOffset: '-50px',
          isRtl: true
        });

        PlacementTestUtils.verifyXOffset(targetEl, pInfo.placement, 50);
      });
    });
  });


  describe('xOffset \'center\'', () => {
    afterEach(() => {
      calloutManager.removeAllCallouts();
      //reset text direction
      document.body.setAttribute('dir', 'ltr');
    });

    it('Horizontal center of the callout with placement \'top\' should be aligned with horizontal center of the target', () => {
      calloutManager.createCallout({
        id: 'xOffset-top',
        target: targetEl,
        placement: 'top',
        title: 'Callout with xOffset',
        content: 'Awesome callout!',
        xOffset: 'center'
      });

      PlacementTestUtils.verifyXOffset(targetEl, 'top', 'center');
    });

    it('Horizontal center of the callout with placement \'bottom\' should be aligned with horizontal center of the target', () => {
      calloutManager.createCallout({
        id: 'xOffset-bottom',
        target: targetEl,
        placement: 'bottom',
        title: 'Callout with xOffset',
        content: 'Awesome callout!',
        xOffset: 'center'
      });

      PlacementTestUtils.verifyXOffset(targetEl, 'bottom', 'center');
    });

    it('Callout with placement \'left\' and xOffset \'center\' should default to \'xOffset\' of 0px', () => {
      calloutManager.createCallout({
        id: 'xOffset-left',
        target: targetEl,
        placement: 'left',
        title: 'Callout with xOffset',
        content: 'Awesome callout!',
        xOffset: 'center'
      });
      //Can not use xOffset 'center' with placement 'left' or 'right'. Callout will overlay the target.
      PlacementTestUtils.verifyXOffset(targetEl, 'left', 0);
    });

    it('Callout with placement \'right\' and xOffset \'center\' should default to \'xOffset\' of 0px', () => {
      calloutManager.createCallout({
        id: 'xOffset-right',
        target: targetEl,
        placement: 'right',
        title: 'Callout with xOffset',
        content: 'Awesome callout!',
        xOffset: 'center'
      });
      //Can not use xOffset 'center' with placement 'left' or 'right'. Callout will overlay the target.
      PlacementTestUtils.verifyXOffset(targetEl, 'right', 0);
    });
  });

  describe('Positive yOffset \'50px\'', () => {
    afterEach(() => {
      calloutManager.removeAllCallouts();
    });

    placementTests.forEach((pInfo) => {
      it('Callout with placement\'' + pInfo.placement + '\' should move 50px down', () => {
        calloutManager.createCallout({
          id: 'yOffset-' + pInfo.placement,
          target: targetEl,
          placement: pInfo.placement,
          title: 'Callout with pacement \'' + pInfo.placement + '\'',
          content: 'Awesome callout!',
          yOffset: '50px'
        });

        PlacementTestUtils.verifyYOffset(targetEl, pInfo.placement, 50);
      });
    });
  });

  describe('Negative yOffset \'-50px\'', () => {
    afterEach(() => {
      calloutManager.removeAllCallouts();
    });

    placementTests.forEach((pInfo) => {
      it('Callout with placement\'' + pInfo.placement + '\' should move 50px up', () => {
        calloutManager.createCallout({
          id: 'yOffset-' + pInfo.placement,
          target: targetEl,
          placement: pInfo.placement,
          title: 'Callout with pacement \'' + pInfo.placement + '\'',
          content: 'Awesome callout!',
          yOffset: '-50px'
        });

        PlacementTestUtils.verifyYOffset(targetEl, pInfo.placement, -50);
      });
    });
  });

  describe('yOffset \'center\'', () => {
    afterEach(() => {
      calloutManager.removeAllCallouts();
      //reset text direction
      document.body.setAttribute('dir', 'ltr');
    });

    it('Callout with placement \'top\' and yOffset \'center\' should default to \'yOffset\' of 0px', () => {
      calloutManager.createCallout({
        id: 'yOffset-top',
        target: targetEl,
        placement: 'top',
        title: 'Callout with yOffset',
        content: 'Awesome callout!',
        yOffset: 'center'
      });
      //Can not use yOffset 'center' with placement 'top' or 'bottom'. Callout will overlay the target.
      PlacementTestUtils.verifyYOffset(targetEl, 'top', 0);
    });

    it('Callout with placement \'bottom\' and yOffset \'center\' should default to \'yOffset\' of 0px', () => {
      calloutManager.createCallout({
        id: 'yOffset-bottom',
        target: targetEl,
        placement: 'bottom',
        title: 'Callout with yOffset',
        content: 'Awesome callout!',
        yOffset: 'center'
      });

      //Can not use yOffset 'center' with placement 'top' or 'bottom'. Callout will overlay the target.
      PlacementTestUtils.verifyYOffset(targetEl, 'bottom', 0);
    });

    it('Vertical center of the callout with placement \'left\' should be aligned with vertical center of the target', () => {
      calloutManager.createCallout({
        id: 'yOffset-left',
        target: targetEl,
        placement: 'left',
        title: 'Callout with yOffset',
        content: 'Awesome callout!',
        yOffset: 'center'
      });

      PlacementTestUtils.verifyYOffset(targetEl, 'left', 'center');
    });

    it('Vertical center of the callout with placement \'right\' should be aligned with vertical center of the target', () => {
      calloutManager.createCallout({
        id: 'yOffset-right',
        target: targetEl,
        placement: 'right',
        title: 'Callout with yOffset',
        content: 'Awesome callout!',
        yOffset: 'center'
      });

      PlacementTestUtils.verifyYOffset(targetEl, 'right', 'center');
    });
  });

  describe('xOffset and yOffset inputs', () => {
    afterEach(() => {
      calloutManager.removeAllCallouts();
    });

    it('xOffset and yOffset can be a simple number that will be treated as pixels', () => {
      calloutManager.createCallout({
        id: 'offsets-are-awesome',
        target: targetEl,
        placement: 'right',
        title: 'Offsets',
        content: 'Callouts with xOffset and yOffset',
        yOffset: 20,
        xOffset: -250
      });

      PlacementTestUtils.verifyXOffset(targetEl, 'right', -250);
      PlacementTestUtils.verifyYOffset(targetEl, 'right', 20);
    });

    it('Invalid xOffset and yOffset is treated as 0', () => {
      calloutManager.createCallout({
        id: 'invalid-offset-is-0',
        target: targetEl,
        placement: 'left',
        title: 'Offsets',
        content: 'Callouts with xOffset and yOffset',
        yOffset: 'jibberish',
        xOffset: ['not', 'valid']
      });

      PlacementTestUtils.verifyXOffset(targetEl, 'left', 0);
      PlacementTestUtils.verifyYOffset(targetEl, 'left', 0);
    });
  });

});