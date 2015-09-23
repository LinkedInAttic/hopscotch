import Options from './modules/options.es';

//Abstract base class for callouts
export class Callout {
  constructor (config) {
    this.config = = new Options(config);
  }
  render() {
    let renderer = this.config.get('renderer');
  }
  show() {
    console.log(this.options);
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
  constructor (options) {
    super(options);
  }
  getRenderData() {

  }
}

//Sand-along callout
export class StandaloneCallout extends Callout {
  constructor (options) {
    super(options);
  }
  getRenderData() {

  }
}