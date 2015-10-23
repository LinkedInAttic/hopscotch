import PlacementTestUtils from '../helpers/placement.js';

describe('Config option "placement"', () => {
  let calloutManager = hopscotch.getCalloutManager();
  let specGroups = [
    {
      groupName: 'Placement "top"',
      specs: [
        {
          message: 'Callout should be shown above the target',
          config: {
            id: 'callout-placement-top',
            target: '#yogurt',
            placement: 'top',
            title: 'Callout with placement "top"',
            content: 'This wonderful callout should apear above the target element'
          }
        }, {
          message: 'Callout should be shown above the target when page is scrolled',
          config: {
            id: 'callout-placement-top',
            target: '#yogurt',
            placement: 'top',
            title: 'Callout with placement "top"',
            content: 'This wonderful callout should apear above the target element'
          },
          before: PlacementTestUtils.ensurePageScroll
        }, {
          message: 'Rtl callout should be shown above the target',
          config: {
            id: 'callout-placement-top',
            target: '#yogurt',
            placement: 'top',
            title: 'Callout with placement "top"',
            content: 'This wonderful callout should apear above the target element',
            isRtl: true
          }
        },
        {
          message: 'Callout should be positioned correctly after being hidden and shown again',
          config: {
            id: 'callout-placement-top',
            target: '#yogurt',
            placement: 'top',
            title: 'Callout with placement "top"',
            content: 'This wonderful callout should apear above the target element'
          },
          after() {
            let callout = calloutManager.getCallout('callout-placement-top');
            callout.hide();
            callout.render();
            callout.show();
            PlacementTestUtils.verifyCalloutPlacement(document.querySelector('#yogurt'), 'top');
          }
        }
      ]
    }, {
      groupName: 'Placement "bottom"',
      specs: [
        {
          message: 'Callout should be shown below the target',
          config: {
            id: 'callout-placement-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Callout with placement "bottom"',
            content: 'This wonderful callout should apear below the target element'
          }
        }, {
          message: 'Callout should be shown below the target when page is scrolled',
          config: {
            id: 'callout-placement-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Callout with placement "bottom"',
            content: 'This wonderful callout should apear below the target element'
          },
          before: PlacementTestUtils.ensurePageScroll
        }, {
          message: 'Rtl callout should be shown below the target',
          config: {
            id: 'callout-placement-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Callout with placement "bottom"',
            content: 'This wonderful callout should apear below the target element',
            isRtl: true
          }
        }
      ]
    }, {
      groupName: 'Placement "left"',
      specs: [
        {
          message: 'Callout should be shown to the left of the target',
          config: {
            id: 'callout-placement-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Callout with placement "left"',
            content: 'This wonderful callout should apear to the left of the target'
          }
        }, {
          message: 'Callout should be shown to the left of the target when page is scrolled',
          config: {
            id: 'callout-placement-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Callout with placement "left"',
            content: 'This wonderful callout should apear to the left of the target'
          },
          before: PlacementTestUtils.ensurePageScroll
        }, {
          message: 'Rtl callout should be shown to the right of the target',
          config: {
            id: 'callout-placement-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Callout with placement "left"',
            content: 'This wonderful callout should apear to the right of the target',
            isRtl: true
          },
          expectedPlacement: 'right'
        }
      ]
    }, {
      groupName: 'Placement "right"',
      specs: [
        {
          message: 'Callout should be shown to the right of the target',
          config: {
            id: 'callout-placement-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Callout with placement "right"',
            content: 'This wonderful callout should apear to the right of the target'
          }
        }, {
          message: 'Callout should be shown to the right of the target when page is scrolled',
          config: {
            id: 'callout-placement-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Callout with placement "right"',
            content: 'This wonderful callout should apear to the right of the target'
          },
          before: PlacementTestUtils.ensurePageScroll
        }, {
          message: 'Rtl callout should be shown to the left of the target',
          config: {
            id: 'callout-placement-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Callout with placement "right"',
            content: 'This wonderful callout should apear to the left of the target',
            isRtl: true
          },
          expectedPlacement: 'left'
        }
      ]
    }, {
      groupName: 'Invalid placement value',
      specs: [
        {
          message: 'Should throw an exception when placement is not provided',
          config: {
            id: 'callout-placement-missing',
            target: '#yogurt',
            title: 'Callout missing placement',
            content: 'This wonderful callout should not apear.'
          },
          error: 'Bubble placement failed because placement is invalid or undefined!'
        },
        {
          message: 'Should throw an exception when placement is null',
          config: {
            id: 'callout-placement-null',
            target: '#yogurt',
            placement: null,
            title: 'Callout with null placement',
            content: 'This wonderful callout should not apear.'
          },
          error: 'Bubble placement failed because placement is invalid or undefined!'
        },
        {
          message: 'Should throw an exception when provided placement value is not one of the supported values',
          config: {
            id: 'callout-placement-willy-nilly',
            target: '#yogurt',
            placement: 'willy nilly',
            title: 'Callout with willy nilly placement',
            content: 'This wonderful callout should not apear.'
          },
          error: 'Bubble placement failed because placement is invalid or undefined!'
        }
      ]
    }, {
      groupName: 'Placement with fixed positioned target',
      specs: [
        {
          message: 'Should appear next to the fixed target element',
          config: {
            id: 'callout-with-fixed-target',
            target: '.fixedTarget',
            placement: 'top',
            title: 'Callout with fixed target',
            content: 'This wonderful callout should appear next to the fixed target'
          },
          after() {
            let callout = calloutManager.getCallout('callout-with-fixed-target');
            expect(callout.el.style.position).toEqual('fixed');
          }
        }, {
          message: 'Should treat target as fixed, if one of the parent elements is fixed',
          config: {
            id: 'callout-fixed',
            target: '.fixedTarget span',
            placement: 'top',
            title: 'Callout with fixed target',
            content: 'This wonderful callout should appear next to the fixed target'
          },
          after() {
            let callout = calloutManager.getCallout('callout-fixed');
            expect(callout.el.style.position).toEqual('fixed');
          }
        }, {
          message: 'Should appear next to the fixed target element even if the page is scrolled',
          config: {
            id: 'callout-with-fixed-target-with-scroll',
            target: '.fixedTarget',
            placement: 'top',
            title: 'Callout with fixed target',
            content: 'This wonderful callout should appear next to the fixed target'
          },
          after() {
            let callout = calloutManager.getCallout('callout-with-fixed-target-with-scroll');
            expect(callout.el.style.position).toEqual('fixed');;
          }
        }
      ]
    }
  ];

  specGroups.forEach((specGroup) => {
    describe(specGroup.groupName, () => {

      afterEach(() => {
        //when debugging this, scroll to the bottom of the page
        //so we can see the callout
        //This is a convenient function to place a breakpoint
        //so you can see how callout is positioned after each test
        window.scrollTo(0, document.body.scrollHeight);
        PlacementTestUtils.resetPageScroll();
        calloutManager.removeAllCallouts();
      });

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
            //create a callout
            calloutManager.createCallout(spec.config);
            //verify arrow placement
            PlacementTestUtils.verifyCalloutPlacement(document.querySelector(spec.config.target), spec.expectedPlacement || spec.config.placement);
          }
          if (spec.after) {
            spec.after();
          }
        });
      });
    });
  });
});