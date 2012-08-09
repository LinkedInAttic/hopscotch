var i,
    len,
    optionName,
    checkbox,
    fn,
    booleanControls = [
      'animate',
      'smoothScroll',
      'showCloseButton',
      'showPrevButton',
      'showNextButton'
    ],

addClickListener = function(el, fn) {
  if (el.addEventListener) {
    el.addEventListener('click', fn);
  }
  else {
    el.attachEvent('onclick', fn);
  }
},

attachListenerForOption = function(checkbox, optionName) {
  var fn = function() {
    var options = {};
    options[optionName] = checkbox.checked;
    hopscotch.configure(options);
  };
  if (checkbox.addEventListener) {
    checkbox.addEventListener('change', fn);
  }
  else {
    checkbox.attachEvent('onchange', fn);
  }
};

// BOOLEAN CONTROLS
for (i = 0, len = booleanControls.length; i < len; i++) {
  optionName = booleanControls[i];
  checkbox = document.getElementById(optionName + 'Check');
  attachListenerForOption(checkbox, optionName);
}

// SHOW ASIAN STEP NUMS
(function() {
  var checkbox = document.getElementById('showAsianStepNumsCheck'),
  fn = function() {
    console.log('changing steps');
    var asianSteps = [
          '&#x4e00;',
          '&#x4e8c;',
          '&#x4e09;',
          '&#x56db;',
          '&#x4e94;',
          '&#x516d;'
        ],
        steps = checkbox.checked ? asianSteps : null;

    hopscotch.configure({ i18n: { stepNums: steps } });
  };

  if (checkbox.addEventListener) {
    checkbox.addEventListener('change', fn);
  }
  else {
    checkbox.attachEvent('onchange', fn);
  }
}());

// GO TO STEP NUM
(function() {
  var gotobtn  = document.getElementById('gotobtn');
  addClickListener(gotobtn, function() {
    var gototext = document.getElementById('gototext');
    hopscotch.showStep(parseInt(gototext.value, 10)-1);
  });

  // ==========
  // START TOUR
  // ==========
  addClickListener(document.getElementById('startBtn'), function() {
    hopscotch.loadTour(tour);
    hopscotch.startTour();
  });

  // ========
  // END TOUR
  // ========
  addClickListener(document.getElementById('endBtn'), function() {
    hopscotch.endTour();
  });

}());
