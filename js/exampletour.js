var tour = {
  id: 'hello-hopscotch',
  steps: [
    {
      title: 'Welcome to the Hopscotch Demo Page!',
      content: 'Hey there! Welcome to the Hopscotch Demo Page! Please excuse our dust; this is still a work in progress. To proceed, click the next button below. (And as you do, watch the title of the page turn red!!!)',
      target: 'subheading',
      orientation: 'bottom',
      arrowOffset: 30,
      nextOnTargetClick: true,
      onNext: function() {
        document.getElementById('pageTitle').style.color = '#f00';
      }
    },
    {
      title: 'Debug controls',
      content: 'Here are the debug controls. They\'re pretty self-explanatory: start a tour, end a tour, clear the tour cookie (if you want the tour to forget what step you are on).',
      target: 'debug',
      orientation: 'left',
      width: 320,
      height: 480,
      showSkip: true,
      fixedElement: true,
      //xOffset: 20,
      zindex: 15,
      showPrevButton: true,
      showNextButton: true,
      delay: 5000,
      onPrev: function() {
        document.getElementById('pageTitle').style.color = '#000';
      }
    },
    {
      title: 'Mission district',
      content: 'Some sort of sound heat map in the mission? Did you notice that this bubble isn\'t completely aligned with this image? That\'s because I\'m using xOffset and yOffset options, which are available if you need to make slight positioning adjustments! Hopscotch has never been more fun!',
      target: 'mission',
      orientation: 'top',
      xOffset: 100,
      arrowOffset: 100
    },
    {
      title: 'Cool wave',
      content: 'This is a <b>colorful</b> wave. Here is the the <a href="http://imgur.com/s632o" target="_new">page</a> where I found it.',
      target: 'wave',
      orientation: 'bottom',
      width: 500
      //xOffset: -50,
      //arrowOffset: 400,
      //showPrevButton: false
    },
    {
      title: 'Multi-page test',
      content: 'Are you ready? We\'re going to try hopping to another page and then back!!! Where we\'re going, we won\'t need roads... (Please click this link.)',
      target: 'secpagelink',
      orientation: 'bottom',
      showNextButton: false,
      multipage: true
    },
    {
      title: 'Polar bears',
      content: 'We made it!! Polar bears are very interesting creatures.',
      target: 'polarbears',
      orientation: 'right',
      showPrevButton: false
    },
    {
      title: 'Returning to the first page',
      content: 'Time to go back home... Please click this link to return to the first page.',
      target: 'firstpagelink',
      orientation: 'bottom',
      showNextButton: false,
      showPrevButton: false,
      multipage: true // this indicates that next step will be on a different page
    },
    {
      title: 'Python decorator',
      content: 'Whoa, did you notice that the page just scrolled? If you didn\'t, you aren\'t very observant. (Or you have a very tall monitor)',
      target: 'python',
      orientation: 'top',
      xOffset: 200
    }
  ],
  //animate: true,
  //smoothScroll: false,
  //showCloseButton: false,
  scrollTopMargin: 50,
  arrowWidth: 20,
  //scrollDuration: 2000,
  cookieName: 'li_hs',
  skipIfNoElement: true,
  onNext: function(tourId, idx) {
    var newLi,
        list = document.getElementById('my-list');
    if (list) {
      newLi = document.createElement('li');
      newLi.innerHTML = 'clicked next on step ' + (idx + 1);
      //newLi.innerHTML = 'going from step ' + (idx + 1) + ' to step ' + (idx+2) + '. (can use this callback for tracking)';
      list.appendChild(newLi);
    }
  },
  onPrev: function(tourId, idx) {
    printLog('tour prev ' + tourId + ' ' + idx);
  },
  onStart: function(tourId, idx) {
    printLog('tour start ' + tourId + ' and idx is: ' + idx);
  },
  onEnd: function(tourId) {
    printLog('tour end ' + tourId);
  },
  onShow: function(tourId, idx) {
    printLog('showing step: ' + tourId + ' ' + idx);
  },
  onError: function(tourId, idx) {
    var newLi,
        list = document.getElementById('my-list');
    if (list) {
      newLi = document.createElement('li');
      newLi.innerHTML = 'error on step ' + (idx + 1);
      //newLi.innerHTML = 'going from step ' + (idx + 1) + ' to step ' + (idx+2) + '. (can use this callback for tracking)';
      list.appendChild(newLi);
    }
  },
  onClose: function() {
    printLog('closing');
  }
  //i18n: {
    ////nextBtn: 'Forward',
    ////prevBtn: 'Backward',
    //stepNums: [
      //'&#x4e00;',
      //'&#x4e8c;',
      //'&#x4e09;',
      //'&#x56db;',
      //'&#x4e94;',
      //'&#x516d;'
    //]
  //}
};
