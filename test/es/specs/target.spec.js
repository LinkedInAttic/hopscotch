import PlacementTestUtils from '../helpers/placement.js';

describe('Config option "target"', () => {
  let calloutManager = hopscotch.getCalloutManager();
  let specGroups = [
    {
      groupName: 'Valid target',
      specs: [
        {
          message: 'Should use provided DOM element as a target',
          config: {
            id: 'standalone-callout',
            placement: 'top',
            target: document.querySelector('#yogurt'),
            title: 'This test is fun!',
            content: 'This is how we test this library!'
          },
          after() {
            let targetEl = document.querySelector('#yogurt');
            //verify that callout points at the correct target
            PlacementTestUtils.verifyCalloutPlacement(targetEl, 'top');
          }
        }, {
          message: 'Should use provided query selector to find target element',
          config: {
            id: 'standalone-callout',
            placement: 'top',
            target: '#yogurt',
            title: 'This test is fun!',
            content: 'This is how we test this library!'
          },
          after() {
            let targetEl = document.querySelector('#yogurt');
            //verify that callout points at the correct target
            PlacementTestUtils.verifyCalloutPlacement(targetEl, 'top');
          }
        }, {
          message: 'Should use complex query selector to find target element',
          config: {
            id: 'standalone-callout',
            placement: 'bottom',
            target: '#shopping-list ul li+li',
            title: 'This test is fun!',
            content: 'This is how we test this library!'
          },
          after() {
            let targetEl = document.querySelector('#milk');
            //verify that callout points at the correct target
            PlacementTestUtils.verifyCalloutPlacement(targetEl, 'bottom');
          }
        }, {
          message: 'Should pick first target from the array of query selectors',
          config: {
            id: 'standalone-callout',
            placement: 'bottom',
            target: [-100, 'does not exit', '#milk', '#yogurt'],
            title: 'This test is fun!',
            content: 'This is how we test this library!'
          },
          after() {
            let targetEl = document.querySelector('#milk');
            //verify that callout points at the correct target
            PlacementTestUtils.verifyCalloutPlacement(targetEl, 'bottom');
          }
        }
      ]
    }, {
      groupName: 'Invalid target',
      specs: [
        {
          message: 'Should throw an exception when "target" options is not provided',
          config: {
            id: 'standalone-callout',
            placement: 'bottom',
            title: 'This test is fun!',
            content: 'This is how we test this library!'
          },
          error: 'Target element is not a DOM object. Please provide valid target DOM element or query selector via \'target\' option.',
          after() {
            expect(calloutManager.getCallout('standalone-callout')).toBeUndefined();
          }
        }, {
          message: 'Should throw an exception when target query selector does not match any element',
          config: {
            id: 'standalone-callout',
            target: 'yogurt',
            placement: 'bottom',
            title: 'This test is fun!',
            content: 'This is how we test this library!'
          },
          error: 'Target element is not a DOM object. Please provide valid target DOM element or query selector via \'target\' option.',
          after() {
            expect(calloutManager.getCallout('standalone-callout')).toBeUndefined();
          }
        }, {
          message: 'Should throw an exception when target is a function',
          config: {
            id: 'standalone-callout',
            target: function () {
              return document.querySelector('#yogurt');
            },
            placement: 'bottom',
            title: 'This test is fun!',
            content: 'This is how we test this library!'
          },
          error: 'Target element is not a DOM object. Please provide valid target DOM element or query selector via \'target\' option.',
          after() {
            expect(calloutManager.getCallout('standalone-callout')).toBeUndefined();
          }
        }, {
          message: 'Should throw an exception when target is an object',
          config: {
            id: 'standalone-callout',
            target: {},
            placement: 'bottom',
            title: 'This test is fun!',
            content: 'This is how we test this library!'
          },
          error: 'Target element is not a DOM object. Please provide valid target DOM element or query selector via \'target\' option.',
          after() {
            expect(calloutManager.getCallout('standalone-callout')).toBeUndefined();
          }
        }, {
          message: 'Should throw an exception when target is an empty array',
          config: {
            id: 'standalone-callout',
            target: [],
            placement: 'bottom',
            title: 'This test is fun!',
            content: 'This is how we test this library!'
          },
          error: 'Target element is not a DOM object. Please provide valid target DOM element or query selector via \'target\' option.',
          after() {
            expect(calloutManager.getCallout('standalone-callout')).toBeUndefined();
          }
        }, {
          message: 'Should throw an exception when target is an array that does not contain strings',
          config: {
            id: 'standalone-callout',
            target: [1, 2, 3, 4, 5],
            placement: 'bottom',
            title: 'This test is fun!',
            content: 'This is how we test this library!'
          },
          error: 'Target element is not a DOM object. Please provide valid target DOM element or query selector via \'target\' option.',
          after() {
            expect(calloutManager.getCallout('standalone-callout')).toBeUndefined();
          }
        }, {
          message: 'Should throw an exception if none of the query selectors withing array match an existing target element',
          config: {
            id: 'standalone-callout',
            target: ['#yogurtland', 'spania', '.rambleBlah'],
            placement: 'bottom',
            title: 'This test is fun!',
            content: 'This is how we test this library!'
          },
          error: 'Target element is not a DOM object. Please provide valid target DOM element or query selector via \'target\' option.',
          after() {
            expect(calloutManager.getCallout('standalone-callout')).toBeUndefined();
          }
        }
      ]
    }, {
      groupName: 'Custom \'getTarget\' function',
      specs: [
        {
          message: 'Should throw an exception getTarget is not a function',
          config: {
            id: 'standalone-callout',
            target: 'doesNotMatter',
            getTarget: document.querySelector('jeez'),
            placement: 'bottom',
            title: 'This test is fun!',
            content: 'This is how we test this library!',
          },
          error: 'Can not find target element because \'getTarget\' is not a function',
          after() {
            expect(calloutManager.getCallout('standalone-callout')).toBeUndefined();
          }
        }, {
          message: 'Should throw an exception if getTarget does not return valid DOM element',
          config: {
            id: 'standalone-callout',
            target: 'doesNotMatter',
            getTarget() {
              //not returning anything
            },
            placement: 'bottom',
            title: 'This test is fun!',
            content: 'This is how we test this library!',
          },
          error: 'Target element is not a DOM object. Please provide valid target DOM element or query selector via \'target\' option.',
          after() {
            expect(calloutManager.getCallout('standalone-callout')).toBeUndefined();
          }
        }, {
          message: 'Should use target returned by "getTarget" function',
          config: {
            id: 'standalone-callout',
            target: '#yogurt',
            getTarget(target) {
              return document.querySelector(target);
            },
            placement: 'bottom',
            title: 'This test is fun!',
            content: 'This is how we test this library!',
          },
          after() {
            PlacementTestUtils.verifyCalloutPlacement(document.querySelector('#yogurt'), 'bottom');
          }
        }
      ]
    }
  ];

  specGroups.forEach((specGroup) => {
    describe(specGroup.groupName, () => {
      specGroup.specs.forEach((spec) => {
        it(spec.message, () => {
          if (spec.before) {
            spec.before();
          }

          if (spec.error) {
            expect(() => {
              calloutManager.createCallout(spec.config);
            }).toThrow(new Error(spec.error));
          } else {
            calloutManager.createCallout(spec.config);
          }

          if (spec.after) {
            spec.after();
          }

          calloutManager.removeAllCallouts();
        }); //end "it" for a spec
      }); //end of specs loop
    }); //end "describe" for a spec group
  });//end of specGroups loop
});