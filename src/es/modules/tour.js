export default class Tour {

  constructor (tourConfig) {
    if(!tourConfig){
      throw new Error('Tour data is required for startTour.');
    }

    // Check validity of tour ID. If invalid, throw an error.
    if(!tourConfig.id || !validIdRegEx.test(tourConfig.id)) {
      throw new Error('Tour ID is using an invalid format. Use alphanumeric, underscores, and/or hyphens only. First character must be a letter.');
    }

  }
  startTour(stepNumber) {
    //console.log('starting tour at step ${stepNumber}');
  }
}