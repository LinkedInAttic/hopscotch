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
      //showSkip: true,
      fixedElement: true,
      //xOffset: 20,
      zindex: 15,
      //delay: 1000,
      onPrev: function() {
        document.getElementById('pageTitle').style.color = '#000';
      }
    },
    {
      title: 'Mission district',
      content: 'Some sort of sound heat map in the mission? Did you notice that this bubble isn\'t completely aligned with this image? That\'s because I\'m using xOffset and yOffset options, which are available if you need to make slight positioning adjustments! Hopscotch has never been more fun!',
      target: '.mission',
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
      orientation: 'right',
      yOffset: -20,
      onNext: ['goTo', 'secondpage.html'],
      multipage: true
    },
    {
      title: 'Polar bears',
      content: 'We made it!! Polar bears are very interesting creatures.',
      target: 'polarbears',
      orientation: 'right'
      //showPrevButton: false
    },
    {
      title: 'Returning to the first page',
      content: 'Time to go back home... Please click this link to return to the first page.',
      target: 'firstpagelink',
      orientation: 'bottom',
      //showNextButton: false,
      onNext: ['goTo', 'index.html'],
      //showPrevButton: false,
      multipage: true // this indicates that next step will be on a different page
    },
    {
      title: 'Python decorator',
      content: 'Whoa, did you notice that the page just scrolled? If you didn\'t, you aren\'t very observant. (Or you have a very tall monitor)',
      target: 'google',
      orientation: 'top',
      xOffset: 200
    }
  ],
  //smoothScroll: false,
  //showCloseButton: false,
  //bubblePadding: 20,
  bubbleWidth: 480,
  showPrevButton: true,
  scrollTopMargin: 50,
  //arrowWidth: 20,
  //scrollDuration: 500,
  //cookieName: 'li_hs',
  skipIfNoElement: true,
  onStart: ['printlog', 'tour-onstart: start'],
  onNext: ['printlog', 'clicked next'],
  onPrev: ['printlog', 'clicked prev'],
  onShow: ['printlog', 'showing'],
  onClose: ['printlog', 'clicked close'],
  onEnd: ['printlog', 'end']
};
