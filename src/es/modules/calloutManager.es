import * as Callouts from './callout.es';

export default class CalloutManager {
  constructor () {
    this.callouts = {
    };
    //console.log('Creating a new instance of CalloutManager');
  }
  createCallout(calloutConfig) {
    if(!calloutConfig || !calloutConfig.id) {
      throw new Error('Callout id is required');
    }

    let callout = this.getCallout(calloutConfig.id);
    if(!callout) {
      callout = new  Callouts.StandaloneCallout(calloutConfig);
      this.callouts[calloutConfig.id] = callout;
    }
    return callout;
  }
  getCallout(calloutId) {
    return this.callouts[calloutId];
  }
  removeAllCallouts() {
   //console.log('Removing all callouts');
  }
  removeCallout() {
  }
}