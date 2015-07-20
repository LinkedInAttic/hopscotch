/* globals describe:false */
/* globals it:false */
/* globals hopscotch:false */
/* globals expect:false */
// This test suite assumes that the browser has document.querySelector.

var hasSessionStorage = typeof window.sessionStorage !== 'undefined',

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

  $("body").append(
    '<style>#shopping-list { margin: 0 auto; width: 200px;}</style>' +
    '<div id="jasmine"></div>' +
    '<div id="shopping-list">' +
    '  <ul>' +
    '    <li>This is an example list for the sake of having some UI to point to.</li>' +
    '    <li id="milk">Milk</li>' +
    '    <li id="eggs">Eggs</li>' +
    '    <li id="lettuce">Lettuce</li>' +
    '    <li id="bread">Bread</li>' +
    '    <li id="yogurt">Yogurt</li>' +
    '  </ul>' +
    '</div>');
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
  afterEach(function() {
    hopscotch.endTour();
    hopscotch.getCalloutManager().removeAllCallouts();
  });

  describe('#isActive', function() {
    it('should default to not active', function() {
      expect(hopscotch.isActive).toBeFalsy();
    });

    it('should be active once a tour is started', function() {
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          placement: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      expect(hopscotch.isActive).toBeTruthy();
      hopscotch.endTour();
    });
  });

  describe('#startTour', function() {
    it('should create a div for the HopscotchBubble and append to the body', function() {
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          placement: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      expect(document.querySelector('.hopscotch-bubble')).toBeTruthy(); // does the bubble exist on the page?
      hopscotch.endTour();
    });

    it('should start the tour at the specified step when a step number is supplied as an argument', function() {
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'jasmine',
            placement: 'top',
            title: 'Jasmine',
            content: 'It\'s Jasmine'
          }
        ]
      }, 1);
      expect(hopscotch.getCurrStepNum()).toBe(1);
      hopscotch.endTour();
    });

    it('should complain if no tour data is passed in', function(){
      expect(function(){
        hopscotch.startTour();
      }).toThrow(new Error('Tour data is required for startTour.'));
    });

    it('should reject tour IDs that include invalid characters', function(){
      expect(function(){
        hopscotch.startTour({
          id: '(this is a bad tour id!)',
          steps: [
            {
              target: 'shopping-list',
              placement: 'left',
              title: 'Shopping List',
              content: 'It\'s a shopping list'
            }
          ]
        });
      }).toThrow(new Error('Tour ID is using an invalid format. Use alphanumeric, underscores, and/or hyphens only. First character must be a letter.'))

      hopscotch.endTour();
    });

    it('should throw an exception when trying to start the tour at a non-existent step', function() {
      expect(function(){
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
      }).toThrow(new Error('Specified step number out of bounds.'));

      hopscotch.endTour();
    });

    it('should be possible to destroy and recreate target elements and rerun a tour', function(){
      var tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'dynamic-target',
            placement: 'left',
            title: 'Dynamic target',
            content: 'It comes and goes, talking of Michelangelo'
          },
        ]
      };

      hopscotch.startTour(tour);
      expect(hopscotch.isActive).toBeFalsy();
      hopscotch.endTour();

      $("body").append("<div id='dynamic-target'></div>");
      hopscotch.startTour(tour);
      expect(hopscotch.isActive).toBeTruthy();
      hopscotch.endTour();

      $("#dynamic-target").remove();
      hopscotch.startTour(tour);
      expect(hopscotch.isActive).toBeFalsy();
      hopscotch.endTour();

      $("body").append("<div id='dynamic-target'></div>");
      hopscotch.startTour(tour);
      expect(hopscotch.isActive).toBeTruthy();
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
          placement: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      expect(hopscotch.isActive).toBeTruthy();
      hopscotch.endTour();
      expect(hopscotch.isActive).toBeFalsy();
    });

    it('should hide the hopscotch bubble', function() {
      var $el;
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          placement: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      $el = $('.hopscotch-bubble');
      expect($el.length).toBeTruthy();
      expect($el.hasClass('hide')).toBeFalsy(); // should not be hidden
      hopscotch.endTour();
      expect($el.hasClass('hide')).toBeTruthy(); // should be hidden
    });
  });

  describe('Can specify step target in multiple formats',function(){
    it('should show the given step when showStep() is called', function() {
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [{
          target: ['shopping-list-other', 'shopping-list'], //finds the first existing target 'shopping-list'
          placement: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        },
        {
          target: ['chocolate', 'almond-milk'] //neither of the targets exist - skips this step
        },
        {
          target: document.getElementById('lettuce'), //can pass in DOM element directly
          placement: 'left',
          title: 'Another Shopping List Item',
          content: 'It\'s lettuce'
        }]
      });
      expect(hopscotch.isActive).toBeTruthy();
      //'shopping-list-other' does not exists, should find target 'shopping-list' instead
      expect(hopscotch.getCurrTarget().id).toEqual('shopping-list');
      //go to next step with existing step target, should skip step 2
      hopscotch.nextStep();
      expect(hopscotch.getCurrTarget().id).toEqual('lettuce');

      hopscotch.endTour();
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
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'jasmine',
            placement: 'top',
            title: 'Jasmine',
            content: 'It\'s Jasmine'
          }
        ]
      });
      hopscotch.showStep(2);
      expect(hopscotch.getCurrStepNum()).toBe(2);
      content = $('.hopscotch-bubble-content .hopscotch-content').html();
      expect(content).toBe('It\'s Jasmine');
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
          placement: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ],
        bubbleWidth: 888
      });
      el = document.querySelector('.hopscotch-bubble-container');
      expect(parseInt(el.style.width, 10)).toBe(888);
      hopscotch.endTour();
    });

    it('should use bubblePadding passed into tour definition', function() {
      var el;

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          placement: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ],
        bubblePadding: 8
      });
      el = document.querySelector('.hopscotch-bubble-container');
      expect(parseInt(el.style.padding, 10)).toBe(8);
      hopscotch.endTour();
    });

    it('should show the Close (X) button by default', function() {
      var $el;

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          placement: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      $el = $('.hopscotch-bubble-close');
      expect($el.length).toBe(1);
      expect($el.hasClass('hide-all')).toBeFalsy();
      expect($el.hasClass('hide')).toBeFalsy();
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
          placement: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      $el = $('.hopscotch-bubble-close');
      expect($el.length).toBe(0);
      hopscotch.endTour();
    });

    it('should hide the Previous button by default', function() {
      var $el;

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ]
      }, 1);
      $el = $('.hopscotch-prev');
      expect($el.length).toBe(0);
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
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ]
      }, 1);
      $el = $('.hopscotch-prev');
      expect($el.length).toBe(1);
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
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ]
      });
      $el = $('.hopscotch-prev');
      expect($el.length).toBe(0);
      hopscotch.endTour();
    });

    it('should show the Next button by default', function() {
      var $el;

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ]
      });
      $el = $('.hopscotch-next');
      expect($el.length).toBe(1);
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
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ]
      });
      $el = $('.hopscotch-next');
      expect($el.length).toBe(0);
      hopscotch.endTour();
    });

    it('last step of tour should use Done label for next button', function() {
      var $el;

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ]
      }, 1);
      $el = $('.hopscotch-next');
      expect($el.html()).toBe('Done');
      hopscotch.endTour();
    });

    it('should skip to the next step if the target element for the current step doesn\'t exist', function() {
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'nonexistent',
            placement: 'left',
            title: 'This target shouldn\'t exist',
            content: 'If it does, then I\'ve made a huge mistake.'
          },
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ]
      });
      expect(hopscotch.isActive).toBeTruthy();
      expect(hopscotch.getCurrStepNum()).toBe(1);
      hopscotch.endTour();
    });

    it('should not skip to the next step if the target element if skipIfNoElement is set to false', function() {
      var tourConfig = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'nonexistent',
            placement: 'left',
            title: 'This target shouldn\'t exist',
            content: 'If it does, then I\'ve made a huge mistake.'
          },
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ],
        skipIfNoElement: false,
        onError: jasmine.createSpy('onErrorCallback')
      };

      hopscotch.startTour(tourConfig);

      expect(hopscotch.isActive).toBeFalsy();
      expect(tourConfig.onError).toHaveBeenCalled();

      hopscotch.endTour();
    });

    it('should invoke error callback if the target element is missing and skipIfNoElement is set to false', function() {
      var tourConfig = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'bread',
            placement: 'right',
            title: 'Item on a shopping list',
            content: 'It\'s bread!'
          },
          {
            target: 'nonexistent',
            placement: 'left',
            title: 'This target shouldn\'t exist',
            content: 'If it does, then I\'ve made a huge mistake.'
          },
          {
            target: 'lettuce',
            placement: 'top',
            title: 'Item on a shopping list',
            content: 'It\'s lettuce!'
          }
        ],
        skipIfNoElement: false,
        onError: jasmine.createSpy('onErrorCallback')
      };

      //step 1 - shopping list
      hopscotch.startTour(tourConfig);
      //bread
      hopscotch.nextStep();
      //nonexistent step
      hopscotch.nextStep();

      expect(hopscotch.isActive).toBeFalsy();
      expect(tourConfig.onError).toHaveBeenCalled();

      hopscotch.endTour();
    });

    it('supports arbitrary selectors as targets', function() {
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'div#shopping-list li[id]',
            placement: 'left',
            title: 'Shopping List Item',
            content: 'It\'s a thing on my shopping list'
          }
        ]
      });
      expect(hopscotch.isActive).toBeTruthy();
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
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ],
        showPrevButton: true
      });

      expect($('.hopscotch-next').html()).toBe('n');
      expect($('.hopscotch-bubble-number').html()).toBe('one');
      hopscotch.nextStep();
      expect($('.hopscotch-prev').html()).toBe('p');
      expect($('.hopscotch-next').html()).toBe('d');
      expect($('.hopscotch-bubble-number').html()).toBe('two');
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
        placement: ltrPosition,
        title: 'Shopping List Callout',
        content: 'It\'s a shopping list',
        isRtl: true
      });

      expect(callout.placement).toBe(flippedPosition);
      //Callout arrow should be flipped to the opposite of the flipped position,
      //which is equal to the original LTR position that is passed in
      expect($('.hopscotch-bubble-arrow-container').hasClass(ltrPosition)).toBe(true);
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
        placement: ltrPosition,
        title: 'Shopping List Callout',
        content: 'It\'s a shopping list',
        isRtl: true
      });

      expect(callout.placement).toBe(flippedPosition);
      //Callout arrow should be flipped to the opposite of the flipped position,
      //which is equal to the original LTR position that is passed in
      expect($('.hopscotch-bubble-arrow-container').hasClass(ltrPosition)).toBe(true);
      mgr.removeCallout('shopping-callout');
    });

    it('should allow isRtl to be set on a tour config', function(){
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        isRtl: true,
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            placement: 'right',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ],
        showPrevButton: true
      });

      expect($('.hopscotch-bubble-arrow-container').hasClass('left')).toBe(true);
      hopscotch.nextStep();
      expect($('.hopscotch-bubble-arrow-container').hasClass('right')).toBe(true);
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
            placement: ltrPosition,
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            isRtl: true
          },
          {
            target: 'shopping-list',
            placement: ltrPosition,
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            isRtl: false
          }
        ],
        showPrevButton: true
      });

      expect($('.hopscotch-bubble-arrow-container').hasClass(ltrPosition)).toBe(true);
      hopscotch.nextStep();
      expect($('.hopscotch-bubble-arrow-container').hasClass(flippedPosition)).toBe(true);
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
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            placement: 'right',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ],
        showPrevButton: true
      });

      expect($('.hopscotch-bubble-arrow-container').hasClass('left')).toBe(true);
      hopscotch.nextStep();
      expect($('.hopscotch-bubble-arrow-container').hasClass('right')).toBe(true);
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
            placement: 'left',
            title: 'Bread bread bread!',
            content: 'Gotta get me some bread',
            nextOnTargetClick: true
          },
          {
            target: 'eggs',
            placement: 'left',
            title: 'Eggs',
            content: 'I need to buy some eggs'
          },
          {
            target: 'milk',
            placement: 'left',
            title: 'Milk',
            content: 'I need to buy milk as well',
            nextOnTargetClick: true
          }
        ]
      }, 0);

      expect(hopscotch.getCurrStepNum()).toBe(0);

      //click the first step's target to move to next step
      click(breadEl);
      expect(hopscotch.getCurrStepNum()).toBe(1);

      //the event handler for click event should have been removed in the previous step
      //so tour should not continue to the next step when first step's target is clicked again
      click(breadEl);
      expect(hopscotch.getCurrStepNum()).toBe(1);

      //move to the 3rd step and then back to 2nd
      hopscotch.nextStep();
      hopscotch.prevStep();

      //on click event handler should have been removed from 3rd step's target when tour moved back
      //to 2nd step, so clicking on 3rd step's target should not move the tour forward
      click(milkEl);
      expect(hopscotch.getCurrStepNum()).toBe(1);

      //go to the 3rd step, then show 1st step
      hopscotch.nextStep();
      hopscotch.showStep(0);

      //when tour jumps to a different step using showStepAPI
      //onclick event handler should be removed from current step's target
      //so clicking on milk element should not move to next step
      click(milkEl);
      expect(hopscotch.getCurrStepNum()).toBe(0);

      //clicking first step's target element while we are on first step in a tour
      //should move to the next step
      click(breadEl);
      expect(hopscotch.getCurrStepNum()).toBe(1);

      //go to the first step
      hopscotch.prevStep();

      //end the tour
      hopscotch.endTour();

      //on click event handler should be removed when tour is ended
      //clicking on target el should not do anything
      click(breadEl);
    });

    it('should gracefully handle starting tour with step without existing target and nextOnTargetClick option on', function(){
      hopscotch.startTour({
        id: 'hopscotch-test-tour-nextOnTargetClick',
        steps: [
          {
            target: 'not_here_not_there_not_anywhere',
            placement: 'left',
            title: 'Nope',
            content: 'ZzZzZ',
            nextOnTargetClick: true
          }
        ]}
      );

      expect(hopscotch.isActive).toBeFalsy();
      hopscotch.endTour();
    });

    it('should gracefully handle going directly to the step without existing target', function(){
      var tourJson = {
        id: 'hopscotch-test-tour-nextOnTargetClick',
          steps: [
        {
          target: 'shopping-list',
          placement: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        },
        {
          target: 'not_here_not_there_not_anywhere',
          placement: 'left',
          title: 'Nope',
          content: 'ZzZzZ'
        },
        {
          target: 'milk',
          placement: 'left',
          title: 'Milk',
          content: 'Got milk?'
        }
      ]};

      hopscotch.startTour(tourJson);

      //tour should be running and on the first step
      expect(hopscotch.isActive).toBeTruthy();
      expect(hopscotch.getCurrStepNum()).toEqual(0);

      //try to jump directly to the step whose target does not exist
      hopscotch.showStep(1);

      //tour should be still active and on the same step
      expect(hopscotch.isActive).toBeTruthy();
      expect(hopscotch.getCurrStepNum()).toEqual(0);

      //jump directly to step with existing target should work
      hopscotch.showStep(2);
      expect(hopscotch.isActive).toBeTruthy();
      expect(hopscotch.getCurrStepNum()).toEqual(2);

      hopscotch.endTour();

      //Try starting tour directly on the step without existing target
      hopscotch.startTour(tourJson, 1);
      expect(hopscotch.isActive).toBeTruthy();
      expect(hopscotch.getCurrStepNum()).toEqual(2);

      hopscotch.endTour();
    });

    it('should throw an exception when stand-alone callout target does not exist', function(){
      var calloutMgr = hopscotch.getCalloutManager();
      expect(function(){
        calloutMgr.createCallout({
          id: 'hopscotch-callout-test-123',
          target: 'totally-does-not-exist',
          placement: 'bottom',
          title: 'This test is fun!',
          content: 'This is how we test this library!'
        });
      }).toThrow(new Error('Must specify existing target element via \'target\' option.'));

    });

  });

  describe('Saving state', function() {
    it('should create state in either sessionStorage or cookie once tour is started', function() {
      expect(getState('hopscotch.tour.state')).toBeFalsy();
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          placement: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      expect(getState('hopscotch.tour.state')).toBe('hopscotch-test-tour:0');
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
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ],
        showPrevButton: true
      });
      expect(getState('tourstate')).toBe('hopscotch-test-tour:0');
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
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ],
        skipIfNoElement: false
      });
      expect(hopscotch.getCurrStepNum()).toBe(1);
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
            placement: 'top',
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

      expect(bubbleDomElement.style['top']).not.toEqual(bubbleTop);
      expect(bubbleDomElement.style['left']).not.toEqual(bubbleLeft);
      hopscotch.endTour();

      document.getElementById('shopping-list').style.setProperty('margin-top', null);
      document.getElementById('shopping-list').style.setProperty('margin-left', null);
    });

    it('also runs recalculations for individual callouts', function() {
      hopscotch.getCalloutManager().createCallout({
        id: 'test_callout',
        placement: 'left',
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

      expect(bubbleDomElement.style['top']).not.toEqual(bubbleTop);
      expect(bubbleDomElement.style['left']).not.toEqual(bubbleLeft);
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
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'i-do-not-exist',
            placement: 'left',
            title: 'Not there',
            content: 'Not there at all'
          },
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'Back to the shopping list'
          }
        ],
        i18n : {
          stepNums : ['one', 'two', 'three', 'four', 'five']
        }
      },
      mockCallout = {
        id: 'shopping-callout',
        target: 'shopping-list',
        placement: 'left',
        title: 'Shopping List Callout',
        content: 'It\'s a shopping list'
      },
      customRenderer = {
        render: function(){
          return '<h1>Content!</h1><div class="hopscotch-arrow"></div>';
        }
      },
      args;

    beforeEach(function(){
      hopscotch.templates.customTemplate = function(){
        return '<h1>Content!</h1><div class="hopscotch-arrow"></div>';
      };
      spyOn(customRenderer, 'render').and.callThrough();
      spyOn(hopscotch.templates, 'bubble_default').and.callThrough();
      spyOn(hopscotch.templates, 'customTemplate').and.callThrough();
    });

    afterEach(function(){
      hopscotch.endTour();
      hopscotch.getCalloutManager().removeAllCallouts();
      hopscotch.setRenderer('bubble_default');
      delete hopscotch.templates.customTemplate;
      hopscotch.resetDefaultI18N();

    });

    it('setRenderer() should allow setting a global renderer within the hopscotch.templates namespace', function(){
      hopscotch.setRenderer('customTemplate');
      hopscotch.startTour(mockTour);
      expect(hopscotch.templates.customTemplate.calls.count()).toEqual(1);
      args =  hopscotch.templates.customTemplate.calls.argsFor(0);
      expect(args[0].i18n.numSteps).toEqual("three");
      expect(args[0].step.isLast).toEqual(false);
      expect(customRenderer.render.calls.count()).toEqual(0);
      expect(hopscotch.templates.bubble_default.calls.count()).toEqual(0);

      //go to step 3, since step 2 does not exist
      hopscotch.nextStep();
      expect(hopscotch.templates.customTemplate.calls.count()).toEqual(2);

      args =  hopscotch.templates.customTemplate.calls.argsFor(1);
      //we skipped one step, so num of steps should go down to two
      expect(args[0].i18n.numSteps).toEqual("two");
      expect(args[0].step.isLast).toEqual(true);

      hopscotch.endTour();
      hopscotch.templates.customTemplate.calls.reset();

      hopscotch.getCalloutManager().createCallout(mockCallout);
      expect(hopscotch.templates.customTemplate.calls.count()).toEqual(1);
      expect(customRenderer.render).not.toHaveBeenCalled();
      expect(hopscotch.templates.bubble_default).not.toHaveBeenCalled();
    });

    it('setRenderer() should allow setting a global custom render method', function(){
      hopscotch.setRenderer(customRenderer.render);
      hopscotch.startTour(mockTour);

      expect(customRenderer.render.calls.count()).toEqual(1);
      expect(hopscotch.templates.customTemplate).not.toHaveBeenCalled();
      expect(hopscotch.templates.bubble_default).not.toHaveBeenCalled();

      hopscotch.endTour();
      customRenderer.render.calls.reset();

      hopscotch.getCalloutManager().createCallout(mockCallout);
      expect(customRenderer.render.calls.count()).toEqual(1);
      expect(hopscotch.templates.customTemplate).not.toHaveBeenCalled();
      expect(hopscotch.templates.bubble_default).not.toHaveBeenCalled();
    });

    it('Should throw and exception when tour specific custom renderer does not exist', function(){
      var augmentedData = $.extend({}, mockTour, {customRenderer: 'myCustomTemplateThatDoesNotExist'});

      expect(function(){
        hopscotch.startTour(augmentedData);
      }).toThrow(new Error('Bubble rendering failed - template "myCustomTemplateThatDoesNotExist" is not a function.'));

    });

    it('Should throw and exception when custom renderer does not exist', function(){
      expect(function(){
        hopscotch.setRenderer('anotherTemplateThatDoesNotExist');
        hopscotch.startTour(mockTour);
      }).toThrow(new Error('Bubble rendering failed - template "anotherTemplateThatDoesNotExist" is not a function.'));
    });

    it('Should accept a custom renderer in hopscotch.templates set via tour config', function(){
      var augmentedData = $.extend({}, mockTour, {customRenderer: 'customTemplate'});
      hopscotch.startTour(augmentedData);

      expect(hopscotch.templates.customTemplate.calls.count()).toEqual(1);
      expect(customRenderer.render).not.toHaveBeenCalled();
      expect(hopscotch.templates.bubble_default).not.toHaveBeenCalled();
    });

    it('Should accept a custom renderer method set via tour config', function(){
      var augmentedData = $.extend({}, mockTour, {customRenderer: customRenderer.render});
      hopscotch.startTour(augmentedData);

      expect(customRenderer.render.calls.count()).toEqual(1);
      expect(hopscotch.templates.customTemplate).not.toHaveBeenCalled();
      expect(hopscotch.templates.bubble_default).not.toHaveBeenCalled();
    });

    it('Should accept a custom renderer in hopscotch.templates set via new callout config', function(){
      var augmentedData = $.extend({}, mockCallout, {customRenderer: 'customTemplate'});
      hopscotch.getCalloutManager().createCallout(augmentedData);

      expect(hopscotch.templates.customTemplate.calls.count()).toEqual(1);
      expect(customRenderer.render).not.toHaveBeenCalled();
      expect(hopscotch.templates.bubble_default).not.toHaveBeenCalled();
    });

    it('Should accept a custom renderer method set via new callout config', function(){
      var augmentedData = $.extend({}, mockCallout, {customRenderer: customRenderer.render});
      hopscotch.getCalloutManager().createCallout(augmentedData);

      expect(customRenderer.render.calls.count()).toEqual(1);
      expect(hopscotch.templates.customTemplate).not.toHaveBeenCalled();
      expect(hopscotch.templates.bubble_default).not.toHaveBeenCalled();
    });

    it('Render methods should receive custom data from tours', function(){
      var augmentedData = $.extend({}, mockTour, {customData: {foo: 'bar'}}),
          callArgs;
      $.extend(augmentedData.steps[0], {customData: {stepSpecific: 'data'}});

      hopscotch.startTour(augmentedData);
      expect(hopscotch.templates.bubble_default.calls.count()).toEqual(1);

      callArgs = hopscotch.templates.bubble_default.calls.allArgs()[0][0];
      expect(callArgs.tour.customData.foo).toBe('bar');
      expect(callArgs.step.customData.stepSpecific).toBe('data');
    });

    it('Render methods should receive custom data from callouts', function(){
      var augmentedData = $.extend({}, mockCallout, {customData: {foo: 'bar'}}),
          callArgs;

      hopscotch.getCalloutManager().createCallout(augmentedData);
      expect(hopscotch.templates.bubble_default.calls.count()).toEqual(1);

      callArgs = hopscotch.templates.bubble_default.calls.allArgs()[0][0];
      expect(callArgs.tour.customData.foo).toBe('bar');
      expect(callArgs.step.customData.foo).toBe('bar');
    });

    it('Render methods should receive the unsafe flag when set', function(){
      var augmentedData = $.extend({}, mockTour, {unsafe: true}),
          callArgs;

      hopscotch.startTour(augmentedData);
      expect(hopscotch.templates.bubble_default.calls.count()).toEqual(1);

      callArgs = hopscotch.templates.bubble_default.calls.allArgs()[0][0];
      expect(callArgs.tour.unsafe).toBe(true);
    });

    it('Should be able to override default escaping method using setEscaper()', function(){
      var augmentedData = $.extend({}, mockTour, {unsafe: true}),
          customEscaper = {
            escape: function(){
              return 0;
            }
          };
      spyOn(customEscaper, 'escape').and.callThrough();
      hopscotch.setEscaper(customEscaper.escape);
      hopscotch.startTour(augmentedData);
      expect(hopscotch.templates.bubble_default.calls.count()).toEqual(1);

      expect(customEscaper.escape.calls.count()).toEqual(2);
    });
  });
});

/**
 * While not directly controlled, properties of the Hopscotch Bubble are controlled by Hopscotch step options.
 * These are specified in the tour definition.
 */
describe('HopscotchBubble', function() {

  afterEach(function() {
    hopscotch.endTour();
    hopscotch.getCalloutManager().removeAllCallouts();
  });

  describe('Title and Content', function() {
    it('should show the Title of the step', function() {
      var title;
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          placement: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      title = document.querySelector('.hopscotch-bubble-content h3').innerHTML;
      expect(title).toBe('Shopping List');
    });

    it('should show the Content of the step', function() {
      var content;
      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [ {
          target: 'shopping-list',
          placement: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      content = document.querySelector('.hopscotch-bubble-content .hopscotch-content').innerHTML;
      expect(content).toBe('It\'s a shopping list');
      hopscotch.endTour();
    });

    it('Should include tour ID as part of bubble classes', function(){
      hopscotch.startTour({
        id: 'hs-test-tour-class',
        steps: [ {
          target: 'shopping-list',
          placement: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        } ]
      });
      bubble = document.querySelector('.hopscotch-bubble.tour-hs-test-tour-class');
      expect(bubble).not.toBe(null);
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
            placement: 'top',
            title: 'Shopping List',
            content: stepContent.shoppingList
          },
          {
            target: 'id-of-dynamically-created-element',
            placement: 'left',
            title: 'My target is dynamic, it might or might not exist!',
            content: stepContent.dynamicTarget
          },
          {
            target: 'eggs',
            placement: 'left',
            title: 'Eggs',
            content: stepContent.eggs
          },
          {
            target: 'another-target-that-does-not-exist',
            placement: 'left',
            title: 'My target does not exist',
            content: 'My target isn\'t here'
          },
          {
            target: 'and-another-target-that-does-not-exist',
            placement: 'left',
            title: 'My target can\'t be found...',
            content: 'Target, target, target!'
          },
          {
            target: 'milk',
            placement: 'bottom',
            title: 'Milk!',
            content: stepContent.milk
          }
        ]
      });
    }

    it('should account for skipped steps in bubble numbering', function() {

      startTourWithMissingStepTarget();

      expect(getStepNumber()).toBe("1");
      expect(getStepContent()).toBe(stepContent.shoppingList);

      hopscotch.nextStep();
      expect(getStepNumber()).toBe("2");
      expect(getStepContent()).toBe(stepContent.eggs);

      hopscotch.nextStep();
      expect(getStepNumber()).toBe("3");
      expect(getStepContent()).toBe(stepContent.milk);

      hopscotch.prevStep();
      expect(getStepNumber()).toBe("2");
      expect(getStepContent()).toBe(stepContent.eggs);

      hopscotch.prevStep();
      expect(getStepNumber()).toBe("1");
      expect(getStepContent()).toBe(stepContent.shoppingList);

      hopscotch.endTour();
    });

    it('should adjust step numbering when elements are dynamically created', function(){
      startTourWithMissingStepTarget();
      expect(getStepNumber()).toBe("1");
      expect(getStepContent()).toBe(stepContent.shoppingList);

      //will skip over 2nd tour step in config and move to 3rd step
      //since 2nd step was skipped, the bubble number for the 3rd step should be "2"
      hopscotch.nextStep();
      expect(getStepNumber()).toBe("2");
      expect(getStepContent()).toBe(stepContent.eggs);

      //create a missing target element for the 2nd tour step
      $('#shopping-list').append('<span id="id-of-dynamically-created-element">This is dynamically created element</span>')

      //now that target element for 2nd tour step exists, the bubble number should be "2"
      hopscotch.prevStep();
      expect(getStepNumber()).toBe("2");
      expect(getStepContent()).toBe(stepContent.dynamicTarget);

      hopscotch.prevStep();
      expect(getStepNumber()).toBe("1");
      expect(getStepContent()).toBe(stepContent.shoppingList);

      hopscotch.nextStep();
      expect(getStepNumber()).toBe("2");
      expect(getStepContent()).toBe(stepContent.dynamicTarget);

      //now that target element for 2nd tour step exists, the bubble number should be "3"
      hopscotch.nextStep();
      expect(getStepNumber()).toBe("3");
      expect(getStepContent()).toBe(stepContent.eggs);

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
            placement: 'left',
            title: 'Shopping List',
            content: stepContent.shoppingList
          },
          {
            target: 'eggs',
            placement: 'left',
            title: 'Eggs',
            content: stepContent.eggs
          },
          {
            target: 'milk',
            placement: 'left',
            title: 'Milk!',
            content: stepContent.milk
          }
        ]
      });

      expect(getStepNumber()).toBe("1");
      expect(getStepContent()).toBe(stepContent.shoppingList);

      hopscotch.nextStep();
      expect(getStepNumber()).toBe("2");
      expect(getStepContent()).toBe(stepContent.eggs);

      hopscotch.nextStep();
      expect(getStepNumber()).toBe("3");
      expect(getStepContent()).toBe(stepContent.milk);

      hopscotch.endTour();
    });

    it('should detect state and begin the tour on the specified step accounting for skipped steps in step numbering', function() {

      //set state - on step 5 of hopscotch-test-tour with steps 1,3 and 4 skipped
      setState('hopscotch.tour.state', 'hopscotch-test-tour:5:1,3,4');

      startTourWithMissingStepTarget();

      expect(getStepNumber()).toBe("3");
      expect(getStepContent()).toBe(stepContent.milk);

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
          placement: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list',
          zindex: 100
        },
        {
          target: 'shopping-list',
          placement: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list',
          zindex: 0
        },
        {
          target: 'shopping-list',
          placement: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        }]
      });
      bubble = document.querySelector('.hopscotch-bubble');
      expect(bubble.style.zIndex).toBe('100');

      hopscotch.nextStep();
      bubble = document.querySelector('.hopscotch-bubble');
      expect(bubble.style.zIndex).toBe('0');

      hopscotch.nextStep();
      bubble = document.querySelector('.hopscotch-bubble');
      expect(bubble.style.zIndex).toBe('');
      expect($(bubble).css("z-index")).toBe('999999');

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
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            showSkip: true
          },
          {
            target: 'jasmine',
            placement: 'top',
            title: 'Jasmine',
            content: 'It\'s Jasmine'
          }
        ]
      });
      $nextBtnEl = $('.hopscotch-next');
      expect($nextBtnEl.length).toBe(1);
      expect($nextBtnEl.html()).toBe('Skip');
      hopscotch.endTour();
    });

    it('should hide Previous button when specified', function() {
      var $el,
      tour = {
        id: 'hopscotch-test-tour',
        showPrevButton: true,
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
          },
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            showPrevButton: false
          },
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
          }
        ]
      };

      hopscotch.startTour(tour);
      hopscotch.nextStep();
      $el = $('.hopscotch-prev');
      expect($el.length).toBe(0);
      hopscotch.endTour();
    });

    it('should hide Next button when specified', function() {
      var $el,
      tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            showNextButton: false
          }
        ]
      };

      hopscotch.startTour(tour);
      $el = $('.hopscotch-next');
      expect($el.length).toBe(0);
      hopscotch.endTour();
    });

    it('Should hide Previous button on first step', function(){
      var $el;
      hopscotch.startTour({
        id: 'hopscotch-test-tour-prev-btn',
        showPrevButton: true,
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'jasmine',
            placement: 'top',
            title: 'Jasmine',
            content: 'It\'s Jasmine'
          },
          {
            target: 'jasmine',
            placement: 'top',
            title: 'Jasmine',
            content: 'It\'s Jasmine'
          }
        ]
      });
      $el = $('.hopscotch-prev');
      expect($el.length).toBe(0);
      hopscotch.endTour();
    });

    it('Should show Previous button on second step onward (if enabled)', function(){
      var $el;
      hopscotch.startTour({
        id: 'hopscotch-test-tour-prev-btn',
        showPrevButton: true,
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'jasmine',
            placement: 'top',
            title: 'Jasmine',
            content: 'It\'s Jasmine'
          },
          {
            target: 'jasmine',
            placement: 'top',
            title: 'Jasmine',
            content: 'It\'s Jasmine'
          }
        ]
      });
      hopscotch.nextStep();
      $el = $('.hopscotch-prev');
      expect($el.length).toBe(1);
      hopscotch.endTour();
    });

    it('Should show Previous button on second step onward (if enabled), even if starting in middle', function(){
      var $el;
      hopscotch.startTour({
        id: 'hopscotch-test-tour-prev-btn',
        showPrevButton: true,
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'jasmine',
            placement: 'top',
            title: 'Jasmine',
            content: 'It\'s Jasmine'
          },
          {
            target: 'jasmine',
            placement: 'top',
            title: 'Jasmine',
            content: 'It\'s Jasmine'
          }
        ]
      }, 1);
      $el = $('.hopscotch-prev');
      expect($el.length).toBe(1);
      hopscotch.endTour();
    });

    it('Should hide Previous button on first shown step (if steps are skipped)', function(){
      var $el;
      hopscotch.startTour({
        id: 'hopscotch-test-tour-prev-btn',
        showPrevButton: true,
        steps: [
          {
            target: 'this-totally-does-not-exist',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'jasmine',
            placement: 'top',
            title: 'Jasmine',
            content: 'It\'s Jasmine'
          },
          {
            target: 'jasmine',
            placement: 'top',
            title: 'Jasmine',
            content: 'It\'s Jasmine'
          }
        ]
      });
      $el = $('.hopscotch-prev');
      expect($el.length).toBe(0);
      hopscotch.endTour();
    });
  });

  describe('Callbacks', function() {
    it('should invoke onStart callback when starting the tour', function() {
      var tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'jasmine',
            placement: 'top',
            title: 'Jasmine',
            content: 'It\'s Jasmine'
          }
        ],
        onStart: jasmine.createSpy('onStartCallback')
      };

      hopscotch.startTour(tour);
      expect(tour.onStart).toHaveBeenCalled();

      hopscotch.endTour();
    });

    it('should invoke onNext callback of current step when going to the next step', function() {
      var onNextCallback = jasmine.createSpy('onNextCallback'),
      tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            onNext: onNextCallback
          },
          {
            target: 'jasmine',
            placement: 'top',
            title: 'Jasmine',
            content: 'It\'s Jasmine'
          }
        ]
      };

      hopscotch.startTour(tour);
      hopscotch.nextStep();
      expect(onNextCallback).toHaveBeenCalled();

      hopscotch.endTour();
    });

    it('should invoke onPrev callback of current step when going to the prev step', function() {
      var onPrevCallback = jasmine.createSpy('onPrevCallback'),
      tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'jasmine',
            placement: 'top',
            title: 'Jasmine',
            content: 'It\'s Jasmine',
            onPrev: onPrevCallback
          }
        ]
      };

      hopscotch.startTour(tour, 1);
      hopscotch.prevStep();
      expect(onPrevCallback).toHaveBeenCalled();

      hopscotch.endTour();
    });

    it('should invoke onEnd callback of current step when ending the tour', function() {
      var tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          }
        ],
        onEnd: jasmine.createSpy('onEndCallback')
      };

      hopscotch.startTour(tour);
      hopscotch.endTour();

      expect(tour.onEnd).toHaveBeenCalled();
    });

    it('should invoke onEnd callback when tour is complete', function() {
      var tour = {
            id: 'hopscotch-test-tour',
            steps: [
              {
                target: 'shopping-list',
                placement: 'left',
                title: 'Shopping List',
                content: 'It\'s a shopping list'
              }
            ],
            skipIfNoElement: false,
            onEnd: jasmine.createSpy('onEndCallback')
          };

      hopscotch.startTour(tour);
      expect(tour.onEnd).not.toHaveBeenCalled();

      click($('.hopscotch-next')[0]);
      expect(tour.onEnd).toHaveBeenCalled();

      hopscotch.endTour();
    });

    it('should detect when a callback changes the state of a tour and not go to the next step when detected', function() {
      var tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            onNext: function() {
              hopscotch.showStep(2);
            }
          },
          {
            target: 'milk',
            placement: 'left',
            title: 'Milk',
            content: 'It\'s milk'
          },
          {
            target: 'eggs',
            placement: 'left',
            title: 'Eggs',
            content: 'It\'s eggs'
          }
        ]
      };

      hopscotch.startTour(tour);
      hopscotch.nextStep();
      expect(hopscotch.getCurrStepNum()).toBe(2);
      hopscotch.endTour();
    });

    it('should invoke the CTA callback when the CTA button is clicked', function() {
      var onCTACallback = jasmine.createSpy('onCTACallback'),
      tour = {
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list',
            showCTAButton: true,
            ctaLabel: 'test',
            onCTA: onCTACallback
          }
        ]
      };

      hopscotch.startTour(tour);
      click($('.hopscotch-cta')[0]);
      expect(onCTACallback).toHaveBeenCalled();

      hopscotch.endTour(tour);

    });

    it('should remove the CTA callback after advancing to the next step', function() {
      var onCTACallback1 = jasmine.createSpy('onCTACallback1'),
        onCTACallback2 = jasmine.createSpy('onCTACallback2'),
        tour = {
          id: 'hopscotch-test-tour',
          steps: [
            {
              target: 'shopping-list',
              placement: 'left',
              title: 'Shopping List',
              content: 'It\'s a shopping list',
              showCTAButton: true,
              ctaLabel: 'test',
              onCTA: onCTACallback1
            },
            {
              target: 'shopping-list',
              placement: 'left',
              title: 'Shopping List',
              content: 'It\'s a shopping list',
              showCTAButton: true,
              ctaLabel: 'test',
              onCTA: onCTACallback2
            }
          ]
        };

      hopscotch.startTour(tour);
      hopscotch.nextStep();
      click($('.hopscotch-cta')[0]);

      expect(onCTACallback1).not.toHaveBeenCalled();
      expect(onCTACallback2).toHaveBeenCalled();

      hopscotch.endTour(tour);
    });

    it('should be able to invoke a callback that was registered as a helper', function() {
      var helperName = 'anAwesomeHelper',
        hopscotchHelper = jasmine.createSpy('hopscotchHelper');

      hopscotch.registerHelper(helperName, hopscotchHelper);

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'jasmine',
            placement: 'top',
            title: 'Jasmine',
            content: 'It\'s Jasmine'
          }
        ],
        onStart: helperName
      });

      expect(hopscotchHelper).toHaveBeenCalled();

      hopscotch.endTour();
      hopscotch.unregisterHelper(helperName);
    });

    it('should be able to invoke more than one helper callbacks', function() {
      var helper1 = jasmine.createSpy('helper1'),
          helper2 = jasmine.createSpy('helper2'),
          helper3 = jasmine.createSpy('helper3'),
          helperName1    = 'addClassToBody1',
          helperName2    = 'addClassToBody2',
          helperName3    = 'addClassToBody3';

      hopscotch.registerHelper(helperName1, helper1);
      hopscotch.registerHelper(helperName2, helper2);
      hopscotch.registerHelper(helperName3, helper3);

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'jasmine',
            placement: 'top',
            title: 'Jasmine',
            content: 'It\'s Jasmine'
          }
        ],
        onStart: [[helperName1], [helperName2], [helperName3]]
      });

      expect(helper1).toHaveBeenCalled();
      expect(helper2).toHaveBeenCalled();
      expect(helper3).toHaveBeenCalled();

      hopscotch.endTour();
      hopscotch.unregisterHelper(helperName1);
      hopscotch.unregisterHelper(helperName2);
      hopscotch.unregisterHelper(helperName3);
    });

    it('should be able to invoke a helper with arguments', function() {
      var helper = jasmine.createSpy('helperSpy1'),
          helperName = 'addClassToBody',
          helperArg = 'thisIsHelperArg';

      hopscotch.registerHelper(helperName, helper);

      hopscotch.startTour({
        id: 'hopscotch-test-tour',
        steps: [
          {
            target: 'shopping-list',
            placement: 'left',
            title: 'Shopping List',
            content: 'It\'s a shopping list'
          },
          {
            target: 'jasmine',
            placement: 'top',
            title: 'Jasmine',
            content: 'It\'s Jasmine'
          }
        ],
        onStart: [helperName, helperArg]
      });

      expect(helper).toHaveBeenCalledWith(helperArg);

      hopscotch.endTour();
      hopscotch.unregisterHelper(helperName);
    });
  });

  describe('Should recover if bubble DOM element is destroyed', function(){
    var tourConfig = {
      id: 'hopscotch-test-tour',
      steps: [
        {
          target: 'shopping-list',
          placement: 'left',
          title: 'Shopping List',
          content: 'It\'s a shopping list'
        },
        {
          target: 'jasmine',
          placement: 'top',
          title: 'Jasmine',
          content: 'It\'s Jasmine'
        }
    ]};

    it('should re-create a tour bubble if it\'s dom element is destroyed', function(){
      var $hBubble;

      hopscotch.startTour(tourConfig);

      //bubble should exist in page DOM
      $hBubble = $('.hopscotch-bubble');
      expect($hBubble.length).toEqual(1);

      //destroy the bubble element
      $hBubble.remove();

      hopscotch.nextStep();
      $hBubble = $('.hopscotch-bubble');
      expect($hBubble.length).toEqual(1);

      //destroy the bubble element
      $hBubble.remove();

      hopscotch.prevStep();
      $hBubble = $('.hopscotch-bubble');
      expect($hBubble.length).toEqual(1);

      hopscotch.endTour();

    });

    it('Can stop and re-start tour event when bubbles dom element does not exist', function(){
      var $hBubble;

      hopscotch.startTour(tourConfig);

      //bubble should exist in page DOM
      $hBubble = $('.hopscotch-bubble');
      expect($hBubble.length).toEqual(1);

      //destroy the bubble element
      $hBubble.remove();

      hopscotch.endTour();

      //restart the tour and make sure that
      //bubble is created
      hopscotch.startTour(tourConfig);
      $hBubble = $('.hopscotch-bubble');
      expect($hBubble.length).toEqual(1);

      hopscotch.endTour();
    });

  });
});

describe('HopscotchCalloutManager', function() {

  afterEach(function() {
    hopscotch.endTour();
    hopscotch.getCalloutManager().removeAllCallouts();
  });

  describe('CalloutManager', function() {
    it('should create no more than one instance of the callout manager', function() {
      var mgr = hopscotch.getCalloutManager();
      expect(mgr).toBe(hopscotch.getCalloutManager());
    });
    it('should create a callout using createCallout() and remove it with removeCallout()', function() {
      var mgr = hopscotch.getCalloutManager(),
          $el;

      mgr.createCallout({
        id: 'shopping-callout',
        target: 'shopping-list',
        placement: 'left',
        title: 'Shopping List Callout',
        content: 'It\'s a shopping list'
      });

      $el = $('.hopscotch-bubble.hopscotch-callout');
      expect($el.length).toBe(1);
      expect($el.html().indexOf('Shopping List Callout')).toBeGreaterThan(-1);
      mgr.removeCallout('shopping-callout');
      expect($('.hopscotch-bubble.hopscotch-callout').length).toBe(0);
    });
    it('should remove all callouts using removeAllCallouts()', function() {
      var mgr = hopscotch.getCalloutManager(),
          callout;

      mgr.createCallout({
        id: 'shopping-callout',
        target: 'shopping-list',
        placement: 'left',
        title: 'Shopping List Callout',
        content: 'It\'s a shopping list'
      });
      mgr.createCallout({
        id: 'shopping-callout2',
        target: 'shopping-list',
        placement: 'left',
        title: 'Shopping List Callout',
        content: 'It\'s a shopping list'
      });
      mgr.createCallout({
        id: 'shopping-callout3',
        target: 'shopping-list',
        placement: 'left',
        title: 'Shopping List Callout',
        content: 'It\'s a shopping list'
      });

      expect($('.hopscotch-bubble.hopscotch-callout').length).toBe(3);
      mgr.removeAllCallouts();
      expect($('.hopscotch-bubble.hopscotch-callout').length).toBe(0);
    });
    it('should return instance of HopscotchBubble using getCallout()', function() {
      var mgr = hopscotch.getCalloutManager(),
          callout;

      callout = mgr.createCallout({
        id: 'shopping-callout',
        target: 'shopping-list',
        placement: 'left',
        title: 'Shopping List Callout',
        content: 'It\'s a shopping list'
      });

      // Test the existence of some known methods of HopscotchBubble
      expect(callout.render).toBeTruthy();
      expect(callout.destroy).toBeTruthy();
      expect(callout.setPosition).toBeTruthy();
      mgr.removeCallout('shopping-callout');
    });
    it('should reject callout IDs that contain invalid characters', function() {
      var mgr = hopscotch.getCalloutManager();

      expect(function(){
        mgr.createCallout({
          id: '(this is an invalid callout id!)',
          target: 'shopping-list',
          orientation: 'left',
          title: 'Shopping List Callout',
          content: 'It\'s a shopping list'
        });
      }).toThrow(new Error('Callout ID is using an invalid format. Use alphanumeric, underscores, and/or hyphens only. First character must be a letter.'));

      hopscotch.endTour();
    });
    it('should reject callouts with the same ID as another', function() {
      var mgr = hopscotch.getCalloutManager();

      mgr.createCallout({
        id: 'my-new-callout',
        target: 'shopping-list',
        orientation: 'left',
        title: 'Shopping List Callout',
        content: 'It\'s a shopping list'
      });

      expect(function(){
        mgr.createCallout({
          id: 'my-new-callout',
          target: 'shopping-list',
          orientation: 'left',
          title: 'Shopping List Callout',
          content: 'It\'s a shopping list'
        });
      }).toThrow(new Error('Callout by that id already exists. Please choose a unique id.'));

      hopscotch.endTour();
    });
  });
});