import ContentsTestUtils from '../helpers/contents.js';

describe('Config option "showCloseButton"', () => {
  let specGroups = [
    {
      groupName: 'In standalone callouts',
      specs: [
        {
          message: 'Should be true by default',
          config: {
            id: 'standalone-callout',
            title: 'Standalone',
            content: 'This one is a standalone callout',
            target: '#yogurt',
            placement: 'left'
          },
          verify(spec) {
            let callout = hopscotch.getCalloutManager().createCallout(spec.config);
            ContentsTestUtils.verifyCloseButton(callout, true);
          }
        }, {
          message: 'Should not include close button when it is set to false',
          config: {
            id: 'standalone-callout',
            title: 'Standalone',
            content: 'This one is a standalone callout',
            target: '#yogurt',
            placement: 'left',
            showCloseButton: false
          },
          verify(spec) {
            let callout = hopscotch.getCalloutManager().createCallout(spec.config);
            ContentsTestUtils.verifyCloseButton(callout, false);
          }
        }, {
          message: 'Should respect global setting',
          config: {
            id: 'standalone-callout',
            title: 'Standalone',
            content: 'This one is a standalone callout',
            target: '#yogurt',
            placement: 'left'
          },
          verify(spec) {
            hopscotch.configure({
              showCloseButton: false
            });
            let callout = hopscotch.getCalloutManager().createCallout(spec.config);
            ContentsTestUtils.verifyCloseButton(callout, false);
          }
        }
      ]
    }, {
      groupName: 'In tour callouts',
      specs: [
        {
          message: 'Should be true by default',
          config: {
            id: 'hello-hopscotch',
            steps: [
              {
                title: 'Shopping list',
                content: 'This is the shopping list',
                target: '#shopping-list',
                placement: 'bottom'
              },
              {
                title: 'Item of a shopping list',
                content: 'This is the last item in the shopping list',
                target: '#yogurt',
                placement: 'left'
              }
            ]
          },
          verify(spec) {
            hopscotch.startTour(spec.config);
            expect(hopscotch.getCurrStepNum()).toEqual(0);
            ContentsTestUtils.verifyCloseButton(hopscotch.getCurrStepCallout(), true);
            hopscotch.nextStep();
            expect(hopscotch.getCurrStepNum()).toEqual(1);
            ContentsTestUtils.verifyCloseButton(hopscotch.getCurrStepCallout(), true);
            hopscotch.endTour();
          }
        }, {
          message: 'Should respect global setting',
          config: {
            id: 'hello-hopscotch',
            steps: [
              {
                title: 'Shopping list',
                content: 'This is the shopping list',
                target: '#shopping-list',
                placement: 'bottom'
              },
              {
                title: 'Item of a shopping list',
                content: 'This is the last item in the shopping list',
                target: '#yogurt',
                placement: 'left'
              }
            ]
          },
          verify(spec) {
            hopscotch.configure({
              showCloseButton: false
            });
            hopscotch.startTour(spec.config);
            expect(hopscotch.getCurrStepNum()).toEqual(0);
            ContentsTestUtils.verifyCloseButton(hopscotch.getCurrStepCallout(), false);
            hopscotch.nextStep();
            expect(hopscotch.getCurrStepNum()).toEqual(1);
            ContentsTestUtils.verifyCloseButton(hopscotch.getCurrStepCallout(), false);
            hopscotch.endTour();
          }
        }, {
          message: 'Should respect tour level setting',
          config: {
            id: 'hello-hopscotch',
            steps: [
              {
                title: 'Shopping list',
                content: 'This is the shopping list',
                target: '#shopping-list',
                placement: 'bottom'
              },
              {
                title: 'Item of a shopping list',
                content: 'This is the last item in the shopping list',
                target: '#yogurt',
                placement: 'left'
              }
            ],
            showCloseButton: false
          },
          verify(spec) {
            hopscotch.startTour(spec.config);
            expect(hopscotch.getCurrStepNum()).toEqual(0);
            ContentsTestUtils.verifyCloseButton(hopscotch.getCurrStepCallout(), false);
            hopscotch.nextStep();
            expect(hopscotch.getCurrStepNum()).toEqual(1);
            ContentsTestUtils.verifyCloseButton(hopscotch.getCurrStepCallout(), false);
            hopscotch.endTour();
          }
        }, {
          message: 'Should respect individual step setting',
          config: {
            id: 'hello-hopscotch',
            steps: [
              {
                title: 'Shopping list',
                content: 'This is the shopping list',
                target: '#shopping-list',
                placement: 'bottom',
                showCloseButton: true
              },
              {
                title: 'Item of a shopping list',
                content: 'This is the last item in the shopping list',
                target: '#yogurt',
                placement: 'left'
              }
            ],
            showCloseButton: false
          },
          verify(spec) {
            hopscotch.startTour(spec.config);
            expect(hopscotch.getCurrStepNum()).toEqual(0);
            ContentsTestUtils.verifyCloseButton(hopscotch.getCurrStepCallout(), true);
            hopscotch.nextStep();
            expect(hopscotch.getCurrStepNum()).toEqual(1);
            ContentsTestUtils.verifyCloseButton(hopscotch.getCurrStepCallout(), false);
            hopscotch.endTour();
          }
        }
      ]
    }
  ];

  specGroups.forEach((specGroup) => {
    describe(specGroup.groupName, () => {
      afterEach(() => {
        hopscotch.endTour();
        hopscotch.getCalloutManager().removeAllCallouts();
        hopscotch.resetDefaultOptions();
      });

      specGroup.specs.forEach((spec) => {
        it(spec.message, () => {
          spec.verify(spec);
        }); //end 'it' for a spec
      }); //end specs loop
    }); //end describe for a spcGroup
  }); //end spec groups loop

});