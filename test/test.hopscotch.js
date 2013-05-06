/* globals describe:false */
/* globals it:false */
/* globals hopscotch:false */
/* globals expect:false */
// This test suite assumes that the browser has document.querySelector.

var hasSessionStorage = typeof window.sessionStorage !== 'undefined',

clearState = function(name) {
  if (hasSessionStorage) {
    sessionStorage.removeItem(name);
  }
  else {
    this.setState(name,'',-1);
  }
},

setup = function() {
  clearState('hopscotch-test-tour');
};

setup();

describe('Hopscotch', function() {
  describe('#isActive', function() {
    it('should default to not active', function() {
      expect(hopscotch.isActive).to.not.be.ok();
    });
    it('should be active once a tour is started', function() {
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          orientation: 'bottom',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      expect(hopscotch.isActive).to.be.ok();
      hopscotch.endTour();
    });
  });
  describe('#startTour', function() {
    it('should create a div for the HopscotchBubble and append to the body', function() {
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          orientation: 'bottom',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      expect(document.querySelector('.hopscotch-bubble')).to.be.ok(); // does the bubble exist on the page?
      hopscotch.endTour();
    });
    it('should start the tour at the specified step when a step number is supplied as an argument', function() {
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'bottom',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            showSkip: true
          },
          {
            target: 'mocha',
            orientation: 'top',
            title: 'Mocha',
            content: 'It\'s Mocha'
          }
        ]
      }, 1);
      expect(hopscotch.getCurrStepNum()).to.be(1);
    });
    it('should throw an exception when trying to start the tour at a non-existent step', function() {
      try {
        hopscotch.startTour({
          id: 'hopscotch-test-tour',
          steps: [
            {
              target: 'shopping-list',
              orientation: 'bottom',
              title: 'Shopping List',
              content: 'It\'s a shopping list',
              showSkip: true
            }
          ]
        }, 10);
      }
      catch (e) {
        expect(true).to.be.ok();
        hopscotch.endTour();
        return;
      }
      expect(false).to.be.ok();
      hopscotch.endTour();
    });
  });
  describe('#endTour', function() {
    it('should set the isActive flag to false', function() {
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          orientation: 'bottom',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      expect(hopscotch.isActive).to.be.ok();
      hopscotch.endTour();
      expect(hopscotch.isActive).to.not.be.ok();
    });
    it('should hide the hopscotch bubble', function() {
      var el,
          classes;
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          orientation: 'bottom',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      el = document.querySelector('.hopscotch-bubble');
      expect(el).to.be.ok();
      classes = ' ' + el.className + ' ';
      expect(classes.indexOf(' hide ')).to.be(-1); // should not be hidden
      hopscotch.endTour();
      classes = ' ' + el.className + ' ';
      expect(classes.indexOf(' hide ')).to.be.greaterThan(-1); // should be hidden
    });
  });
  describe('#showStep', function() {
    it('should show the given step when showStep() is called', function() {
      var content;
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'bottom',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            orientation: 'bottom',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'mocha',
            orientation: 'top',
            title: 'Mocha',
            content: 'It\'s Mocha'
          }
        ]
      });
      hopscotch.showStep(2);
      expect(hopscotch.getCurrStepNum()).to.be(2);
      content = document.querySelector('.hopscotch-bubble-content p').innerHTML;
      expect(content).to.be('It\'s Mocha');
      hopscotch.endTour();
    });
  });
  //describe('#configure', function() {
    //it('should set options passed in to configure()', function() {
    //});
  //});
});

/**
 * While not directly controlled, properties of the Hopscotch Bubble are controlled by Hopscotch step options.
 * These are specified in the tour definition.
 */
describe('HopscotchBubble', function() {
  describe('Title and Content', function() {
    it('should show the Title of the step', function() {
      var title;
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          orientation: 'bottom',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      title = document.querySelector('.hopscotch-bubble-content h3').innerHTML;
      expect(title).to.be('Shopping List');
    });
    it('should show the Content of the step', function() {
      var content;
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          orientation: 'bottom',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      content = document.querySelector('.hopscotch-bubble-content p').innerHTML;
      expect(content).to.be('It\'s a shopping list');
      hopscotch.endTour();
    });
  });
  describe('Buttons', function() {
    it('should show Skip button when specified', function() {
      var nextBtnEl;

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'bottom',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            showSkip: true
          },
          {
            target: 'mocha',
            orientation: 'top',
            title: 'Mocha',
            content: 'It\'s Mocha'
          }
        ]
      });
      nextBtnEl = document.getElementById('hopscotch-next');
      expect(nextBtnEl).to.be.ok();
      expect(nextBtnEl.innerHTML).to.be('Skip');
      hopscotch.endTour();
    });
    it('should show Done button on the last step', function() {
      var tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'bottom',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            showSkip: true
          },
          {
            target: 'mocha',
            orientation: 'top',
            title: 'Mocha',
            content: 'It\'s Mocha'
          }
        ]
      },
      doneBtnEl;

      hopscotch.startTour(tour);
      hopscotch.nextStep();
      doneBtnEl = document.getElementById('hopscotch-done');
      expect(doneBtnEl).to.be.ok();
      expect(doneBtnEl.innerHTML).to.be('Done');
      hopscotch.endTour();
    });
    it('should hide Previous button when specified', function() {
      var prevBtnEl,
      classes,
      tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'bottom',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            showPrevBtn: false
          }
        ]
      };

      hopscotch.startTour(tour);
      prevBtnEl = document.getElementById('hopscotch-prev');
      classes = ' ' + prevBtnEl.className + ' ';
      expect(classes.indexOf(' hide ')).to.be.greaterThan(-1);
      hopscotch.endTour();
    });
    it('should hide Next button when specified', function() {
      var nextBtnEl,
      classes,
      tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'bottom',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            showNextBtn: false
          }
        ]
      };

      hopscotch.startTour(tour);
      nextBtnEl = document.getElementById('hopscotch-next');
      classes = ' ' + nextBtnEl.className + ' ';
      expect(classes.indexOf(' hide ')).to.be.greaterThan(-1);
      hopscotch.endTour();
    });
  });
  describe('Callbacks', function() {
    it('should invoke onNext callback of current step when going to the next step', function() {
      var classes,
      origBodyClass = document.body.className,
      testClassName = 'testingOnNext',
      tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'bottom',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            onNext: function() {
              document.body.className = testClassName;
            }
          },
          {
            target: 'mocha',
            orientation: 'top',
            title: 'Mocha',
            content: 'It\'s Mocha'
          }
        ]
      };

      hopscotch.startTour(tour);
      hopscotch.nextStep();
      classes = ' ' + document.body.className + ' ';
      expect(classes.indexOf(' ' + testClassName + ' ')).to.be.greaterThan(-1);
      hopscotch.endTour();
      document.body.className = origBodyClass;
    });
    it('should invoke onPrev callback of current step when going to the prev step', function() {
      var classes,
      origBodyClass = document.body.className,
      testClassName = 'testingOnPrev',
      tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'bottom',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'mocha',
            orientation: 'top',
            title: 'Mocha',
            content: 'It\'s Mocha',
            onPrev: function() {
              document.body.className = testClassName;
            }
          }
        ]
      };

      hopscotch.startTour(tour, 1);
      hopscotch.prevStep();
      classes = ' ' + document.body.className + ' ';
      expect(classes.indexOf(' ' + testClassName + ' ')).to.be.greaterThan(-1);
      hopscotch.endTour();
      document.body.className = origBodyClass;
    });
  });
});
