import Callout from './callout.es';

export default class CalloutManager {
  constructor () {
    //console.log('Creating a new instance of CalloutManager');
  }
  createCallout(calloutOptions) {
    if(!calloutOptions || !calloutOptions.id) {
      throw new Error('Callout id is required');
    }

    let callout = this.getCallout(calloutOptions.id);

  }
  getCallout(calloutId) {

  }
  removeAllCallouts() {
   //console.log('Removing all callouts');
  }
  removeCallout() {

  }
}