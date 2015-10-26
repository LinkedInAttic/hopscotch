import PlacementTestUtils from '../helpers/placement.js';

describe('Config option "xOffset"', () => {
  let calloutManager = hopscotch.getCalloutManager();
  let specGroups = [{
    groupName: 'Placement "top"',
    specs: [
      {
        message: 'Callout with xOffset "50px" should move 50px to the right',
        config: {
          id: 'xOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Awesome callout with xOffset "50px"',
          xOffset: '50px'
        },
        expectedOffset: 50
      },
      {
        message: 'Rtl callout with xOffset "50px" should move 50px to the left',
        config: {
          id: 'xOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Awesome callout with xOffset "50px"',
          xOffset: '50px',
          isRtl: true
        },
        expectedOffset: -50
      },
      {
        message: 'Callout with xOffset 50 should move 50px to the right',
        config: {
          id: 'xOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Awesome callout with xOffset 50',
          xOffset: 50
        },
        expectedOffset: 50
      },
      {
        message: 'Callout with xOffset "-50px" should move 50px to the left',
        config: {
          id: 'xOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Awesome callout with xOffset "-50px"',
          xOffset: '-50px'
        },
        expectedOffset: -50
      },
      {
        message: 'Rtl callout with xOffset "-50px" should move 50px to the right',
        config: {
          id: 'xOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Awesome callout with xOffset "-50px"',
          xOffset: '-50px',
          isRtl: true
        },
        expectedOffset: 50
      },
      {
        message: 'Callout with xOffset -50 should move 50px to the left',
        config: {
          id: 'xOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Awesome callout with xOffset -50',
          xOffset: -50
        },
        expectedOffset: -50
      },
      {
        message: 'Callout with xOffset "center" should align horizontal center of the callout with horizontal center of the target',
        config: {
          id: 'xOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Awesome callout with xOffset "center"',
          xOffset: 'center'
        },
        expectedOffset: 'center'
      },
      {
        message: 'Rtl callout with xOffset "center" should align horizontal center of the callout with horizontal center of the target',
        config: {
          id: 'xOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Awesome callout with xOffset "center"',
          xOffset: 'center',
          isRtl: true
        },
        expectedOffset: 'center'
      },
      {
        message: 'Callout with xOffset "0px" should override global xOffset and reset callout\'s offset to 0',
        before() {
          hopscotch.configure({ xOffset: '50px' });
        },
        config: {
          id: 'xOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Awesome callout with xOffset "0px"',
          xOffset: '0px'
        },
        expectedOffset: 0
      },
      {
        message: 'Rtl callout with xOffset "0px" should override global xOffset and reset callout\'s offset to 0',
        before() {
          hopscotch.configure({ xOffset: '50px' });
        },
        config: {
          id: 'xOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Awesome callout with xOffset "0px"',
          xOffset: '0px',
          isRtl: true
        },
        expectedOffset: 0
      },
      {
        message: 'Callout with xOffset 0 should override global xOffset and reset callout\'s offset to 0',
        before() {
          hopscotch.configure({ xOffset: '50px' });
        },
        config: {
          id: 'xOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Awesome callout with xOffset 0',
          xOffset: 0
        },
        expectedOffset: 0
      },
      {
        message: 'Callout with invalid xOffset should default to 0',
        config: {
          id: 'xOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Callout with invalid xOffset',
          xOffset: { isValid: 'not valid at all' }
        },
        expectedOffset: 0
      }
    ]
  }, {
      groupName: 'Placement "bottom"',
      specs: [{
        message: 'Callout with xOffset "50px" should move 50px to the right',
        config: {
          id: 'xOffset-bottom',
          target: '#yogurt',
          placement: 'bottom',
          title: 'Pacement "bottom"',
          content: 'Awesome callout with xOffset "50px"',
          xOffset: '50px'
        },
        expectedOffset: 50
      },
        {
          message: 'Rtl callout with xOffset "50px" should move 50px to the left',
          config: {
            id: 'xOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Awesome callout with xOffset "50px"',
            xOffset: '50px',
            isRtl: true
          },
          expectedOffset: -50
        },
        {
          message: 'Callout with xOffset 50 should move 50px to the right',
          config: {
            id: 'xOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Awesome callout with xOffset 50',
            xOffset: 50
          },
          expectedOffset: 50
        },
        {
          message: 'Callout with xOffset "-50px" should move 50px to the left',
          config: {
            id: 'xOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Awesome callout with xOffset "-50px"',
            xOffset: '-50px'
          },
          expectedOffset: -50
        },
        {
          message: 'Rtl callout with xOffset "-50px" should move 50px to the right',
          config: {
            id: 'xOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Awesome callout with xOffset "-50px"',
            xOffset: '-50px',
            isRtl: true
          },
          expectedOffset: 50
        },
        {
          message: 'Callout with xOffset -50 should move 50px to the left',
          config: {
            id: 'xOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Awesome callout with xOffset -50',
            xOffset: -50
          },
          expectedOffset: -50
        },
        {
          message: 'Callout with xOffset "center" should align horizontal center of the callout with horizontal center of the target',
          config: {
            id: 'xOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Awesome callout with xOffset "center"',
            xOffset: 'center'
          },
          expectedOffset: 'center'
        },
        {
          message: 'Rtl callout with xOffset "center" should align horizontal center of the callout with horizontal center of the target',
          config: {
            id: 'xOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Awesome callout with xOffset "center"',
            xOffset: 'center',
            isRtl: true
          },
          expectedOffset: 'center'
        },
        {
          message: 'Callout with xOffset "0px" should override global xOffset and reset callout\'s offset to 0',
          before() {
            hopscotch.configure({ xOffset: '50px' });
          },
          config: {
            id: 'xOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Awesome callout with xOffset "0px"',
            xOffset: '0px'
          },
          expectedOffset: 0
        },
        {
          message: 'Rtl callout with xOffset "0px" should override global xOffset and reset callout\'s offset to 0',
          before() {
            hopscotch.configure({ xOffset: '50px' });
          },
          config: {
            id: 'xOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Awesome callout with xOffset "0px"',
            xOffset: '0px',
            isRtl: true
          },
          expectedOffset: 0
        },
        {
          message: 'Callout with xOffset 0 should override global xOffset and reset callout\'s offset to 0',
          before() {
            hopscotch.configure({ xOffset: '50px' });
          },
          config: {
            id: 'xOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Awesome callout with xOffset 0',
            xOffset: 0
          },
          expectedOffset: 0
        },
        {
          message: 'Callout with invalid xOffset should default to 0',
          config: {
            id: 'xOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Callout with invalid xOffset',
            xOffset: { isValid: 'not valid at all' }
          },
          expectedOffset: 0
        }
      ]
    }, {
      groupName: 'Placement "left"',
      specs: [
        {
          message: 'Callout with xOffset "50px" should move 50px to the right',
          config: {
            id: 'xOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with xOffset "50px"',
            xOffset: '50px'
          },
          expectedOffset: 50
        },
        {
          message: 'Rtl callout with xOffset "50px" should move 50px to the left',
          config: {
            id: 'xOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with xOffset "50px"',
            xOffset: '50px',
            isRtl: true
          },
          expectedOffset: -50
        },
        {
          message: 'Callout with xOffset 50 should move 50px to the right',
          config: {
            id: 'xOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with xOffset 50',
            xOffset: 50
          },
          expectedOffset: 50
        },
        {
          message: 'Callout with xOffset "-50px" should move 50px to the left',
          config: {
            id: 'xOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with xOffset "-50px"',
            xOffset: '-50px'
          },
          expectedOffset: -50
        },
        {
          message: 'Rtl callout with xOffset "-50px" should move 50px to the left',
          config: {
            id: 'xOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with xOffset "-50px"',
            xOffset: '-50px',
            isRtl: true
          },
          expectedOffset: 50
        },
        {
          message: 'Callout with xOffset -50 should move 50px to the left',
          config: {
            id: 'xOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with xOffset -50',
            xOffset: -50
          },
          expectedOffset: -50
        },
        {
          message: 'Callout with xOffset "center" should default to 0 because centering callout would overlay the target',
          config: {
            id: 'xOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with xOffset "center"',
            xOffset: 'center'
          },
          expectedOffset: 0
        },
        {
          message: 'Rtl callout with xOffset "center" should default to 0 because centering callout would overlay the target',
          config: {
            id: 'xOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with xOffset "center"',
            xOffset: 'center',
            isRtl: true
          },
          expectedOffset: 0
        },
        {
          message: 'Callout with xOffset "0px" should override global xOffset and reset callout\'s offset to 0',
          before() {
            hopscotch.configure({ xOffset: '50px' });
          },
          config: {
            id: 'xOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with xOffset "0px"',
            xOffset: '0px'
          },
          expectedOffset: 0
        },
        {
          message: 'Callout with xOffset 0 should override global xOffset and reset callout\'s offset to 0',
          before() {
            hopscotch.configure({ xOffset: '50px' });
          },
          config: {
            id: 'xOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with xOffset 0',
            xOffset: 0
          },
          expectedOffset: 0
        },
        {
          message: 'Rtl callout with xOffset 0 should override global xOffset and reset callout\'s offset to 0',
          before() {
            hopscotch.configure({ xOffset: '50px' });
          },
          config: {
            id: 'xOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with xOffset 0',
            xOffset: 0,
            isRtl: true
          },
          expectedOffset: 0
        },
        {
          message: 'Callout with invalid xOffset should default to 0',
          config: {
            id: 'xOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with invalid xOffset',
            xOffset: 'does not make sense'
          },
          expectedOffset: 0
        }
      ]
    },
    {
      groupName: 'Placement "right"',
      specs: [
        {
          message: 'Callout with xOffset "50px" should move 50px to the right',
          config: {
            id: 'xOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with xOffset "50px"',
            xOffset: '50px'
          },
          expectedOffset: 50
        },
        {
          message: 'Rtl callout with xOffset "50px" should move 50px to the right',
          config: {
            id: 'xOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with xOffset "50px"',
            xOffset: '50px',
            isRtl: true
          },
          expectedOffset: -50
        },
        {
          message: 'Callout with xOffset 50 should move 50px to the right',
          config: {
            id: 'xOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with xOffset 50',
            xOffset: 50
          },
          expectedOffset: 50
        },
        {
          message: 'Callout with xOffset "-50px" should move 50px to the right',
          config: {
            id: 'xOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with xOffset "-50px"',
            xOffset: '-50px'
          },
          expectedOffset: -50
        },
        {
          message: 'Rtl callout with xOffset "-50px" should move 50px to the right',
          config: {
            id: 'xOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with xOffset "-50px"',
            xOffset: '-50px',
            isRtl: true
          },
          expectedOffset: 50
        },
        {
          message: 'Callout with xOffset -50 should move 50px to the right',
          config: {
            id: 'xOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with xOffset -50',
            xOffset: -50
          },
          expectedOffset: -50
        },
        {
          message: 'Callout with xOffset "center" should default to 0 because centering callout would overlay the target',
          config: {
            id: 'xOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with xOffset "center"',
            xOffset: 'center'
          },
          expectedOffset: 0
        },
        {
          message: 'Rtl callout with xOffset "center" should default to 0 because centering callout would overlay the target',
          config: {
            id: 'xOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with xOffset "center"',
            xOffset: 'center',
            isRtl: true
          },
          expectedOffset: 0
        },
        {
          message: 'Callout with xOffset "0px" should override global xOffset and reset callout\'s offset to 0',
          before() {
            hopscotch.configure({ xOffset: '50px' });
          },
          config: {
            id: 'xOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with xOffset "0px"',
            xOffset: '0px'
          },
          expectedOffset: 0
        },
        {
          message: 'Callout with xOffset 0 should override global xOffset and reset callout\'s offset to 0',
          before() {
            hopscotch.configure({ xOffset: '50px' });
          },
          config: {
            id: 'xOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with xOffset 0',
            xOffset: 0
          },
          expectedOffset: 0
        },
        {
          message: 'Rtl callout with xOffset 0 should override global xOffset and reset callout\'s offset to 0',
          before() {
            hopscotch.configure({ xOffset: '50px' });
          },
          config: {
            id: 'xOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with xOffset 0',
            xOffset: 0,
            isRtl: true
          },
          expectedOffset: 0
        },
        {
          message: 'Callout with invalid xOffset should default to 0',
          config: {
            id: 'xOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with invalid xOffset',
            xOffset: 'does not make sense'
          },
          expectedOffset: 0
        }
      ]
    }
  ];

  function runUnitTest(spec) {
    if (typeof spec.before === 'function') {
      spec.before();
    }
    //create a callout
    calloutManager.createCallout(spec.config);
    //verify arrow placement
    PlacementTestUtils.verifyXOffset(document.querySelector(spec.config.target), spec.config.placement, spec.expectedOffset, spec.config.isRtl);
    //remove the callout
    calloutManager.removeAllCallouts();
  }

  specGroups.forEach((specGroup) => {
    describe(specGroup.groupName, () => {
      specGroup.specs.forEach((spec) => {
        it(spec.message, () => {
          runUnitTest(spec);
        }); //end "it" for a spec
      }); //end specs loop
    }); //end "describe" for a spec group
    
    describe(specGroup.groupName + ' with dir="rtl"', () => {
      beforeEach(() => {
        document.body.setAttribute('dir', 'rtl');
      });
      afterEach(() => {
        document.body.setAttribute('dir', 'ltr');
        hopscotch.resetDefaultOptions();
      });
      specGroup.specs.forEach((spec) => {
        it(spec.message, () => {
          runUnitTest(spec);
        }); //end "it" for a spec
      }); //end specs loop
    }); //end "describe" for a spec group
  });//end spec group loop
});