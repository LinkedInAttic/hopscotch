import * as Callouts from '../modules/callout.js';
import * as Utils from '../modules/utils.js';

//private variables for this module
let globalCfg;
let callouts = {};

//CalloutManager class definition
//Handles lyfecycles of standalone callouts
export default class CalloutManager {
  constructor(globalConfig) {
    globalCfg = globalConfig;
  }
  createCallout(configHash) {
    if (!Utils.isIdValid(configHash.id)) {
      throw new Error('Callout ID is using an invalid format. Use alphanumeric, underscores, and/or hyphens only. First character must be a letter.');
    }

    let callout = this.getCallout(configHash.id);
    if (callout) {
                throw new Error('Callout by that id already exists. Please choose a unique id.');
    }
    callout = new Callouts.StandaloneCallout(configHash, globalCfg);
    callouts[configHash.id] = callout;    
    callout.render();
    callout.show();
    return callout;
  }
  getCallout(calloutId) {
    return callouts[calloutId];
  }
  removeCallout(calloutId) {
    let callout = this.getCallout(calloutId);
    if (callout) {
      callout.destroy();
      delete callouts[calloutId];
    }
  }
  removeAllCallouts() {
    for (let calloutId in callouts) {
      if (callouts.hasOwnProperty(calloutId)) {
        this.removeCallout(calloutId);
      }
    }
  }
}