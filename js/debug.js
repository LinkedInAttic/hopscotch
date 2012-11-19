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
    el.addEventListener('click', fn, false);
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
    checkbox.addEventListener('change', fn, false);
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
    checkbox.addEventListener('change', fn, false);
  }
  else {
    checkbox.attachEvent('onchange', fn);
  }
}());

(function() {
  // GO TO STEP NUM
  var gotobtn  = document.getElementById('gotobtn');
  addClickListener(gotobtn, function() {
    var gototext = document.getElementById('gototext');
    hopscotch.showStep(parseInt(gototext.value, 10)-1);
  });

  // ==========
  // START TOUR
  // ==========
  addClickListener(document.getElementById('startBtn'), function() {
    hopscotch.startTour(tour);
  });

  // ========
  // END TOUR
  // ========
  addClickListener(document.getElementById('endBtn'), function() {
    hopscotch.endTour();
  });

  // ===========
  // ADD CALLOUT
  // ===========
  addClickListener(document.getElementById('addCallout'), function() {
    var mgr = hopscotch.getCalloutManager();
    mgr.createCallout({
      id: 'mycallout',
      title: 'Title',
      content: 'Content',
      target: 'google',
      orientation: 'top',
      showNavButtons: false,
      showNumber: false
    });
  });

  // ==============
  // REMOVE CALLOUT
  // ==============
  addClickListener(document.getElementById('rmCallout'), function() {
    var mgr = hopscotch.getCalloutManager();
    mgr.removeCallout('mycallout');
  });

  // ===========
  // START TOUR2
  // ===========
  //addClickListener(document.getElementById('startBtn2'), function() {
    //hopscotch.startTour(tour2);
  //});
}());

var tour2 = {
  id: 'hello-hopscotch2',
  steps: [
    {
      title: 'Debug controls',
      content: 'Here are the debug controls. They\'re pretty self-explanatory: start a tour, end a tour, clear the tour cookie (if you want the tour to forget what step you are on).',
      targetId: 'debug',
      orientation: 'left',
      width: 320,
      height: 480,
      onPrev: function() {
        document.getElementById('pageTitle').style.color = '#000';
      }
    },
    {
      title: 'Python decorator',
      content: 'Whoa, did you notice that the page just scrolled? If you didn\'t, you aren\'t very observant. (Or you have a very tall monitor)',
      targetId: 'google',
      orientation: 'top',
      xOffset: 200
    }
  ],
  animate: false,
  //smoothScroll: false,
  //showCloseButton: false,
  //scrollTopMargin: 200,
  showPrevButton: true,
  showNextButton: true,
  arrowWidth: 20,
  scrollDuration: 500,
  cookieName: 'li_hs',
  onNext: function(tourId, idx) {
    var newLi,
        list = document.getElementById('my-list');
    if (list) {
      newLi = document.createElement('li');
      newLi.innerHTML = 'going from step ' + (idx + 1) + ' to step ' + (idx+2) + '. (can use this callback for tracking)';
      list.appendChild(newLi);
    }
  },
  onPrev: function(tourId, idx) {
    console.log('tour2 prev ' + tourId + ' ' + idx);
  },
  onStart: function(tourId) {
    console.log('tour2 start ' + tourId);
  },
  onEnd: function(tourId) {
    console.log('tour2 end ' + tourId);
  },
  i18n: {
    //nextBtn: 'Forward',
    //prevBtn: 'Backward',
    stepNums: [
      '&#x4e00;',
      '&#x4e8c;',
      '&#x4e09;',
      '&#x56db;',
      '&#x4e94;',
      '&#x516d;'
    ]
  }
};
