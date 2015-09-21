//Abstract base class for callouts
export class Callout {
  constructor (options) {
    this.calloutOptions = options;
  }
  show() {
    console.log(this.calloutOptions);
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