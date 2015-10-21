import Config from './config.js';
import * as Utils from './utils.js';
import * as Callouts from '../modules/callout.js';

const DIRECTION = {
  PREV: -1,
  NEXT: 1
};

/**
 * Checks if given step has a valid target. Attempts to find next step
 * with valid target in case given step's target does not exist.
 * If tour is configured to skip steps without targets, this function
 * will update tour with skipped steps info
 * @private
 * @param {Tour} tour - a tour object steps of which will be checked
 * @param {Number} stepNum - step number at which to begin the search
 * @param {Number} direction - A direction in which steps are search. 
 *        Use const defined above DIRECTION.PREV and DIRECTION.NEXT 
 * @return {number|null}  null if there is no step with valid target,
 *        otherwise step number 
 */
function getStepWithTarget(tour, stepNum, direction) {
  let callout = tour.getStepCallout(stepNum);
  let targetEl = null;
  
  //there is no callout at this step number (step is either less than 0 or 
  // more that total number of steps). End tour by returning null
  if (!callout) {
    return null;
  }

  try {
    targetEl = callout.getTargetElement();
  } catch (err) {
    //Something went wrong while trying to get the target element
    //We will handle this down below based on skipIfNoElement config
  }

  let hasNoTarget = !targetEl;

  //mark the step as skipped if there is no target
  //if there is a target will be ensure that it is not marked as skipped
  tour.setSkippedStep(stepNum, hasNoTarget);

  if (hasNoTarget) {
    if (callout.config.get('skipIfNoElement')) {
      //continue to the next step if it's ok to skip steps without target
      return getStepWithTarget(tour, stepNum + direction, direction);
    } else {
      //end tour by exititing with null as return
      return null;
    }
  }

  //this step has a target, so we will use it as out next step
  return stepNum;
}

/**
 * Go to a specified step within a tour. Will handle hiding current callout,
 * finding the next step and showing it. Will end tour if no valid step found
 * @private
 * @param {Tour} tour - a tour object steps of which will be checked
 * @param {Number} stepNum - a step number to go to
 * @param {Number} direction - A direction in which tour is going (prev vs next) 
 *        Use const defined above DIRECTION.PREV and DIRECTION.NEXT 
 */
function goToStep(tour, stepNum, direction) {
  let stepNumber = (typeof stepNum === 'number') ? stepNum : 0;

  //Make sure that requested step has a valid target element.
  //If it does not - find the next step that has a valid target
  stepNumber = getStepWithTarget(tour, stepNumber, direction);

  //If there is no step with valid target, end the tour and exit
  if (typeof stepNumber !== 'number') {
    Utils.logError('Ended tour "' + tour.id + '". Step number was out of bounds or no step with valid target was found.');
    return tour.endTour();
  }

  //Hide previously shown callout
  let currCallout = tour.getCurrStepCallout();
  currCallout.hide();

  //Move on to the next step
  tour.setCurrStepNum(stepNumber);
  currCallout = tour.getCurrStepCallout();

  //Attempt to show the callout. End the tour if anything goes wrong.
  try {
    currCallout.render();
    currCallout.show();
  } catch (err) {
    tour.endTour();
  }
}

/**
 * Tour class encapsulates logic related to lifecycle of a tour. It stores information about current state of a tour, like 
 * current step number, child tour callouts, skipped steps, etc.
 */
export default class Tour {
  /**
   * Constructs an instance of a tour.
   *
   * @param {Object} configHash   - Configuration properties for this specific
   *                                tour. Including configuration for tour steps.
   * @param {Config} globalConfig - The global configuration object, including
   *                                all properties above configured globally on
   *                                hopcsotch instatnce.
   */
  constructor(configHash, globalConfig) {
    if (!configHash) {
      throw new Error('Tour config is required to start a tour.');
    }

    // Check validity of tour ID. If invalid, throw an error.
    if (!Utils.isIdValid(configHash.id)) {
      throw new Error('Tour ID is using an invalid format. Use alphanumeric, underscores, and/or hyphens only. First character must be a letter.');
    }

    /**
     * Unique identifier for this tour
     * @type {String}
     */
    this.id = configHash.id;

    /**
     * The configuration object for this tour.
     * @type {Config}
     */
    this.config = new Config(configHash, globalConfig);
    
    //Private variables
    this._originalConfig = configHash;
    this._currentStep = 0;
    this._events = {};
    this._stepCallouts = [];
    this._skippedSteps = [];

    if (!Array.isArray(configHash.steps) || !configHash.steps.length) {
      throw new Error('Tour requires an array of steps to be defined in the tour config.');
    }

    //create a callout for each defined step
    configHash.steps.forEach((step, idx) => {
      this._stepCallouts.push(new Callouts.TourCallout(step, this, idx));
    });
  }

  /**
   * Starts the tour at the specified step. If step number is not provided
   * tour will start on the first step (step at index 0)
   * @param {Number} stepNumber - Number of the step at which to start the tour
   */
  startTour(stepNumber) {
    goToStep(this, stepNumber, DIRECTION.NEXT);
  }

  /**
   * Goes forward one step in the tour
   */
  nextStep() {
    goToStep(this, this.getCurrStepNum() + DIRECTION.NEXT, DIRECTION.NEXT);
  }

  /**
   * Goes back one step in the tour
   */
  prevStep() {
    goToStep(this, this.getCurrStepNum() + DIRECTION.PREV, DIRECTION.PREV);
  }

  /**
   * End this tour and destroy all of the callouts that were created as part of this tour.
   */
  endTour() {
    this._stepCallouts.forEach((callout) => {
      callout.destroy();
    });
    this.setCurrStepNum(0);
    if (this._events.end) {
      this._events.end.forEach((callback) => {
        callback();
      });
    }
  }

  /**
   * Returns the current zero-based step number.
   * @return {Number} - zero-based number of the current step
   */
  getCurrStepNum() {
    return this._currentStep;
  }
  
  /**
   * Set current step number. Note, tour will not
   * move to a given step, this is merely just a setter
   * for a private property.
   * 
   * @param {Number} stepNumber - a zero-based number of the step to be set as current
   */
  setCurrStepNum(stepNumber) {
    this._currentStep = stepNumber;
  }

  /**
   * Returns step number of a given callout. Number will be adjusted to 
   * account for the skiped steps that preceed given callout.
   *
   * @param {Callout} callout - a callout whose step number needs to be determined
   * 
   * @return {Number} - zero-based step number, adjusted for skipped steps
   */
  getStepNumber(callout) {
    let stepNumber = this._stepCallouts.indexOf(callout);
    let skippedStepsCount = 0
    
    //this callout does not belong to the current tour
    if (stepNumber < 0) {
      return -1;
    }
    
    //adjust the step number with number of skipped steps
    //count number of steps skipped before current step
    this._skippedSteps.forEach((skippedStepNum) => {
      if (skippedStepNum < stepNumber) {
        skippedStepsCount++;
      }
    });

    return stepNumber - skippedStepsCount;
  }
  
  /**
   * Updates skipped status of a given step. This information will be used
   * to correctly number steps withing the tour, accounting for skipped steps 
   * 
   * @param {Number} stepNumber - zero-based number of the skipped step
   * @param {Boolean} isSkipped - whether the step was skipped
   */
  setSkippedStep(stepNumber, isSkipped) {
    let skippedIdx = this._skippedSteps.indexOf(stepNumber);

    if (isSkipped && skippedIdx < 0) {
      //the step is skipped and it's not in skipped steps array
      //we add it to the array
      this._skippedSteps.push(stepNumber);
    } else if (!isSkipped && skippedIdx >= 0) {
      //was previously skipped, but now it present
      //remove from the list of skipped steps
      this._skippedSteps.splice(skippedIdx, 1);
    }
  }
  
  /**
   * Returns the Callout object representing given step of the tour
   *
   * @param {Number} stepNumber - a zero-based index of a step
   *
   * @return {Callout} callout - a Callout object representing current tour step
   */
  getStepCallout(stepNumber) {
    return this._stepCallouts[stepNumber];
  }
  
  /**
   * Returns the Callout object representing current step of the tour
   *
   * @return {Callout} callout - a Callout object representing current tour step
   */
  getCurrStepCallout() {
    return this.getStepCallout(this.getCurrStepNum());
  }

  /**
   * Subsribes to an event emmitted by this tour
   * 
   * @param {String} eventName - name of the event
   * @param {Function} callback - a function to be executed when a given event occurs
   */
  on(eventName, callback) {
    if (!this._events[eventName]) {
      this._events[eventName] = [];
    }
    this._events[eventName].push(callback);
  }

  /**
   * Returns number of steps in this tour. Does not account for skipped steps.
   * 
   * @return {Number} - number of steps in this tour
   */
  getStepsCount() {
    return this._stepCallouts.length;
  }

  /**
   * Returns the original configuration properties of the tour when it was created
   * @return {Object} - the original configuration of the tour when it was created
   */
  getOriginalConfig() {
    return this._originalConfig;
  }
}