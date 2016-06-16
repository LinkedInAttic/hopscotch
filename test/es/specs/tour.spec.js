import ContentsTestUtils from '../helpers/contents.js';
import PlacementTestUtils from '../helpers/placement.js';
import TourTestUtils from '../helpers/tour.js';

describe('Tour', () => {
  const ERRORS = {
    TOUR_ID_INVALID: 'Tour ID is using an invalid format. Use alphanumeric, underscores, and/or hyphens only. First character must be a letter.',
    MISSING_TOUR_CONFIG: 'Tour config is required to start a tour.',
    MISSING_TOUR_STEPS: 'Tour requires an array of steps to be defined in the tour config.'
  };
  let specGroups = [
    {
      groupName: 'Invalid config',
      specs: [
        {
          message: 'Should throw an exception when tour config is not provided',
          config: undefined,
          error: ERRORS.MISSING_TOUR_CONFIG
        }, {
          message: 'Should reject tours without id',
          config: {},
          error: ERRORS.TOUR_ID_INVALID
        }, {
          message: 'Should reject tours with boolean id value',
          config: {
            id: true
          },
          error: ERRORS.TOUR_ID_INVALID
        }, {
          message: 'Should reject tours with array as id value',
          config: {
            id: ['id1', 'id2']
          },
          error: ERRORS.TOUR_ID_INVALID
        }, {
          message: 'Should reject tours with object as id value',
          config: {
            id: { id1: 'id2' }
          },
          error: ERRORS.TOUR_ID_INVALID
        }, {
          message: 'Should reject tour IDs that include invalid characters',
          config: {
            id: '(this is a bad tour id!)'
          },
          error: ERRORS.TOUR_ID_INVALID
        }, {
          message: 'Should throw an exception if tour steps are not defined',
          config: {
            id: 'hello-hopscotch'
          },
          error: ERRORS.MISSING_TOUR_STEPS
        }, {
          message: 'Should throw an exception if tour steps is not an array',
          config: {
            id: 'hello-hopscotch',
            steps: true
          },
          error: ERRORS.MISSING_TOUR_STEPS
        }, {
          message: 'Should throw an exception if tour steps is an empty array',
          config: {
            id: 'hello-hopscotch',
            steps: []
          },
          error: ERRORS.MISSING_TOUR_STEPS
        }
      ]
    }, {
      groupName: 'Multi step tour',
      specs: [
        {
          message: 'Should start tour on the first step and go to next and prev steps',
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
          after() {
            expect(hopscotch.getCurrStepNum()).toBe(0);
            hopscotch.nextStep();
            expect(hopscotch.getCurrStepNum()).toBe(1);
            hopscotch.prevStep();
            expect(hopscotch.getCurrStepNum()).toBe(0);
            hopscotch.endTour();
            TourTestUtils.verifyNoTourActive();
          }
        }, {
          message: 'Should end tour when navigating to prev step from the first step',
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
          after() {
            expect(hopscotch.getCurrStepNum()).toBe(0);
            hopscotch.prevStep();
            TourTestUtils.verifyNoTourActive();
          }
        }, {
          message: 'Should end tour when navigating to next step from the last step in a tour',
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
          after() {
            hopscotch.nextStep();
            expect(hopscotch.getCurrStepNum()).toBe(1);
            hopscotch.nextStep();
            TourTestUtils.verifyNoTourActive();
          }
        }, {
          message: 'Should recover gracefully when callout DOM element is destroyed',
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
          after() {
            let shoppingList = document.querySelector('#shopping-list');
            let yogurt = document.querySelector('#yogurt');

            expect(hopscotch.getCurrStepNum()).toBe(0);
            PlacementTestUtils.verifyCalloutPlacement(shoppingList, 'bottom', hopscotch.getCurrStepCallout().el);

            //Remove first step's callout from the DOM
            hopscotch.getCurrStepCallout().destroy();
            
            //go to the next step
            hopscotch.nextStep();
            expect(hopscotch.getCurrStepNum()).toBe(1);
            PlacementTestUtils.verifyCalloutPlacement(yogurt, 'left', hopscotch.getCurrStepCallout().el);
            
            //remove second step's callout from the DOM
            hopscotch.getCurrStepCallout().destroy();

            //go back to the first step
            hopscotch.prevStep();
            expect(hopscotch.getCurrStepNum()).toBe(0);
            PlacementTestUtils.verifyCalloutPlacement(shoppingList, 'bottom', hopscotch.getCurrStepCallout().el);

            //go to the second step
            hopscotch.nextStep();
            expect(hopscotch.getCurrStepNum()).toBe(1);
            PlacementTestUtils.verifyCalloutPlacement(yogurt, 'left', hopscotch.getCurrStepCallout().el);
          }
        }, {
          message: 'hopscotch.prev and hopscotch.next should not do anything when there is no active tour',
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
          after() {
            hopscotch.endTour();
            TourTestUtils.verifyNoTourActive();

            hopscotch.nextStep();
            TourTestUtils.verifyNoTourActive();

            hopscotch.prevStep();
            TourTestUtils.verifyNoTourActive();
          }
        }
      ]
    }, {
      groupName: 'Multiple tours',
      specs: [
        {
          message: 'Can re-start the same tour after it ended',
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
          after() {
            expect(hopscotch.getCurrStepNum()).toBe(0);
            let currentTour = hopscotch.getCurrTour();

            hopscotch.endTour();
            TourTestUtils.verifyNoTourActive();

            hopscotch.startTour(currentTour);
            expect(hopscotch.getCurrStepNum()).toBe(0);
          }
        }, {
          message: 'Can start a new tour after previous tour ended',
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
          after() {
            let anotherTour = {
              id: 'hello-new-features',
              steps: [
                {
                  title: 'Bread',
                  content: 'Bread is the head of the table',
                  target: '#bread',
                  placement: 'bottom'
                },
                {
                  title: 'Milk',
                  content: 'Milk makes your bones strong!',
                  target: '#milk',
                  placement: 'left'
                }
              ]
            };

            expect(hopscotch.getCurrStepNum()).toBe(0);
            let currentTour = hopscotch.getCurrTour();
            expect(currentTour.id).toBe('hello-hopscotch');

            hopscotch.endTour();
            TourTestUtils.verifyNoTourActive();

            hopscotch.startTour(anotherTour);
            currentTour = hopscotch.getCurrTour();
            expect(hopscotch.getCurrStepNum()).toBe(0);
            expect(currentTour.id).toBe('hello-new-features');
          }
        }, {
          message: 'Should not start a tour when another tour is in progress',
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
          after() {
            expect(hopscotch.getCurrStepNum()).toBe(0);
            expect(() => {
              hopscotch.startTour({
                id: 'another-tour'
                ,
                steps: []
              });
            }).toThrow(new Error('Can not start a tour. Tour \'hello-hopscotch\' is currently in progress'));
          }
        }
      ]
    }, {
      groupName: 'hopscotch.showStep',
      specs: [
        {
          message: 'Should skip to a given step in the tour',
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
                title: 'Item of a shopping list',
                content: 'This is another item in the shopping list',
                target: '#milk',
                placement: 'left'
              }
            ]
          },
          after() {
            expect(hopscotch.getCurrStepNum()).toEqual(0);
            hopscotch.showStep(2);
            expect(hopscotch.getCurrStepNum()).toEqual(2);
          }
        }, {
          message: 'Should go to the next step with target',
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
                title: 'Non-existent item',
                content: 'This item does not exist',
                target: '#not-here',
                placement: 'left'
              },
              {
                title: 'Item of a shopping list',
                content: 'This is another item in the shopping list',
                target: '#milk',
                placement: 'left'
              }
            ]
          },
          after() {
            expect(hopscotch.getCurrStepNum()).toEqual(0);
            hopscotch.showStep(2);
            //should skip over step without target and go to the next one
            expect(hopscotch.getCurrStepNum()).toEqual(3);
          }
        }, {
          message: 'Should end the tour if there is no step with target',
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
                title: 'Non-existent item',
                content: 'This item does not exist',
                target: '#not-here',
                placement: 'left'
              }
            ]
          },
          after() {
            expect(hopscotch.getCurrStepNum()).toEqual(0);
            hopscotch.showStep(2);
            //should skip over step without target and end the tour
            //when it does not find another step without target
            TourTestUtils.verifyNoTourActive();
          }
        }, {
          message: 'Should end the tour if step number is out of bounds',
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
          after() {
            expect(hopscotch.getCurrStepNum()).toEqual(0);
            hopscotch.showStep(2);
            //step number is out of bounds - end the tour
            TourTestUtils.verifyNoTourActive();
          }
        }, {
          message: 'Should go to first step if step number is not provided',
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
          after() {
            expect(hopscotch.getCurrStepNum()).toEqual(0);
            hopscotch.nextStep();
            expect(hopscotch.getCurrStepNum()).toEqual(1);

            //should go to the first step if step number is not provided
            hopscotch.showStep();
            expect(hopscotch.getCurrStepNum()).toEqual(0);
          }
        }, {
          message: 'Should not do anything if there is no active tour',
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
          after() {
            hopscotch.endTour();
            TourTestUtils.verifyNoTourActive();

            hopscotch.showStep(1);
            TourTestUtils.verifyNoTourActive();
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
    }); //end 'describe' for a spec group 
  });//end spec group loop

});