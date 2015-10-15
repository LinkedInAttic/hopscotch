import PlacementTestUtils from '../helpers/placement.js';

describe('Config option "yOffset"', () => {
  let calloutManager = hopscotch.getCalloutManager();
  let specGroups = [{
    groupName: 'Placement "top"',
    specs: [
      {
        message: 'Callout with yOffset "50px" should move 50px down',
        config: {
          id: 'yOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Awesome callout with yOffset "50px"',
          yOffset: '50px'
        },
        expectedOffset: 50
      },
      {
        message: 'Callout with yOffset 50 should move 50px down',
        config: {
          id: 'yOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Awesome callout with yOffset 50',
          yOffset: 50
        },
        expectedOffset: 50
      },
      {
        message: 'Callout with yOffset "-50px" should move 50px up',
        config: {
          id: 'yOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Awesome callout with yOffset "-50px"',
          yOffset: '-50px'
        },
        expectedOffset: -50
      },
      {
        message: 'Callout with yOffset -50 should move 50px up',
        config: {
          id: 'yOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Awesome callout with yOffset -50',
          yOffset: -50
        },
        expectedOffset: -50
      },
      {
        message: 'Callout with yOffset "center" should default to yOffset 0, since centering callout will overlay the target',
        config: {
          id: 'yOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Awesome callout with yOffset "center"',
          yOffset: 'center'
        },
        expectedOffset: 0
      },
      {
        message: 'Callout with yOffset "0px" should override global yOffset and reset callout\'s offset to 0',
        before() {
          hopscotch.configure({ yOffset: '50px' });
        },
        config: {
          id: 'yOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Awesome callout with yOffset "0px"',
          yOffset: '0px'
        },
        expectedOffset: 0
      },
      {
        message: 'Callout with yOffset 0 should override global yOffset and reset callout\'s offset to 0',
        before() {
          hopscotch.configure({ yOffset: '50px' });
        },
        config: {
          id: 'yOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Awesome callout with yOffset 0',
          yOffset: 0
        },
        expectedOffset: 0
      },
      {
        message: 'Callout with invalid yOffset should default to 0',
        config: {
          id: 'yOffset-top',
          target: '#yogurt',
          placement: 'top',
          title: 'Pacement "top"',
          content: 'Callout with invalid yOffset',
          yOffset: { isValid: 'not valid at all' }
        },
        expectedOffset: 0
      }
    ]
  },
    {
      groupName: 'Placement "bottom"',
      specs: [
        {
          message: 'Callout with yOffset "50px" should move 50px down',
          config: {
            id: 'yOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Awesome callout with yOffset "50px"',
            yOffset: '50px'
          },
          expectedOffset: 50
        },
        {
          message: 'Callout with yOffset 50 should move 50px down',
          config: {
            id: 'yOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Awesome callout with yOffset 50',
            yOffset: 50
          },
          expectedOffset: 50
        },
        {
          message: 'Callout with yOffset "-50px" should move 50px up',
          config: {
            id: 'yOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Awesome callout with yOffset "-50px"',
            yOffset: '-50px'
          },
          expectedOffset: -50
        },
        {
          message: 'Callout with yOffset -50 should move 50px up',
          config: {
            id: 'yOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Awesome callout with yOffset -50',
            yOffset: -50
          },
          expectedOffset: -50
        },
        {
          message: 'Callout with yOffset "center" should default to yOffset 0, since centering callout will overlay the target',
          config: {
            id: 'yOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Awesome callout with yOffset "center"',
            yOffset: 'center'
          },
          expectedOffset: 0
        },
        {
          message: 'Callout with yOffset "0px" should override global yOffset and reset callout\'s offset to 0',
          before() {
            hopscotch.configure({ yOffset: '50px' });
          },
          config: {
            id: 'yOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Awesome callout with yOffset "0px"',
            yOffset: '0px'
          },
          expectedOffset: 0
        },
        {
          message: 'Callout with yOffset 0 should override global yOffset and reset callout\'s offset to 0',
          before() {
            hopscotch.configure({ yOffset: '50px' });
          },
          config: {
            id: 'yOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Awesome callout with yOffset 0',
            yOffset: 0
          },
          expectedOffset: 0
        },
        {
          message: 'Callout with invalid yOffset should default to 0',
          config: {
            id: 'yOffset-bottom',
            target: '#yogurt',
            placement: 'bottom',
            title: 'Pacement "bottom"',
            content: 'Awesome callout with invalid yOffset',
            yOffset: ['no, does not work']
          },
          expectedOffset: 0
        }
      ]
    },
    {
      groupName: 'Placement "left"',
      specs: [
        {
          message: 'Callout with yOffset "50px" should move 50px down',
          config: {
            id: 'yOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with yOffset "50px"',
            yOffset: '50px'
          },
          expectedOffset: 50
        },
        {
          message: 'Callout with yOffset 50 should move 50px down',
          config: {
            id: 'yOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with yOffset 50',
            yOffset: 50
          },
          expectedOffset: 50
        },
        {
          message: 'Callout with yOffset "-50px" should move 50px up',
          config: {
            id: 'yOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with yOffset "-50px"',
            yOffset: '-50px'
          },
          expectedOffset: -50
        },
        {
          message: 'Callout with yOffset -50 should move 50px up',
          config: {
            id: 'yOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with yOffset -50',
            yOffset: -50
          },
          expectedOffset: -50
        },
        {
          message: 'Callout with yOffset "center" should have it\'s vertical center aligned with the vertical center of the target element',
          config: {
            id: 'yOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with yOffset "center"',
            yOffset: 'center'
          },
          expectedOffset: 'center'
        },
        {
          message: 'Callout with yOffset "0px" should override global yOffset and reset callout\'s offset to 0',
          before() {
            hopscotch.configure({ yOffset: '50px' });
          },
          config: {
            id: 'yOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with yOffset "0px"',
            yOffset: '0px'
          },
          expectedOffset: 0
        },
        {
          message: 'Callout with yOffset 0 should override global yOffset and reset callout\'s offset to 0',
          before() {
            hopscotch.configure({ yOffset: '50px' });
          },
          config: {
            id: 'yOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with yOffset 0',
            yOffset: 0
          },
          expectedOffset: 0
        },
        {
          message: 'Callout with invalid yOffset should default to 0',
          config: {
            id: 'yOffset-left',
            target: '#yogurt',
            placement: 'left',
            title: 'Pacement "left"',
            content: 'Awesome callout with invalid yOffset',
            yOffset: 'does not make sense'
          },
          expectedOffset: 0
        }
      ]
    },
    ,
    {
      groupName: 'Placement "right"',
      specs: [
        {
          message: 'Callout with yOffset "50px" should move 50px down',
          config: {
            id: 'yOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with yOffset "50px"',
            yOffset: '50px'
          },
          expectedOffset: 50
        },
        {
          message: 'Callout with yOffset 50 should move 50px down',
          config: {
            id: 'yOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with yOffset 50',
            yOffset: 50
          },
          expectedOffset: 50
        },
        {
          message: 'Callout with yOffset "-50px" should move 50px up',
          config: {
            id: 'yOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with yOffset "-50px"',
            yOffset: '-50px'
          },
          expectedOffset: -50
        },
        {
          message: 'Callout with yOffset -50 should move 50px up',
          config: {
            id: 'yOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with yOffset -50',
            yOffset: -50
          },
          expectedOffset: -50
        },
        {
          message: 'Callout with yOffset "center" should have it\'s vertical center aligned with the vertical center of the target element',
          config: {
            id: 'yOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with yOffset "center"',
            yOffset: 'center'
          },
          expectedOffset: 'center'
        },
        {
          message: 'Callout with yOffset "0px" should override global yOffset and reset callout\'s offset to 0',
          before() {
            hopscotch.configure({ yOffset: '50px' });
          },
          config: {
            id: 'yOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with yOffset "0px"',
            yOffset: '0px'
          },
          expectedOffset: 0
        },
        {
          message: 'Callout with yOffset 0 should override global yOffset and reset callout\'s offset to 0',
          before() {
            hopscotch.configure({ yOffset: '50px' });
          },
          config: {
            id: 'yOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with yOffset 0',
            yOffset: 0
          },
          expectedOffset: 0
        },
        {
          message: 'Callout with invalid yOffset should default to 0',
          config: {
            id: 'yOffset-right',
            target: '#yogurt',
            placement: 'right',
            title: 'Pacement "right"',
            content: 'Awesome callout with invalid yOffset',
            yOffset: 'does not make sense'
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
          if (typeof spec.before === 'function') {
            spec.before();
          }
          //create a callout
          calloutManager.createCallout(spec.config);
          //verify arrow placement
          PlacementTestUtils.verifyYOffset(document.querySelector(spec.config.target), spec.config.placement, spec.expectedOffset);
          //remove the callout
          calloutManager.removeAllCallouts();
        }); //end "it" for a spec
      }); //end specs loop
    }); //end "describe" for a spec group 
  });//end spec group loop
});