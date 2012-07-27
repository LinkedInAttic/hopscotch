var tour = {
      id: 'hello-hopscotch',
      steps: [
        {
          title: 'Welcome to the Hopscotch Demo Page!',
          content: 'Hey there! Welcome to the Hopscotch Demo Page! Please excuse our dust; this is still a work in progress. To proceed, click the next button below. (And as you do, watch the title of the page turn red!!!)',
          targetId: 'subheading',
          orientation: 'bottom',
          arrowOffset: 30,
          nextCallback: function() {
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
          prevCallback: function() {
            document.getElementById('pageTitle').style.color = '#000';
          }
        },
        {
          title: 'Multi-page test',
          content: 'Are you ready? We\'re going to try hopping to another page and then back!!! Where we\'re going, we won\'t need roads... (Please click this link.)',
          targetId: 'secpagelink',
          orientation: 'bottom',
          showNextBtn: false,
          multiPage: true,
        },
        {
          title: 'Multi-page test continued',
          content: 'We made it!! Please click this link to return to the first page.',
          targetId: 'firstpagelink',
          orientation: 'bottom',
          showNextBtn: false,
          showPrevBtn: false,
          multiPage: true // this indicates that next step will be on a different page
        },
        {
          title: 'Spider-man',
          content: 'Here are some window cleaners dressed as Spider-man. Did you see the new Spider-man movie? It was pretty awesome, especially the part where Spider-man is fighting the Lizard on the bridge. I\'m pretty sure it\'s still showing. Why don\'t you <a href="http://www.fandango.com/theamazingspiderman_126975/movieoverview" target="_new">buy some tickets</a>?',
          targetId: 'spiderman',
          orientation: 'bottom',
          width: 500,
          xOffset: -50,
          arrowOffset: 400,
          showPrevBtn: false
        },
        {
          title: 'Python decorator',
          content: 'Whoa, did you notice that the page just scrolled? If you didn\'t, you aren\'t very observant. (Or you have a very tall monitor)',
          targetId: 'python',
          orientation: 'top',
          xOffset: 200
        },
        {
          title: 'Mission district',
          content: 'Some sort of sound heat map in the mission? Did you notice that this bubble isn\'t completely aligned with this image? That\'s because I\'m using xOffset and yOffset options, which are available if you need to make slight positioning adjustments! Hopscotch has never been more fun!',
          targetId: 'mission',
          orientation: 'top',
          xOffset: 100,
          arrowOffset: 100
        }
      ],
      animate: false,
      //smoothScroll: false,
      //showCloseButton: false,
      showPrevButton: true,
      showNextButton: true,
      arrowWidth: 20,
      scrollDuration: 500
    };
