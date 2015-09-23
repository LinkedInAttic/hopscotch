import Config from './config.js';

//Abstract base class for callouts
export class Callout {
  constructor (configHash) {
    this.config = new Config(configHash);
  }
  render() {
    let renderer = this.config.get('renderer');
    if(typeof renderer === 'function') {
      renderer(this.getRenderData());
    } else if (typeof renderer === 'string') {
      
    } else {
      throw new Error('Invalid renderer. Expected template name or a render function');
    }
  }
  show() {
  }
  hide() {

  }
  destroy() {

  }
  getRenderData() {
    throw new Error('This method my be implemented in the sub class');
  }
}

//Callout that is part of a tour
export class TourCallout extends Callout{
  constructor (configHash) {
    super(configHash);
  }
  getRenderData() {
    return {};
  }
}

//Sand-along callout
export class StandaloneCallout extends Callout {
  constructor (configHash) {
    super(configHash);
  }
  getRenderData() {
    return {};
  }
}