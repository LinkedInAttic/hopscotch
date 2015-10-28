function setupFixture() {
  //create an element for shopping list
  let shoppingListDiv = document.createElement('div');
  //set up shopping list
  shoppingListDiv.id = 'shopping-list';
  shoppingListDiv.style.margin = '40px auto';
  shoppingListDiv.style.width = '400px';
  shoppingListDiv.innerHTML =
  '<style>' +
  '  #shopping-list ul { padding: 0; }' +
  '  #shopping-list li { margin-top: 5px; padding: 5px 3px; border: 1px solid black; list-style: none; }' +
  '  li#yogurt { padding: 15px 160px; border: 5px solid black; margin-top: 25px; }' +
  '</style>' +
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