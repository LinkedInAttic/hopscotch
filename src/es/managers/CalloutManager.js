import * as Callouts from '../modules/callout.js';

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