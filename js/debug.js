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

for (i = 0, len = booleanControls.length; i < len; i++) {
  optionName = booleanControls[i];
  checkbox = document.getElementById(optionName + 'Check');
  attachListenerForOption(checkbox, optionName);
}

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
}())
