import ContentsTestUtils from '../helpers/contents.js';
import TourTestUtils from '../helpers/tour.js';

describe('Config option "skipIfNoElement"', () => {
  let specGroups = [
    {
      groupName: '"skipIfNoElement" is true',
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
                title: 'Another shopping list',
                content: 'This is the other shopping list',
                target: '#another-shopping-list-does-not-exist',
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
          after: function () {
            let currentCallout = hopscotch.getCurrStepCallout();
            hopscotch.nextStep();

            //should silently skip 2nd step, because it's target does not exist
            expect(hopscotch.getCurrStepNum()).toBe(2);
          }
        },
        {
          message: 'Can be configured per step',
          config: {
            id: 'hello-hopscotch',
            steps: [
              {
                title: 'Has no valid target',
                content: 'This will be skipped',
                target: '#another-shopping-list-does-not-exist',
                placement: 'bottom'
              },
              {
                title: 'Shopping list',
                content: 'This is the shopping list',
                target: '#shopping-list',
                placement: 'bottom'
              },
              {
                title: 'Item of a shopping list',
                content: 'This is important step that can not be skipped',
                target: '#expired-yogurt',
                placement: 'left',
                skipIfNoElement: false
              },
              {
                title: 'Item of a shopping list',
                content: 'This is the last item in the shopping list',
                target: '#yogurt',
                placement: 'left'
              }
            ]
          },
          after: function () {
            //first step will be skipped, se we end up on 2nd step
            expect(hopscotch.getCurrStepNum()).toBe(1);

            //3rd step does not have a valit target, but it can't be skipped,
            //so tour should end
            hopscotch.nextStep();
            TourTestUtils.verifyNoTourActive();
          }
        }
      ]
    }, {
      groupName: '"skipIfNoElement" is false',
      specs: [
        {
          message: 'Should end the tour when first step does not have a target',
          config: {
            id: 'hello-hopscotch',
            steps: [
              {
                title: 'Another shopping list',
                content: 'This is the other shopping list',
                target: '#another-shopping-list-does-not-exist',
                placement: 'bottom'
              },
              {
                title: 'Item of a shopping list',
                content: 'This is the last item in the shopping list',
                target: '#yogurt',
                placement: 'left'
              }
            ],
            skipIfNoElement: false
          },
          after: function () {
            TourTestUtils.verifyNoTourActive();
          }
        }, {
          message: 'Should end the tour when next step does not have a target',
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
                title: 'Another shopping list',
                content: 'This is the other shopping list',
                target: '#another-shopping-list-does-not-exist',
                placement: 'bottom'
              },
              {
                title: 'Item of a shopping list',
                content: 'This is the last item in the shopping list',
                target: '#yogurt',
                placement: 'left'
              }
            ],
            skipIfNoElement: false
          },
          after: function () {
            expect(hopscotch.getCurrStepNum()).toBe(0);
            hopscotch.nextStep();
            TourTestUtils.verifyNoTourActive();
          }
        }, {
          message: 'Should end the tour when prev step does not have a target',
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
                title: 'Another shopping list',
                content: 'This is the other shopping list',
                target: '#another-shopping-list-does-not-exist',
                placement: 'bottom'
              },
              {
                title: 'Item of a shopping list',
                content: 'This is the last item in the shopping list',
                target: '#yogurt',
                placement: 'left'
              }
            ],
            skipIfNoElement: false
          },
          after: function () {
            //grab current tour config and end it
            //since it was started on step 0 and we need it
            //to start on step 2
            var currentTour = hopscotch.getCurrTour();
            hopscotch.endTour();
        
            //start tour on the last step
            hopscotch.startTour(currentTour, 2);
            expect(hopscotch.getCurrStepNum()).toBe(2);
            hopscotch.prevStep();
            TourTestUtils.verifyNoTourActive();
          }
        }, {
          message: 'Should end the tour when going to a step without a target',
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
              },
              {
                title: 'Another shopping list',
                content: 'This is the other shopping list',
                target: '#another-shopping-list-does-not-exist',
                placement: 'bottom'
              }
            ],
            skipIfNoElement: false
          },
          after: function () {
            expect(hopscotch.getCurrStepNum()).toBe(0);

            hopscotch.showStep(2);
            TourTestUtils.verifyNoTourActive();
          }
        }
      ]
    }, {
      groupName: 'Step numbering with skipped steps',
      specs: [
        {
          message: 'Should adjust step number label based on skipped steps',
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
                title: 'Another shopping list',
                content: 'This is the other shopping list',
                target: '#another-shopping-list-does-not-exist',
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
          after: function () {
            expect(hopscotch.getCurrStepNum()).toBe(0);
            ContentsTestUtils.verifyStepNumber(hopscotch.getCurrStepCallout(), '1');

            hopscotch.nextStep();
            //should  skip 2nd step, because it's target does not exist
            expect(hopscotch.getCurrStepNum()).toBe(2);
            //lebel should say 2 instead of 3, since actual 2nd step was skipped
            ContentsTestUtils.verifyStepNumber(hopscotch.getCurrStepCallout(), '2');
          }
        }, {
          message: 'Should unskip skipped steps if target is created',
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
                title: 'Another shopping list',
                content: 'This is the other shopping list',
                target: '#grapes',
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
          after: function () {
            expect(hopscotch.getCurrStepNum()).toBe(0);
            ContentsTestUtils.verifyStepNumber(hopscotch.getCurrStepCallout(), '1');

            hopscotch.nextStep();
            //should  skip 2nd step, because it's target does not exist
            expect(hopscotch.getCurrStepNum()).toBe(2);
            //lebel should say 2 instead of 3, since actual 2nd step was skipped
            ContentsTestUtils.verifyStepNumber(hopscotch.getCurrStepCallout(), '2');
            
            //create previously missing grapes element
            let listEl = document.querySelector('#shopping-list ul');
            let grapesLi = document.createElement('li');
            grapesLi.id = 'grapes';
            grapesLi.innerHTML = 'Grapes';
            listEl.appendChild(grapesLi);
            
            //go back to grapes step
            hopscotch.prevStep();
            expect(hopscotch.getCurrStepNum()).toBe(1);
            //step number should still be 2
            ContentsTestUtils.verifyStepNumber(hopscotch.getCurrStepCallout(), '2');
            
            //go to yogurt step again
            hopscotch.nextStep();
            expect(hopscotch.getCurrStepNum()).toBe(2);
            //it shold now be labeled as step 3
            ContentsTestUtils.verifyStepNumber(hopscotch.getCurrStepCallout(), '3');
          }
        }
      ]
    }, {
      groupName: 'Prev and next buttons with skipped steps',
      specs: [
        {
          message: 'Should not have a previous button on the first step shown',
          config: {
            id: 'hello-hopscotch',
            steps: [
              {
                title: 'Another shopping list',
                content: 'This is the other shopping list',
                target: '#another-shopping-list-does-not-exist',
                placement: 'bottom'
              },
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
            showPrevButton: true
          },
          after: function () {
            //should have skipped the first step
            expect(hopscotch.getCurrStepNum()).toBe(1);

            //should show next button, and now show the previous button since it's the first step
            let currentCallout = hopscotch.getCurrStepCallout();
            ContentsTestUtils.verifyNextButton(currentCallout, true);
            ContentsTestUtils.verifyPrevButton(currentCallout, false);
          }
        }
      ]
    }
  ];

  specGroups.forEach((specGroup) => {
    describe(specGroup.groupName, () => {

      afterEach(() => {
        hopscotch.endTour();
      });

      specGroup.specs.forEach((spec) => {
        it(spec.message, () => {
          if (spec.error) {
            expect(() => {
              hopscotch.startTour(spec.config);
            }).toThrow(new Error(spec.error));
          } else {
            hopscotch.startTour(spec.config);
          }

          if (spec.after) {
            spec.after();
          }
        }); //end 'it' for a spec
      }); //end specs loop
    }); //end describe for a spcGroup
  }); //end spec groups loop

});