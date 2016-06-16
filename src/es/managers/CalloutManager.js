import * as Callouts from '../modules/callout.js';

//private variables for this module
let globalCfg;
let callouts = {};

/**
 * The CalloutManager handles the lifecycle of
 * individual callouts, providing the ability to
 * register, read, and destroy individual callouts.
 */
export default class CalloutManager {
  /**
   * Constructs the callout manager.
   *
   * @param {Config} globalConfig - The global configuration object, as
   *                                provided by Hopscotch.
   */
  constructor(globalConfig) {
    globalCfg = globalConfig;
  }

  /**
   * Create a new individual callout on the page. Similar to tours, you'll
   * pass in a configuration object with information about the callout's
   * contents, target, event handlers, and any other additional details.
   *
   * Callouts configurations are required to include a unique identifier,
   * which can later be used to fetch the callout. You'll receive an
   * error if the ID conflicts with a callout that hasn't yet been removed.
   *
   * @param {Object} configHash - The configuration for the callout you're
   *                              creating. See the docs for details about
   *                              what configuration options are recognized.
   * @returns {Callout} The newly created callout, rendered and showing.
   */
  createCallout(configHash) {
    let callout = this.getCallout(configHash.id);
    if (callout) {
      throw new Error('Callout by that id already exists. Please choose a unique id.');
    }
    callout = new Callouts.StandaloneCallout(configHash, globalCfg);
    callouts[configHash.id] = callout;
    try {
      callout.render();
      callout.show();
    } catch (err) {
      this.removeCallout(configHash.id);
      throw err;
    }
    return callout;
  }
  
  /**
   * Fetch an individual callout instance by its ID.
   *
   * @param {String} calloutId - The callout ID to look up.
   * @returns {?Callout} The callout matching that ID.
   */
  getCallout(calloutId) {
    return callouts[calloutId];
  }

  /**
   * Destroys the given callout and removes it from the manager's
   * registry of active callouts.
   *
   * @param {String} calloutId - The callout ID to destroy.
   */
  removeCallout(calloutId) {
    let callout = this.getCallout(calloutId);
    if (callout) {
      callout.destroy();
      delete callouts[calloutId];
    }
  }

  /**
   * Destroy all active individual callouts and removes each
   * from the manager's registry of active callouts.
   */
  removeAllCallouts() {
    for (let calloutId in callouts) {
      if (callouts.hasOwnProperty(calloutId)) {
        this.removeCallout(calloutId);
      }
    }
  }
}