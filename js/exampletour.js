var tour = {
  id: 'hello-hopscotch',
  steps: [
    {
      title: 'Welcome to the Hopscotch Demo Page!',
      content: 'Hey there! Welcome to the Hopscotch Demo Page! Please excuse our dust; this is still a work in progress. To proceed, click the next button below. (And as you do, watch the title of the page turn red!!!)',
      targetId: 'subheading',
      orientation: 'bottom',
      arrowOffset: 30,
      onNext: function() {
        document.getElementById('pageTitle').style.color = '#f00';
      }
    },
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
      title: 'Mission district',
      content: 'Some sort of sound heat map in the mission? Did you notice that this bubble isn\'t completely aligned with this image? That\'s because I\'m using xOffset and yOffset options, which are available if you need to make slight positioning adjustments! Hopscotch has never been more fun!',
      targetId: 'mission',
      orientation: 'top',
      xOffset: 100,
      arrowOffset: 100
    },
    {
      title: 'Multi-page test',
      content: 'Are you ready? We\'re going to try hopping to another page and then back!!! Where we\'re going, we won\'t need roads... (Please click this link.)',
      targetId: 'secpagelink',
      orientation: 'bottom',
      showNextButton: false,
      multiPage: true
    },
    {
      title: 'Polar bears',
      content: 'We made it!! Polar bears are very interesting creatures.',
      targetId: 'polarbears',
      orientation: 'right',
      showPrevButton: false
    },
    {
      title: 'Returning to the first page',
      content: 'Time to go back home... Please click this link to return to the first page.',
      targetId: 'firstpagelink',
      orientation: 'bottom',
      showNextButton: false,
      showPrevButton: false,
      multiPage: true // this indicates that next step will be on a different page
    },
    {
      title: 'Cool wave',
      content: 'This is a colorful wave. Here is the the <a href="http://imgur.com/s632o" target="_new">page</a> where I found it.',
      targetId: 'wave',
      orientation: 'bottom',
      width: 500,
      xOffset: -50,
      arrowOffset: 400,
      showPrevButton: false
    },
    {
      title: 'Python decorator',
      content: 'Whoa, did you notice that the page just scrolled? If you didn\'t, you aren\'t very observant. (Or you have a very tall monitor)',
      targetId: 'python',
      orientation: 'top',
      xOffset: 200
    }
  ],
  animate: false,
  //smoothScroll: false,
  //showCloseButton: false,
  scrollTopMargin: 200,
  showPrevButton: true,
  showNextButton: true,
  arrowWidth: 20,
  scrollDuration: 500,
  cookieName: 'li_hs',
  onNext: function(step, idx) {
    var newLi,
        list = document.getElementById('my-list');
    if (list) {
      newLi = document.createElement('li');
      newLi.innerHTML = 'going from step ' + (idx + 1) + ' to step ' + (idx+2) + '. (can use this callback for tracking)';
      list.appendChild(newLi);
    }
  },
  /* to be implemented:
  onDone: function() {
  },
  */
  i18n: {
    nextBtn: 'Forward',
    prevBtn: 'Backward',
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
