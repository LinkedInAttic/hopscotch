import * as Utils from './utils.js';

/**
 * As the name suggests, config objects store configuration information for
 * tours, steps, standalone callouts, and global options. It's probably easier
 * to think of configs as the primary data layer for components throughout
 * the Hopscotch ecosystem.
 *
 * We've set up configuration objects to naturally encompass a hierarchical
 * structure, to reflect that many options can be set globally or
 * on a tour-by-tour basis. Commonly, you'll see the hierarchy for config
 * objects as follows...
 *
 * ````
 * default
 *     |
 *     |
 *     |
 * global (hopscotch.configure)
 *     |
 *     |
 *     |_______________________________________
 *     |                                      |
 *     |                                      |
 *     |                                      |
 * tour (from tour JSON)               standalone callout (from callout JSON)
 *     |
 *     |
 *     |
 * step (from tour JSON for given step)
 * ````
 */
export default class Config {
  /**
   * Create a new configuration object.
   *
   * @param {Object} configHash   - A set of properties to instantiate
   *                                this configuration with.
   * @param {Config} parentConfig - This configuration's parent. For instance,
   *                                this instance might be the configuration for
   *                                a step in a tour. Thus, this instance's parent
   *                                would be the tour's config.
   */
  constructor(configHash, parentConfig) {
    this._parent = parentConfig;
    this._configHash = Utils.extend({}, configHash);
  }

  /**
   * Get a single configuration value.
   * This method will traverse through this configuration's parents until it
   * finds an object that has this key or it reaches the root configuration.
   *
   * @param {String} name - The key to search for.
   * @returns {*} The first value found that matches the given key.
   *                   If the value isn't found, this will return undefined.
   */
  get(name) {
    if (this.configHash && typeof this.configHash[name] !== 'undefined') {
      return this.configHash[name];
    }
    if(this._parent) {
      return this._parent.get(name);
    }
  }

  /**
   * Get all values matching the given key from this configuration and its parents.
   * Unlike get(), this method doesn't stop at the first match, instead returning
   * all matches as an array. Useful for retrieving callbacks.
   *
   * @param {String} name - The key to search for.
   * @returns {*[]} An array of values found that matches the given key, returned
   *                     in order from child to parent. If no match was found, this
   *                     will return an empty array.
   */
  getAll(name) {
    let thisVal = this._configHash[name],
        parentVals = (this._parent) ? this._parent.getAll(parent) : [];
    if (typeof thisVal !== 'undefined') {
      parentVals.unshift(thisVal);
    }
    return parentVals;
  }

  /**
   * Set a value on this configuration.
   *
   * @param {String} name - The key to register.
   * @param {*} value - The value to register. Can be of any type.
   */
  set(name, value) {
    this._configHash[name] = value;
  }
}