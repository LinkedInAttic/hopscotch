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
  '</ul>';
  //insert shopping list into the DOM
  document.body.appendChild(shoppingListDiv);
}

describe('Callout Placement', function () {
  setupFixture();

  let calloutManager = hopscotch.getCalloutManager();
  let targetEl = document.querySelector('#yogurt');
  let placements = [
    { placement: 'top', position: 'above' },
    { placement: 'bottom', position: 'below' },
    { placement: 'left', position: 'to the left of' },
    { placement: 'right', position: 'to the right of' }
  ];

  placements.forEach((pInfo) => {
    describe(pInfo.placement, function () {
      afterEach(() => {
        calloutManager.removeAllCallouts();
      });

      it('Callout should be shown ' + pInfo.position + ' the target', function () {
        calloutManager.createCallout({
          id: 'callout-placement-' + pInfo.placement,
          target: targetEl,
          placement: pInfo.placement,
          title: 'Callout position: ' + pInfo.placement,
          content: 'This wonderful callout should apear ' + pInfo.position + ' the target'
        });

        PlacementTestUtils.verifyCalloutPlacement(targetEl, pInfo.placement);
      });
    });
  });
});