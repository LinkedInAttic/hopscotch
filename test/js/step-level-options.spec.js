var stepOptions = [
  {
    name: 'target',
    required: true,
    tests: [
      {
        description: "Can be an ID of an element",
        tourConfig: {
          id: 'hopscotch-test-tour',
          steps: [
            {
              target: 'shopping-list',
              placement: 'right'
            }
          ]
        },
        verify: function () {
          testUtils.verifyBubblePlacement(document.getElementById('shopping-list'), 'right');
        }
      },
      {
        description: "Can be a query selector",
        tourConfig: {
          id: 'hopscotch-test-tour',
          steps: [
            {
              target: '#shopping-list li:last',
              placement: 'bottom'
            }
          ]
        },
        verify: function () {
          testUtils.verifyBubblePlacement(document.getElementById('yogurt'), 'bottom');
        }
      },
      {
        description: "Can be a DOM element itself",
        tourConfig: {
          id: 'hopscotch-test-tour',
          steps: [
            {
              target: document.getElementById('shopping-list'),
              placement: 'left'
            }
          ]
        },
        verify: function () {
          testUtils.verifyBubblePlacement(document.getElementById('shopping-list'), 'left');
        }
      },
      {
        description: "Can be an array of element IDs",
        tourConfig: {
          id: 'hopscotch-test-tour',
          steps: [
            {
              target: ['does-not-exist', 'yogurt'],
              placement: 'top'
            }
          ]
        },
        verify: function () {
          testUtils.verifyBubblePlacement(document.getElementById('yogurt'), 'top');
        }
      },
      {
        description: "Can be an array of query selectors",
        tourConfig: {
          id: 'hopscotch-test-tour',
          steps: [
            {
              target: ['#shopping-list .does-not-exist', '#shopping-list li:last'],
              placement: 'right'
            }
          ]
        },
        verify: function () {
          testUtils.verifyBubblePlacement(document.getElementById('yogurt'), 'right');
        }
      },
      {
        description: "Can be an array of query selectors and IDs",
        tourConfig: {
          id: 'hopscotch-test-tour',
          steps: [
            {
              target: ['#shopping-list .does-not-exist', 'bread'],
              placement: 'left'
            }
          ]
        },
        verify: function () {
          testUtils.verifyBubblePlacement(document.getElementById('bread'), 'left');
        }
      },
      {
        description: "Can NOT be an array of DOM elements",
        tourConfig: {
          id: 'hopscotch-test-tour',
          steps: [
            {
              target: [document.getElementById('does-not-exist'), document.getElementById('milk')],
              placement: 'top'
            }
          ]
        },
        verify: function () {
          //won't be able to find a target, so it should not start a tour
          expect(hopscotch.isActive).toBeFalsy();
          testUtils.verifyBubbleIsNotShown();
        }
      }
    ]
  },
  {
    name: 'placement',
    required: true
  },
  {
    name: 'title'
  },
  {
    name: 'content'
  },
  {
    name: 'width'
  },
  {
    name: 'padding'
  },
  {
    name: 'xOffset'
  },
  {
    name: 'yOffset'
  },
  {
    name: 'arrowOffset'
  },
  {
    name: 'delay'
  },
  {
    name: 'zindex'
  },
  {
    name: 'showNextButton'
  },
  {
    name: 'showPrevButton'
  },
  {
    name: 'showCTAButton'
  },
  {
    name: 'ctaLabel'
  },
  {
    name: 'multipage'
  },
  {
    name: 'showSkip'
  },
  {
    name: 'fixedElement'
  },
  {
    name: 'nextOnTargetClick'
  },
  {
    name: 'onPrev'
  },
  {
    name: 'onNext'
  },
  {
    name: 'onShow'
  },
  {
    name: 'onCTA'
  }
];

function runUnitTest(test) {
  it(test.description, function () {
    hopscotch.startTour(test.tourConfig);
    test.verify();
    hopscotch.endTour();
  });
}

function runTestSuite(descr, tests) {
  describe(descr, function () {
    for (var testIdx = 0; testIdx < tests.length; testIdx++) {
      runUnitTest(tests[testIdx]);
    }
  });
}

describe('Test step level options', function () {
  for (var optionIdx = 0; optionIdx < stepOptions.length; optionIdx++) {
    var stepOption = stepOptions[optionIdx];
    if (stepOption.tests) {
      runTestSuite('#' + stepOption.name, stepOption.tests);
    }
  }
});