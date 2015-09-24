import Config from './config.js';
import * as Utils from './utils.js';

let validIdRegEx = /^[a-zA-Z]+[a-zA-Z0-9_-]*$/;

export default class Tour {
  constructor(configHash, globalConfig) {
    if (!configHash) {
      throw new Error('Tour data is required for startTour.');
    }

    // Check validity of tour ID. If invalid, throw an error.
    if (!Utils.isIdValid(configHash.id)) {
      throw new Error('Tour ID is using an invalid format. Use alphanumeric, underscores, and/or hyphens only. First character must be a letter.');
    }
    this.id = configHash.id;
    this.steps = configHash.steps;
    this.config = new Config(configHash, globalConfig);
  }
  startTour(stepNumber) {
    //console.log('starting tour at step ${stepNumber}');
  }
}