import PlacementTestUtils from '../helpers/placement.js';

describe('Config option "arrowOffset"', () => {
  let calloutManager = hopscotch.getCalloutManager();
  let specGroups = [{
    groupName: 'Placement "top"',
    specs: [
      {
        message: 'Callout with arrowOffset "center" should align center of the arrow with the center of the callout',
        config: {
          id: 'arrow-offset-callout',
          target: '#yogurt',
          placement: 'top',
          title: 'Placement "top"',
          content: 'Callout with arrow offset "center"',
          arrowOffset: 'center'
        },
        expectedOffset: 'center'
      }, {
        message: 'Callout with arrowOffset "40px" should push arrow 40px to the right from the callout\'s left edge',
        config: {
          id: 'arrow-offset-callout',
          target: '#yogurt',
          placement: 'top',
          title: 'Placement "top"',
          content: 'Callout with arrow offset "40px"',
          arrowOffset: '40px'
        },
        expectedOffset: 40
      }, {
        message: 'Callout with arrowOffset "0px" should align left edge of the arrow with the left edge of the callout',
        config: {
          id: 'arrow-offset-callout',
          target: '#yogurt',
          placement: 'top',
          title: 'Placement "top"',
          content: 'Callout with arrow offset "0px"',
          arrowOffset: '0px'
        },
        expectedOffset: 0
      }, {
        message: 'Callout with arrowOffset 0 should align left edge of the arrow with the left edge of the callout',
        config: {
          id: 'arrow-offset-callout',
          target: '#yogurt',
          placement: 'top',
          title: 'Placement "top"',
          content: 'Callout with arrow offset 0',
          arrowOffset: 0
        },
        expectedOffset: 0
      }, {
        message: 'Rtl callout with arrowOffset "center" should align center of the arrow with the center of the callout',
        config: {
          id: 'arrow-offset-callout',
          target: '#yogurt',
          placement: 'top',
          title: 'Placement "top"',
          content: 'Rtl callout with arrow offset "center"',
          arrowOffset: 'center',
          isRtl: true
        },
        expectedOffset: 'center'
      }, {
        message: 'Rtl callout with arrowOffset "40px" should push arrow 40px to the left from the callout\'s right edge',
        config: {
          id: 'arrow-offset-callout',
          target: '#yogurt',
          placement: 'top',
          title: 'Placement "top"',
          content: 'Rtl callout with arrow offset "40px"',
          arrowOffset: '40px',
          isRtl: true
        },
        expectedOffset: -40
      }, {
        message: 'Rtl callout with arrowOffset "0px" should align right edge of the arrow with the right edge of the callout',
        config: {
          id: 'arrow-offset-callout',
          target: '#yogurt',
          placement: 'top',
          title: 'Placement "top"',
          content: 'Rtl callout with arrow offset "0px"',
          arrowOffset: '0px',
          isRtl: true
        },
        expectedOffset: 0
      }, {
        message: 'Rtl callout with arrowOffset 0 should align right edge of the arrow with the right edge of the callout',
        config: {
          id: 'arrow-offset-callout',
          target: '#yogurt',
          placement: 'top',
          title: 'Placement "top"',
          content: 'Rtl callout with arrow offset 0',
          arrowOffset: 0,
          isRtl: true
        },
        expectedOffset: 0
      }, {
        message: 'Callout with invalid arrowOffset should default to 0',
        config: {
          id: 'arrow-offset-callout',
          target: '#yogurt',
          placement: 'top',
          title: 'Placement "top"',
          content: 'Callout with invalid arrow offset',
          arrowOffset: 'this is not valid'
        },
        expectedOffset: 0
      }
    ]
  }, {
      groupName: 'Placement "bottom"',
      specs: [
        {
          message: 'Callout with arrowOffset "center" should align center of the arrow with the center of the callout',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Placement "bottom"',
            content: 'Callout with arrow offset "center"',
            arrowOffset: 'center'
          },
          expectedOffset: 'center'
        }, {
          message: 'Callout with arrowOffset "40px" should push arrow 40px to the right from the callout\'s left edge',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Placement "bottom"',
            content: 'Callout with arrow offset "40px"',
            arrowOffset: '40px'
          },
          expectedOffset: 40
        }, {
          message: 'Callout with arrowOffset "0px" should align left edge of the arrow with the left edge of the callout',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Placement "bottom"',
            content: 'Callout with arrow offset "0px"',
            arrowOffset: '0px'
          },
          expectedOffset: 0
        }, {
          message: 'Callout with arrowOffset 0 should align left edge of the arrow with the left edge of the callout',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Placement "bottom"',
            content: 'Callout with arrow offset 0',
            arrowOffset: 0
          },
          expectedOffset: 0
        }, {
          message: 'Rtl callout with arrowOffset "center" should align center of the arrow with the center of the callout',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Placement "bottom"',
            content: 'Rtl callout with arrow offset "center"',
            arrowOffset: 'center',
            isRtl: true
          },
          expectedOffset: 'center'
        }, {
          message: 'Rtl callout with arrowOffset "40px" should push arrow 40px to the left from the callout\'s right edge',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Placement "bottom"',
            content: 'Rtl callout with arrow offset "40px"',
            arrowOffset: '40px',
            isRtl: true
          },
          expectedOffset: -40
        }, {
          message: 'Rtl callout with arrowOffset "0px" should align right edge of the arrow with the right edge of the callout',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Placement "bottom"',
            content: 'Rtl callout with arrow offset "0px"',
            arrowOffset: '0px',
            isRtl: true
          },
          expectedOffset: 0
        }, {
          message: 'Rtl callout with arrowOffset 0 should align right edge of the arrow with the right edge of the callout',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Placement "bottom"',
            content: 'Rtl callout with arrow offset 0',
            arrowOffset: 0,
            isRtl: true
          },
          expectedOffset: 0
        }, {
          message: 'Callout with invalid arrowOffset should default to 0',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Placement "bottom"',
            content: 'Callout with invalid arrow offset',
            arrowOffset: [1, 2, 3, 4, 5]
          },
          expectedOffset: 0
        }]
    },
    {
      groupName: 'Placement "left"',
      specs: [
        {
          message: 'Callout with arrowOffset "center" should align center of the arrow with the center of the callout',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'left',
            title: 'Placement "left"',
            content: 'Callout with arrow offset "center"',
            arrowOffset: 'center'
          },
          expectedOffset: 'center'
        }, {
          message: 'Callout with arrowOffset "40px" should push arrow 40px down from callout\'s top',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'left',
            title: 'Placement "left"',
            content: 'Callout with arrow offset "40px"',
            arrowOffset: '40px'
          },
          expectedOffset: 40
        }, {
          message: 'Callout with arrowOffset "0px" should align top of the arrow with the top of the callout',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'left',
            title: 'Placement "left"',
            content: 'Callout with arrow offset "0px"',
            arrowOffset: '0px'
          },
          expectedOffset: 0
        }, {
          message: 'Callout with arrowOffset 0 should align top of the arrow with the top of the callout',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'left',
            title: 'Placement "left"',
            content: 'Callout with arrow offset 0',
            arrowOffset: 0
          },
          expectedOffset: 0
        }, {
          message: 'Callout with invalid arrowOffset should default to 0',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'left',
            title: 'Placement "left"',
            content: 'Callout with invalid arrow offset',
            arrowOffset: { offsets: [10, 20, 50] }
          },
          expectedOffset: 0
        }
      ]
    },
    {
      groupName: 'Placement "right"',
      specs: [
        {
          message: 'Callout with arrowOffset "center" should align center of the arrow with the center of the callout',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'right',
            title: 'Placement "right"',
            content: 'Callout with arrow offset "center"',
            arrowOffset: 'center'
          },
          expectedOffset: 'center'
        }, {
          message: 'Callout with arrowOffset "40px" should push arrow 40px down from callout\'s top',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'right',
            title: 'Placement "right"',
            content: 'Callout with arrow offset "40px"',
            arrowOffset: '40px'
          },
          expectedOffset: 40
        }, {
          message: 'Callout with arrowOffset "0px" should align top of the arrow with the top of the callout',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'right',
            title: 'Placement "right"',
            content: 'Callout with arrow offset "0px"',
            arrowOffset: '0px'
          },
          expectedOffset: 0
        }, {
          message: 'Callout with arrowOffset 0 should align top of the arrow with the top of the callout',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'right',
            title: 'Placement "right"',
            content: 'Callout with arrow offset 0',
            arrowOffset: 0
          },
          expectedOffset: 0
        }, {
          message: 'Callout with invalid arrowOffset should default to 0',
          config: {
            id: 'arrow-offset-callout',
            target: '#yogurt',
            placement: 'right',
            title: 'Placement "right"',
            content: 'Callout with invalid arrow offset',
            arrowOffset: true
          },
          expectedOffset: 0
        }
      ]
    }
  ];

  specGroups.forEach((specGroup) => {
    describe(specGroup.groupName, () => {
      specGroup.specs.forEach((spec) => {
        it(spec.message, () => {
          if (spec.config.isRtl) {
            document.body.setAttribute('dir', 'rtl');
          }
          //create a callout
          calloutManager.createCallout(spec.config);
          //verify arrow placement
          PlacementTestUtils.verifyArrowOffset(spec.config.placement, spec.expectedOffset, spec.config.isRtl);
          //remove the callout
          calloutManager.removeAllCallouts();
          //reset text direction
          document.body.setAttribute('dir', 'ltr');
        });
      });
    });
  });
});