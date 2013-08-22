/* globals hopscotch: false */

/* ============ */
/* EXAMPLE TOUR */
/* ============ */
var tour = {
  id: "hello-hopscotch",
  steps: [
    {
      title: "Multipage Example",
      content: "We're going to the next page now...",
      target: "title",
      placement: "bottom",
      multipage: true,
      onNext: function() {
        window.location = "multipage2.html"
      }
    },
    {
      title: "Here we are!",
      content: "Safe and sound!",
      target: "explanation",
      placement: "bottom",
      xOffset: "center",
      arrowOffset: "center"
    }
  ]
},

/* ========== */
/* TOUR SETUP */
/* ========== */
addClickListener = function(el, fn) {
  if (el.addEventListener) {
    el.addEventListener('click', fn, false);
  }
  else {
    el.attachEvent('onclick', fn);
  }
},

startBtnEl = document.getElementById("startTourBtn");

if (startBtnEl) {
  addClickListener(startBtnEl, function() {
    if (!hopscotch.isActive) {
      hopscotch.startTour(tour);
    }
  });
}
else {
  // Assuming we're on page 2.
  if (hopscotch.getState() === "hello-hopscotch:1") {
    // tour id is hello-hopscotch and we're on the second step. sounds right, so start the tour!
    hopscotch.startTour(tour);
  }
}
