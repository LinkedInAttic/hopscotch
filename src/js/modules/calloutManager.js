/**
 * HopscotchCalloutManager
 *
 * @class Manages the creation and destruction of single callouts.
 * @constructor
 */
var HopscotchCalloutManager = function() {
  var callouts = {},
    calloutOpts = {};

  /**
   * createCallout
   *
   * Creates a standalone callout. This callout has the same API
   * as a Hopscotch tour bubble.
   *
   * @param {Object} opt The options for the callout. For the most
   * part, these are the same options as you would find in a tour
   * step.
   */
  this.createCallout = function(opt) {
    var callout;

    if (opt.id) {
      if(!validIdRegEx.test(opt.id)) {
        throw new Error('Callout ID is using an invalid format. Use alphanumeric, underscores, and/or hyphens only. First character must be a letter.');
      }
      if (callouts[opt.id]) {
        throw new Error('Callout by that id already exists. Please choose a unique id.');
      }
      opt.showNextButton = opt.showPrevButton = false;
      opt.isTourBubble = false;
      callout = new HopscotchBubble(opt);
      callouts[opt.id] = callout;
      calloutOpts[opt.id] = opt;
      if (opt.target) {
        callout.render(opt, null, function() {
          callout.show();
          if (opt.onShow) {
            utils.invokeCallback(opt.onShow);
          }
        });
      }
    }
    else {
      throw new Error('Must specify a callout id.');
    }
    return callout;
  };

  /**
   * getCallout
   *
   * Returns a callout by its id.
   *
   * @param {String} id The id of the callout to fetch.
   * @returns {Object} HopscotchBubble
   */
  this.getCallout = function(id) {
    return callouts[id];
  };

  /**
   * removeAllCallouts
   *
   * Removes all existing callouts.
   */
  this.removeAllCallouts = function() {
    var calloutId;

    for (calloutId in callouts) {
      if (callouts.hasOwnProperty(calloutId)) {
        this.removeCallout(calloutId);
      }
    }
  };

  /**
   * removeCallout
   *
   * Removes an existing callout by id.
   *
   * @param {String} id The id of the callout to remove.
   */
  this.removeCallout = function(id) {
    var callout = callouts[id];

    callouts[id] = null;
    calloutOpts[id] = null;
    if (!callout) { return; }

    callout.destroy();
  };

  /**
   * refreshCalloutPositions
   *
   * Refresh the positions for all callouts known by the
   * callout manager. Typically you'll use
   * hopscotch.refreshBubblePosition() to refresh ALL
   * bubbles instead of calling this directly.
   */
  this.refreshCalloutPositions = function(){
    var calloutId,
      callout,
      opts;

    for (calloutId in callouts) {
      if (callouts.hasOwnProperty(calloutId) && calloutOpts.hasOwnProperty(calloutId)) {
        callout = callouts[calloutId];
        opts = calloutOpts[calloutId];
        if(callout && opts){
          callout.setPosition(opts);
        }
      }
    }
  };
};