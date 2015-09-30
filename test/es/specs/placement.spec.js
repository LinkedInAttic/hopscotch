import PlacementTestUtils from '../helpers/placement.js';

function setupFixture() {
  //create an element for shopping list
  let shoppingListDiv = document.createElement('div'); 
  //set up shopping list
  shoppingListDiv.id = 'shopping-list';
  shoppingListDiv.style.margin = '40px auto';
  shoppingListDiv.style.width = '400px';
  shoppingListDiv.innerHTML =
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
  '</div>';
  //insert shopping list into the DOM
  document.body.appendChild(shoppingListDiv);
}
setupFixture();

describe('Callout placement', () => {
  let calloutManager = hopscotch.getCalloutManager();
  let targetEl = document.querySelector('#yogurt');
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