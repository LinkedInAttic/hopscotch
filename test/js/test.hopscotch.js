/* globals describe:false */
/* globals it:false */
/* globals hopscotch:false */
/* globals expect:false */
// This test suite assumes that the browser has document.querySelector.

var hasSessionStorage = typeof window.sessionStorage !== 'undefined',

$body = $(document.body),

setState = function(name,value,days) {
  var expires = '',
      date;

  if (hasSessionStorage) {
    sessionStorage.setItem(name, value);
  }
  else {
    if (days) {
      date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      expires = '; expires='+date.toGMTString();
    }
    document.cookie = name+'='+value+expires+'; path=/';
  }
},

getState = function(name) {
  var nameEQ,
      ca,
      i,
      c,
      state;

  if (hasSessionStorage) {
    state = sessionStorage.getItem(name);
  }
  else {
    nameEQ = name + '=';
    ca = document.cookie.split(';');
    for(i=0;i < ca.length;i++) {
      c = ca[i];
      while (c.charAt(0)===' ') {c = c.substring(1,c.length);}
      if (c.indexOf(nameEQ) === 0) {
        state = c.substring(nameEQ.length,c.length);
        break;
      }
    }
  }

  return state;
},

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

//similar to $('.el').click(), but actually works in phantomjs
//http://stackoverflow.com/questions/23981467/phantomjs-click-not-working
click = function(el){
  var ev = document.createEvent("MouseEvent");
  ev.initMouseEvent(
    "click",
    true /* bubble */, true /* cancelable */,
    window, null,
    0, 0, 0, 0, /* coordinates */
    false, false, false, false, /* modifier keys */
    0 /*left*/, null
  );
  el.dispatchEvent(ev);
};

// ==========================
// BEGIN TESTS
// ==========================

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
          orientation: 'left',
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
          orientation: 'left',
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
            orientation: 'left',
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
              orientation: 'left',
              title: 'Shopping List',
              content: 'It\'s a shopping list'
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

    it('should be possible to destroy and recreate target elements and rerun a tour', function(){
      var tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'dynamic-target',
            orientation: 'left',
            title: 'Dynamic target',
            content: 'It comes and goes, talking of Michelangelo'
          },
        ]
      };

      hopscotch.startTour(tour);
      expect(hopscotch.isActive).to.not.be.ok();
      hopscotch.endTour();

      $("body").append("<div id='dynamic-target'></div>");
      hopscotch.startTour(tour);
      expect(hopscotch.isActive).to.be.ok();
      hopscotch.endTour();

      $("#dynamic-target").remove();
      hopscotch.startTour(tour);
      expect(hopscotch.isActive).to.not.be.ok();
      hopscotch.endTour();

      $("body").append("<div id='dynamic-target'></div>");
      hopscotch.startTour(tour);
      expect(hopscotch.isActive).to.be.ok();
      hopscotch.endTour();

      $("#dynamic-target").remove();
    });
  });

  describe('#endTour', function() {
    it('should set the isActive flag to false', function() {
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          orientation: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      expect(hopscotch.isActive).to.be.ok();
      hopscotch.endTour();
      expect(hopscotch.isActive).to.not.be.ok();
    });

    it('should hide the hopscotch bubble', function() {
      var $el;
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          orientation: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      $el = $('.hopscotch-bubble');
      expect($el.length).to.be.ok();
      expect($el.hasClass('hide')).to.not.be.ok(); // should not be hidden
      hopscotch.endTour();
      expect($el.hasClass('hide')).to.be.ok(); // should be hidden
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
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            orientation: 'left',
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
      content = $('.hopscotch-bubble-content .hopscotch-content').html();
      expect(content).to.be('It\'s Mocha');
      hopscotch.endTour();
    });
  });

  describe('Tour Options', function() {
    it('should use bubbleWidth passed into tour definition', function() {
      var el;

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          orientation: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ],
        bubbleWidth: 888
      });
      el = document.querySelector('.hopscotch-bubble-container');
      expect(parseInt(el.style.width, 10)).to.be(888);
      hopscotch.endTour();
    });

    it('should use bubblePadding passed into tour definition', function() {
      var el;

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          orientation: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ],
        bubblePadding: 8
      });
      el = document.querySelector('.hopscotch-bubble-container');
      expect(parseInt(el.style.padding, 10)).to.be(8);
      hopscotch.endTour();
    });

    it('should show the Close (X) button by default', function() {
      var $el;

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          orientation: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      $el = $('.hopscotch-bubble-close');
      expect($el.length).to.be(1);
      expect($el.hasClass('hide-all')).to.not.be.ok();
      expect($el.hasClass('hide')).to.not.be.ok();
      hopscotch.endTour();
    });

    it('should hide the Close (X) button if specified', function() {
      var $el;

      hopscotch.configure({
        showCloseButton: false
      });
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          orientation: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      $el = $('.hopscotch-bubble-close');
      expect($el.length).to.be(0);
      hopscotch.endTour();
    });

    it('should hide the Previous button by default', function() {
      var $el;

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ]
      }, 1);
      $el = $('.hopscotch-prev');
      expect($el.length).to.be(0);
      hopscotch.endTour();
    });

    it('should show the Previous button if specified', function() {
      var $el;

      hopscotch.configure({
        showPrevButton: true
      });
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ]
      }, 1);
      $el = $('.hopscotch-prev');
      expect($el.length).to.be(1);
      hopscotch.endTour();
    });

    it('should hide the Previous button on the first step, even if showPrevButton is specified', function() {
      var $el;

      hopscotch.configure({
        showPrevButton: true
      });
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ]
      });
      $el = $('.hopscotch-prev');
      expect($el.length).to.be(0);
      hopscotch.endTour();
    });

    it('should show the Next button by default', function() {
      var $el;

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ]
      });
      $el = $('.hopscotch-next');
      expect($el.length).to.be(1);
      hopscotch.endTour();
    });

    it('should hide the Next button if specified', function() {
      var $el;

      hopscotch.configure({
        showNextButton: false
      });
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ]
      });
      $el = $('.hopscotch-next');
      expect($el.length).to.be(0);
      hopscotch.endTour();
    });

    it('last step of tour should use Done label for next button', function() {
      var $el;

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ]
      }, 1);
      $el = $('.hopscotch-next');
      expect($el.html()).to.be('Done');
      hopscotch.endTour();
    });

    it('should skip to the next step if the target element for the current step doesn\'t exist', function() {
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'nonexistent',
            orientation: 'left',
            title: 'This target shouldn\'t exist',
            content: 'If it does, then I\'ve made a huge mistake.'
          },
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ]
      });
      expect(hopscotch.isActive).to.be.ok();
      expect(hopscotch.getCurrStepNum()).to.be(1);
      hopscotch.endTour();
    });

    it('should not skip to the next step if the target element if skipIfNoElement is set to false', function() {
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'nonexistent',
            orientation: 'left',
            title: 'This target shouldn\'t exist',
            content: 'If it does, then I\'ve made a huge mistake.'
          },
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ],
        skipIfNoElement: false
      });
      expect(hopscotch.isActive).to.not.be.ok();
      hopscotch.endTour();
    });

    it('supports arbitrary selectors as targets', function() {
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'div#shopping-list li[id]',
            orientation: 'left',
            title: 'Shopping List Item',
            content: 'It\'s a thing on my shopping list'
          }
        ]
      });
      expect(hopscotch.isActive).to.be.ok();
      hopscotch.endTour();
    });

    it('should use the i18n strings provided in calls to configure()', function() {
      hopscotch.configure({
        i18n: {
          nextBtn: 'n',
          prevBtn: 'p',
          skipBtn: 's',
          doneBtn: 'd',
          stepNums: [ 'one', 'two', 'three' ]
        }
      });
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ],
        showPrevButton: true
      });

      expect($('.hopscotch-next').html()).to.be('n');
      expect($('.hopscotch-bubble-number').html()).to.be('one');
      hopscotch.nextStep();
      expect($('.hopscotch-prev').html()).to.be('p');
      expect($('.hopscotch-next').html()).to.be('d');
      expect($('.hopscotch-bubble-number').html()).to.be('two');
      hopscotch.endTour();
      hopscotch.resetDefaultI18N();
    });

    it('should flip right via the isRtl property', function(){
      var mgr = hopscotch.getCalloutManager(),
          callout,
          ltrPosition = 'left',
          flippedPosition = 'right';

      callout = mgr.createCallout({
        id: 'shopping-callout',
        target: 'shopping-list',
        orientation: ltrPosition,
        title: 'Shopping List Callout',
        content: 'It\'s a shopping list',
        isRtl: true
      });

      expect(callout.placement).to.be(flippedPosition);
      //Callout arrow should be flipped to the opposite of the flipped position,
      //which is equal to the original LTR position that is passed in
      expect($('.hopscotch-bubble-arrow-container').hasClass(ltrPosition)).to.be(true);
      mgr.removeCallout('shopping-callout');
    });

    it('should flip left via the isRtl property', function(){
      var mgr = hopscotch.getCalloutManager(),
          callout,
          ltrPosition = 'right',
          flippedPosition = 'left';

      callout = mgr.createCallout({
        id: 'shopping-callout',
        target: 'shopping-list',
        orientation: ltrPosition,
        title: 'Shopping List Callout',
        content: 'It\'s a shopping list',
        isRtl: true
      });

      expect(callout.placement).to.be(flippedPosition);
      //Callout arrow should be flipped to the opposite of the flipped position,
      //which is equal to the original LTR position that is passed in
      expect($('.hopscotch-bubble-arrow-container').hasClass(ltrPosition)).to.be(true);
      mgr.removeCallout('shopping-callout');
    });

    it('should allow isRtl to be set on a tour config', function(){
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        isRtl: true,
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            orientation: 'right',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ],
        showPrevButton: true
      });

      expect($('.hopscotch-bubble-arrow-container').hasClass('left')).to.be(true);
      hopscotch.nextStep();
      expect($('.hopscotch-bubble-arrow-container').hasClass('right')).to.be(true);
      hopscotch.endTour();
      hopscotch.resetDefaultI18N();

    });

    it('should allow individual steps to override tour isRtl option', function(){
      var ltrPosition = 'left',
          flippedPosition = 'right';

      hopscotch.configure({
        i18n: {
          nextBtn: 'n',
          prevBtn: 'p',
          skipBtn: 's',
          doneBtn: 'd',
          stepNums: [ 'one', 'two']
        }
      });
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        isRtl: true,
        steps: [
          {
            target: 'shopping-list',
            orientation: ltrPosition,
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            isRtl: true
          },
          {
            target: 'shopping-list',
            orientation: ltrPosition,
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            isRtl: false
          }
        ],
        showPrevButton: true
      });

      expect($('.hopscotch-bubble-arrow-container').hasClass(ltrPosition)).to.be(true);
      hopscotch.nextStep();
      expect($('.hopscotch-bubble-arrow-container').hasClass(flippedPosition)).to.be(true);
      hopscotch.endTour();
      hopscotch.resetDefaultI18N();

    });

    it('should allow isRtl to be set on configure', function(){
      hopscotch.configure({
        isRtl: true
      });
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            orientation: 'right',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ],
        showPrevButton: true
      });

      expect($('.hopscotch-bubble-arrow-container').hasClass('left')).to.be(true);
      hopscotch.nextStep();
      expect($('.hopscotch-bubble-arrow-container').hasClass('right')).to.be(true);
      hopscotch.endTour();
    });

    it('should move to next step when nextOnTargetClick is true and user clicks on target element', function() {
      var breadEl = $('#bread')[0],
        milkEl = $('#milk')[0];

      hopscotch.startTour({
        id: 'hopscotch-test-tour-nextOnTargetClick',
        steps: [
          {
            target: 'bread',
            orientation: 'left',
            title: 'Bread bread bread!',
            content: 'Gotta get me some bread',
            nextOnTargetClick: true
          },
          {
            target: 'eggs',
            orientation: 'left',
            title: 'Eggs',
            content: 'I need to buy some eggs'
          },
          {
            target: 'milk',
            orientation: 'left',
            title: 'Milk',
            content: 'I need to buy milk as well',
            nextOnTargetClick: true
          }
        ]
      }, 0);

      expect(hopscotch.getCurrStepNum()).to.be(0);

      //click the first step's target to move to next step
      click(breadEl);
      expect(hopscotch.getCurrStepNum()).to.be(1);

      //the event handler for click event should have been removed in the previous step
      //so tour should not continue to the next step when first step's target is clicked again
      click(breadEl);
      expect(hopscotch.getCurrStepNum()).to.be(1);

      //move to the 3rd step and then back to 2nd
      hopscotch.nextStep();
      hopscotch.prevStep();

      //on click event handler should have been removed from 3rd step's target when tour moved back
      //to 2nd step, so clicking on 3rd step's target should not move the tour forward
      click(milkEl);
      expect(hopscotch.getCurrStepNum()).to.be(1);

      //go to the 3rd step, then show 1st step
      hopscotch.nextStep();
      hopscotch.showStep(0);

      //when tour jumps to a different step using showStepAPI
      //onclick event handler should be removed from current step's target
      //so clicking on milk element should not move to next step
      click(milkEl);
      expect(hopscotch.getCurrStepNum()).to.be(0);

      //clicking first step's target element while we are on first step in a tour
      //should move to the next step
      click(breadEl);
      expect(hopscotch.getCurrStepNum()).to.be(1);

      //go to first step
      hopscotch.prevStep();

      //end the tour
      hopscotch.endTour();

      //on click event handler should be removed when tour is ended
      //clicking on target el should not do anything
      click(breadEl);
    });
  });

  describe('Saving state', function() {
    it('should create state in either sessionStorage or cookie once tour is started', function() {
      expect(getState('hopscotch.tour.state')).to.not.be.ok();
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          orientation: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      expect(getState('hopscotch.tour.state')).to.be('hopscotch-test-tour:0');
      hopscotch.endTour();
    });

    it('should use the cookie/sessionStorage name provided in calls to configure()', function() {
      hopscotch.configure({
        cookieName: 'tourstate'
      });
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ],
        showPrevButton: true
      });
      expect(getState('tourstate')).to.be('hopscotch-test-tour:0');
      hopscotch.endTour();
      hopscotch.resetDefaultOptions();
    });

    it('should detect state when starting a tour and begin the tour on the specified step', function() {
      setState('hopscotch.tour.state', 'hopscotch-test-tour:1');
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ],
        skipIfNoElement: false
      });
      expect(hopscotch.getCurrStepNum()).to.be(1);
      hopscotch.endTour();
    });
  });

  describe('#refreshBubblePosition', function() {
    it('recalculates the position of the bubble after moving the element', function() {
      hopscotch.startTour({
        id: 'hopscotch-test-refresh-bubble-position',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ]
      });

      var bubbleDomElement = document.querySelector('.hopscotch-bubble');
      var bubbleTop = bubbleDomElement.style['top'];
      var bubbleLeft = bubbleDomElement.style['left'];

      document.getElementById('shopping-list').style.setProperty('margin-top', '100px');
      document.getElementById('shopping-list').style.setProperty('margin-left', '100px');

      hopscotch.refreshBubblePosition();

      expect(bubbleDomElement.style['top']).to.not.eql(bubbleTop);
      expect(bubbleDomElement.style['left']).to.not.eql(bubbleLeft);
      hopscotch.endTour();

      document.getElementById('shopping-list').style.setProperty('margin-top', null);
      document.getElementById('shopping-list').style.setProperty('margin-left', null);
    });

    it('also runs recalculations for individual callouts', function() {
      hopscotch.getCalloutManager().createCallout({
        id: 'test_callout',
        orientation: 'left',
        target: 'shopping-list',
        title: 'Shopping List',
        content: 'It\'s a shopping list'
      });

      var bubbleDomElement = document.querySelector('.hopscotch-callout');
      var bubbleTop = bubbleDomElement.style['top'];
      var bubbleLeft = bubbleDomElement.style['left'];

      document.getElementById('shopping-list').style.setProperty('margin-top', '100px');
      document.getElementById('shopping-list').style.setProperty('margin-left', '100px');

      hopscotch.refreshBubblePosition();

      expect(bubbleDomElement.style['top']).to.not.eql(bubbleTop);
      expect(bubbleDomElement.style['left']).to.not.eql(bubbleLeft);
      hopscotch.getCalloutManager().removeAllCallouts();

      document.getElementById('shopping-list').style.setProperty('margin-top', null);
      document.getElementById('shopping-list').style.setProperty('margin-left', null);
    });
  });

  describe('Custom render methods', function(){
    var mockTour = {
          id: 'hopscotch-test-tour',
          steps: [
            {
              target: 'shopping-list',
              orientation: 'left',
              title: 'Shopping List',
              content: 'It\'s a shopping list'
            },
            {
              target: 'shopping-list',
              orientation: 'left',
              title: 'Shopping List',
              content: 'It\'s a shopping list'
            }
          ],
          skipIfNoElement: false
        },
        mockCallout = {
          id: 'shopping-callout',
          target: 'shopping-list',
          orientation: 'left',
          title: 'Shopping List Callout',
          content: 'It\'s a shopping list'
        },
        renderMethod = sinon.stub().returns('<h1>Content!</h1><div class="hopscotch-arrow"></div>');

    before(function(){
      sinon.spy(hopscotch.templates, 'bubble_default');
      hopscotch.templates.customTemplate = sinon.stub().returns('<h1>Content!</h1><div class="hopscotch-arrow"></div>');
    });

    afterEach(function(){
      hopscotch.endTour();
      hopscotch.getCalloutManager().removeAllCallouts();
      hopscotch.templates.bubble_default.reset();
      hopscotch.templates.customTemplate.reset();
      renderMethod.reset();
      hopscotch.setRenderer('bubble_default');
    });

    after(function(){
      delete hopscotch.templates.customTemplate;
      hopscotch.templates.bubble_default.restore();
    });

    it('setRenderer() should allow setting a global renderer within the hopscotch.templates namespace', function(){
      hopscotch.setRenderer('customTemplate');

      hopscotch.startTour(mockTour);
      expect(hopscotch.templates.customTemplate.calledOnce).to.be.ok();
      expect(renderMethod.calledOnce).to.not.be.ok();
      expect(hopscotch.templates.bubble_default.calledOnce).to.not.be.ok();

      hopscotch.endTour();
      hopscotch.templates.customTemplate.reset();

      hopscotch.getCalloutManager().createCallout(mockCallout);
      expect(hopscotch.templates.customTemplate.calledOnce).to.be.ok();
      expect(renderMethod.calledOnce).to.not.be.ok();
      expect(hopscotch.templates.bubble_default.calledOnce).to.not.be.ok();
    });

    it('setRenderer() should allow setting a global custom render method', function(){
      hopscotch.setRenderer(renderMethod);
      hopscotch.startTour(mockTour);

      expect(renderMethod.calledOnce).to.be.ok();
      expect(hopscotch.templates.customTemplate.calledOnce).to.not.be.ok();
      expect(hopscotch.templates.bubble_default.calledOnce).to.not.be.ok();

      hopscotch.endTour();
      renderMethod.reset();

      hopscotch.getCalloutManager().createCallout(mockCallout);
      expect(renderMethod.calledOnce).to.be.ok();
      expect(hopscotch.templates.customTemplate.calledOnce).to.not.be.ok();
      expect(hopscotch.templates.bubble_default.calledOnce).to.not.be.ok();
    });

    it('Should accept a custom renderer in hopscotch.templates set via tour config', function(){
      var augmentedData = $.extend({}, mockTour, {customRenderer: 'customTemplate'});
      hopscotch.startTour(augmentedData);

      expect(hopscotch.templates.customTemplate.calledOnce).to.be.ok();
      expect(renderMethod.calledOnce).to.not.be.ok();
      expect(hopscotch.templates.bubble_default.calledOnce).to.not.be.ok();
    });

    it('Should accept a custom renderer method set via tour config', function(){
      var augmentedData = $.extend({}, mockTour, {customRenderer: renderMethod});
      hopscotch.startTour(augmentedData);

      expect(renderMethod.calledOnce).to.be.ok();
      expect(hopscotch.templates.customTemplate.calledOnce).to.not.be.ok();
      expect(hopscotch.templates.bubble_default.calledOnce).to.not.be.ok();
    });

    it('Should accept a custom renderer in hopscotch.templates set via new callout config', function(){
      var augmentedData = $.extend({}, mockCallout, {customRenderer: 'customTemplate'});
      hopscotch.getCalloutManager().createCallout(augmentedData);

      expect(hopscotch.templates.customTemplate.calledOnce).to.be.ok();
      expect(renderMethod.calledOnce).to.not.be.ok();
      expect(hopscotch.templates.bubble_default.calledOnce).to.not.be.ok();
    });

    it('Should accept a custom renderer method set via new callout config', function(){
      var augmentedData = $.extend({}, mockCallout, {customRenderer: renderMethod});
      hopscotch.getCalloutManager().createCallout(augmentedData);

      expect(renderMethod.calledOnce).to.be.ok();
      expect(hopscotch.templates.customTemplate.calledOnce).to.not.be.ok();
      expect(hopscotch.templates.bubble_default.calledOnce).to.not.be.ok();
    });

    it('Render methods should receive custom data from tours', function(){
      var augmentedData = $.extend({}, mockTour, {customData: {foo: 'bar'}}),
          callArgs;
      $.extend(augmentedData.steps[0], {customData: {stepSpecific: 'data'}});

      hopscotch.startTour(augmentedData);
      expect(hopscotch.templates.bubble_default.calledOnce).to.be.ok();

      callArgs = hopscotch.templates.bubble_default.args[0][0];
      expect(callArgs.tour.customData.foo).to.be('bar');
      expect(callArgs.step.customData.stepSpecific).to.be('data');
    });

    it('Render methods should receive custom data from callouts', function(){
      var augmentedData = $.extend({}, mockCallout, {customData: {foo: 'bar'}}),
          callArgs;

      hopscotch.getCalloutManager().createCallout(augmentedData);
      expect(hopscotch.templates.bubble_default.calledOnce).to.be.ok();

      callArgs = hopscotch.templates.bubble_default.args[0][0];
      expect(callArgs.tour.customData.foo).to.be('bar');
      expect(callArgs.step.customData.foo).to.be('bar');
    });

    it('Render methods should receive the unsafe flag when set', function(){
      var augmentedData = $.extend({}, mockTour, {unsafe: true}),
          callArgs;

      hopscotch.startTour(augmentedData);
      expect(hopscotch.templates.bubble_default.calledOnce).to.be.ok();

      callArgs = hopscotch.templates.bubble_default.args[0][0];
      expect(callArgs.tour.unsafe).to.be(true);
    });

    it('Should be able to override default escaping method using setEscaper()', function(){
      var augmentedData = $.extend({}, mockTour, {unsafe: true}),
          customEscaper = sinon.stub().returnsArg(0);

      hopscotch.setEscaper(customEscaper);
      hopscotch.startTour(augmentedData);
      expect(hopscotch.templates.bubble_default.calledOnce).to.be.ok();

      expect(customEscaper.calledTwice).to.be.ok();
    });
  });
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
          orientation: 'left',
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
          orientation: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      content = document.querySelector('.hopscotch-bubble-content .hopscotch-content').innerHTML;
      expect(content).to.be('It\'s a shopping list');
      hopscotch.endTour();
    });
  });

  describe('Step Number', function() {
    var stepContent = {
      shoppingList : 'It\'s a shopping list',
      eggs: 'It\'s eggs',
      milk: 'It\'s milk',
      dynamicTarget : 'If my target exists, it\'s super awesome!'
    };

    function getStepNumber() {
      return $(".hopscotch-bubble .hopscotch-bubble-number").text();
    }

    function getStepContent() {
      return $(".hopscotch-bubble .hopscotch-content").text();
    }

    function startTourWithMissingStepTarget() {
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        skipIfNoElement: true,
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: stepContent.shoppingList
          },
          {
            target: 'id-of-dynamically-created-element',
            orientation: 'left',
            title: 'My target is dynamic, it might or might not exist!',
            content: stepContent.dynamicTarget
          },
          {
            target: 'eggs',
            orientation: 'left',
            title: 'Eggs',
            content: stepContent.eggs
          },
          {
            target: 'another-target-that-does-not-exist',
            orientation: 'left',
            title: 'My target does not exist',
            content: 'My target isn\'t here'
          },
          {
            target: 'and-another-target-that-does-not-exist',
            orientation: 'left',
            title: 'My target can\'t be found...',
            content: 'Target, target, target!'
          },
          {
            target: 'milk',
            orientation: 'left',
            title: 'Milk!',
            content: stepContent.milk
          }
        ]
      });
    }

    it('should account for skipped steps in bubble numbering', function() {

      startTourWithMissingStepTarget();

      expect(getStepNumber()).to.be("1");
      expect(getStepContent()).to.be(stepContent.shoppingList);

      hopscotch.nextStep();
      expect(getStepNumber()).to.be("2");
      expect(getStepContent()).to.be(stepContent.eggs);

      hopscotch.nextStep();
      expect(getStepNumber()).to.be("3");
      expect(getStepContent()).to.be(stepContent.milk);

      hopscotch.prevStep();
      expect(getStepNumber()).to.be("2");
      expect(getStepContent()).to.be(stepContent.eggs);

      hopscotch.prevStep();
      expect(getStepNumber()).to.be("1");
      expect(getStepContent()).to.be(stepContent.shoppingList);

      hopscotch.endTour();
    });

    it('should adjust step numbering when elements are dynamically created', function(){
      startTourWithMissingStepTarget();
      expect(getStepNumber()).to.be("1");
      expect(getStepContent()).to.be(stepContent.shoppingList);

      //will skip over 2nd tour step in config and move to 3rd step
      //since 2nd step was skipped, the bubble number for the 3rd step should be "2"
      hopscotch.nextStep();
      expect(getStepNumber()).to.be("2");
      expect(getStepContent()).to.be(stepContent.eggs);

      //create a missing target element for the 2nd tour step
      $('#shopping-list').append('<span id="id-of-dynamically-created-element">This is dynamically created element</span>')

      //now that target element for 2nd tour step exists, the bubble number should be "2"
      hopscotch.prevStep();
      expect(getStepNumber()).to.be("2");
      expect(getStepContent()).to.be(stepContent.dynamicTarget);

      hopscotch.prevStep();
      expect(getStepNumber()).to.be("1");
      expect(getStepContent()).to.be(stepContent.shoppingList);

      hopscotch.nextStep();
      expect(getStepNumber()).to.be("2");
      expect(getStepContent()).to.be(stepContent.dynamicTarget);

      //now that target element for 2nd tour step exists, the bubble number should be "3"
      hopscotch.nextStep();
      expect(getStepNumber()).to.be("3");
      expect(getStepContent()).to.be(stepContent.eggs);

      hopscotch.endTour();
      $('#id-of-dynamically-created-element').remove();
    });

    it('should not carry over skipped steps from one tour to another', function(){
      startTourWithMissingStepTarget();
      //skip 2nd, go to 3rd
      hopscotch.nextStep();
      //skip 4th and 5th, go to 6th
      hopscotch.nextStep();
      //end this tour
      hopscotch.endTour();

      //start 2nd tour to make sure that skipped steps from first tour
      //do not affect step numbering in a new tour
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        skipIfNoElement: true,
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: stepContent.shoppingList
          },
          {
            target: 'eggs',
            orientation: 'left',
            title: 'Eggs',
            content: stepContent.eggs
          },
          {
            target: 'milk',
            orientation: 'left',
            title: 'Milk!',
            content: stepContent.milk
          }
        ]
      });

      expect(getStepNumber()).to.be("1");
      expect(getStepContent()).to.be(stepContent.shoppingList);

      hopscotch.nextStep();
      expect(getStepNumber()).to.be("2");
      expect(getStepContent()).to.be(stepContent.eggs);

      hopscotch.nextStep();
      expect(getStepNumber()).to.be("3");
      expect(getStepContent()).to.be(stepContent.milk);

      hopscotch.endTour();
    });

    it('should detect state and begin the tour on the specified step accounting for skipped steps in step numbering', function() {

      //set state - on step 5 of hopscotch-test-tour with steps 1,3 and 4 skipped
      setState('hopscotch.tour.state', 'hopscotch-test-tour:5:1,3,4');

      startTourWithMissingStepTarget();

      expect(getStepNumber()).to.be("3");
      expect(getStepContent()).to.be(stepContent.milk);

      hopscotch.endTour();
    });
  });

  describe('z-index', function(){
    var bubble;
    it('should set z-index if provided', function(){
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          orientation: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list',
          zindex: 100
        },
        {
          target: 'shopping-list',
          orientation: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list',
          zindex: 0
        },
        {
          target: 'shopping-list',
          orientation: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        }]
      });
      bubble = document.querySelector('.hopscotch-bubble');
      expect(bubble.style.zIndex).to.be('100');

      hopscotch.nextStep();
      bubble = document.querySelector('.hopscotch-bubble');
      expect(bubble.style.zIndex).to.be('0');

      hopscotch.nextStep();
      bubble = document.querySelector('.hopscotch-bubble');
      expect(bubble.style.zIndex).to.be('');
      expect($(bubble).css("z-index")).to.be('999999');

      hopscotch.endTour();
    });
  });

  describe('Buttons', function() {
    it('should show Skip button when specified', function() {
      var $nextBtnEl;

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
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
      $nextBtnEl = $('.hopscotch-next');
      expect($nextBtnEl.length).to.be(1);
      expect($nextBtnEl.html()).to.be('Skip');
      hopscotch.endTour();
    });

    it('should hide Previous button when specified', function() {
      var $el,
      tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            showPrevBtn: false
          }
        ]
      };

      hopscotch.startTour(tour);
      $el = $('.hopscotch-prev');
      expect($el.length).to.be(0);
      hopscotch.endTour();
    });

    it('should hide Next button when specified', function() {
      var $el,
      tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            showNextButton: false
          }
        ]
      };

      hopscotch.startTour(tour);
      $el = $('.hopscotch-next');
      expect($el.length).to.be(0);
      hopscotch.endTour();
    });
  });

  describe('Callbacks', function() {
    it('should invoke onStart callback when starting the tour', function() {
      var testClassName = 'testingOnNext';

      expect($body.hasClass(testClassName)).to.not.be.ok();
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'mocha',
            orientation: 'top',
            title: 'Mocha',
            content: 'It\'s Mocha'
          }
        ],
        onStart: function() {
          $body.addClass(testClassName);
        }
      });
      expect($body.hasClass(testClassName)).to.be.ok();
      hopscotch.endTour();
      $body.removeClass(testClassName);
    });

    it('should invoke onNext callback of current step when going to the next step', function() {
      var testClassName = 'testingOnNext',
      tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            onNext: function() {
              $body.addClass(testClassName);
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

      expect($body.hasClass(testClassName)).to.not.be.ok();
      hopscotch.startTour(tour);
      hopscotch.nextStep();
      expect($body.hasClass(testClassName)).to.be.ok();
      hopscotch.endTour();
      $body.removeClass(testClassName);
    });

    it('should invoke onPrev callback of current step when going to the prev step', function() {
      var testClassName = 'testingOnPrev',
      tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'mocha',
            orientation: 'top',
            title: 'Mocha',
            content: 'It\'s Mocha',
            onPrev: function() {
              $body.addClass(testClassName);
            }
          }
        ]
      };

      expect($body.hasClass(testClassName)).to.not.be.ok();
      hopscotch.startTour(tour, 1);
      hopscotch.prevStep();
      expect($('body').hasClass(testClassName)).to.be.greaterThan(-1);
      hopscotch.endTour();
      $body.removeClass(testClassName);
    });

    it('should invoke onEnd callback of current step when ending the tour', function() {
      var testClassName = 'testingOnNext',
      tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ],
        onEnd: function() {
          $body.addClass(testClassName);
        }
      };

      expect($body.hasClass(testClassName)).to.not.be.ok();
      hopscotch.startTour(tour);
      hopscotch.endTour();
      expect($body.hasClass(testClassName)).to.be.ok();
      $body.removeClass(testClassName);
    });

    it('should detect when a callback changes the state of a tour and not go to the next step when detected', function() {
      var tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            onNext: function() {
              hopscotch.showStep(2);
            }
          },
          {
            target: 'milk',
            orientation: 'left',
            title: 'Milk',
            content: 'It\'s milk'
          },
          {
            target: 'eggs',
            orientation: 'left',
            title: 'Eggs',
            content: 'It\'s eggs'
          }
        ]
      };

      hopscotch.startTour(tour);
      hopscotch.nextStep();
      expect(hopscotch.getCurrStepNum()).to.be(2);
      hopscotch.endTour();
    });

    it('should invoke the CTA callback when the CTA button is clicked', function() {
      var testClassName = "testingCTAButton",
      tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            showCTAButton: true,
            ctaLabel: 'test',
            onCTA: function() {
              $body.addClass(testClassName);
            }
          }
        ]
      };

      expect($body.hasClass(testClassName)).to.not.be.ok();
      hopscotch.startTour(tour);
      $('.hopscotch-cta').click();
      expect($body.hasClass(testClassName)).to.be.ok();
      hopscotch.endTour(tour);
      $body.removeClass(testClassName);
    });

    it('should remove the CTA callback after advancing to the next step', function() {
      var testClassName1 = "testingCTAButton1",
      testClassName2 = "testingCTAButton2",
      tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            showCTAButton: true,
            ctaLabel: 'test',
            onCTA: function() {
              $body.addClass(testClassName1);
            }
          },
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            showCTAButton: true,
            ctaLabel: 'test',
            onCTA: function() {
              $body.addClass(testClassName2);
            }
          }
        ]
      };

      expect($body.hasClass(testClassName1)).to.not.be.ok();
      expect($body.hasClass(testClassName2)).to.not.be.ok();
      hopscotch.startTour(tour);
      hopscotch.nextStep();
      $('.hopscotch-cta').click();
      expect($body.hasClass(testClassName1)).to.not.be.ok();
      expect($body.hasClass(testClassName2)).to.be.ok();
      hopscotch.endTour(tour);
      $body.removeClass(testClassName1).removeClass(testClassName2);
    });

    it('should be able to invoke a callback that was registered as a helper', function() {
      var testClassName = 'testingOnNext',
          helperName = 'addClassToBody';

      hopscotch.registerHelper(helperName, function() {
        $body.addClass(testClassName);
      });
      expect($body.hasClass(testClassName)).to.not.be.ok();

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'mocha',
            orientation: 'top',
            title: 'Mocha',
            content: 'It\'s Mocha'
          }
        ],
        onStart: helperName
      });

      expect($body.hasClass(testClassName)).to.be.ok();
      hopscotch.endTour();
      $body.removeClass(testClassName);
      hopscotch.unregisterHelper(helperName);
    });

    it('should be able to invoke more than one helper callbacks', function() {
      var testClassName1 = 'testingOnNext1',
          testClassName2 = 'testingOnNext2',
          testClassName3 = 'testingOnNext3',
          helperName1    = 'addClassToBody1',
          helperName2    = 'addClassToBody2',
          helperName3    = 'addClassToBody3';

      hopscotch.registerHelper(helperName1, function() {
        $body.addClass(testClassName1);
      });
      hopscotch.registerHelper(helperName2, function() {
        $body.addClass(testClassName2);
      });
      hopscotch.registerHelper(helperName3, function() {
        $body.addClass(testClassName3);
      });

      expect($body.hasClass(testClassName1)).to.not.be.ok();
      expect($body.hasClass(testClassName2)).to.not.be.ok();
      expect($body.hasClass(testClassName3)).to.not.be.ok();

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'mocha',
            orientation: 'top',
            title: 'Mocha',
            content: 'It\'s Mocha'
          }
        ],
        onStart: [[helperName1], [helperName2], [helperName3]]
      });

      expect($body.hasClass(testClassName1)).to.be.ok();
      expect($body.hasClass(testClassName2)).to.be.ok();
      expect($body.hasClass(testClassName3)).to.be.ok();
      hopscotch.endTour();
      $body.removeClass(testClassName1)
           .removeClass(testClassName2)
           .removeClass(testClassName3);
      hopscotch.unregisterHelper(helperName1);
      hopscotch.unregisterHelper(helperName2);
      hopscotch.unregisterHelper(helperName3);
    });

    it('should be able to invoke a helper with arguments', function() {
      var testClassName = 'testingOnNext',
          helperName = 'addClassToBody';

      hopscotch.registerHelper(helperName, function(className) {
        $body.addClass(className);
      });

      expect($body.hasClass(testClassName)).to.not.be.ok();

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            orientation: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'mocha',
            orientation: 'top',
            title: 'Mocha',
            content: 'It\'s Mocha'
          }
        ],
        onStart: [helperName, testClassName]
      });

      expect($body.hasClass(testClassName)).to.be.ok();
      hopscotch.endTour();
      $body.removeClass(testClassName);
      hopscotch.unregisterHelper(helperName);
    });
  });
});

describe('HopscotchCalloutManager', function() {
  describe('CalloutManager', function() {
    it('should create no more than one instance of the callout manager', function() {
      var mgr = hopscotch.getCalloutManager();
      expect(mgr).to.be(hopscotch.getCalloutManager());
    });
    it('should create a callout using createCallout() and remove it with removeCallout()', function() {
      var mgr = hopscotch.getCalloutManager(),
          $el;

      mgr.createCallout({
        id: 'shopping-callout',
        target: 'shopping-list',
        orientation: 'left',
        title: 'Shopping List Callout',
        content: 'It\'s a shopping list'
      });

      $el = $('.hopscotch-bubble.hopscotch-callout');
      expect($el.length).to.be(1);
      expect($el.html().indexOf('Shopping List Callout')).to.be.greaterThan(-1);
      mgr.removeCallout('shopping-callout');
      expect($('.hopscotch-bubble.hopscotch-callout').length).to.be(0);
    });
    it('should remove all callouts using removeAllCallouts()', function() {
      var mgr = hopscotch.getCalloutManager(),
          callout;

      mgr.createCallout({
        id: 'shopping-callout',
        target: 'shopping-list',
        orientation: 'left',
        title: 'Shopping List Callout',
        content: 'It\'s a shopping list'
      });
      mgr.createCallout({
        id: 'shopping-callout2',
        target: 'shopping-list',
        orientation: 'left',
        title: 'Shopping List Callout',
        content: 'It\'s a shopping list'
      });
      mgr.createCallout({
        id: 'shopping-callout3',
        target: 'shopping-list',
        orientation: 'left',
        title: 'Shopping List Callout',
        content: 'It\'s a shopping list'
      });

      expect($('.hopscotch-bubble.hopscotch-callout').length).to.be(3);
      mgr.removeAllCallouts();
      expect($('.hopscotch-bubble.hopscotch-callout').length).to.be(0);
    });
    it('should return instance of HopscotchBubble using getCallout()', function() {
      var mgr = hopscotch.getCalloutManager(),
          callout;

      callout = mgr.createCallout({
        id: 'shopping-callout',
        target: 'shopping-list',
        orientation: 'left',
        title: 'Shopping List Callout',
        content: 'It\'s a shopping list'
      });

      // Test the existence of some known methods of HopscotchBubble
      expect(callout.render).to.be.ok();
      expect(callout.destroy).to.be.ok();
      expect(callout.setPosition).to.be.ok();
      mgr.removeCallout('shopping-callout');
    });
  });
});
