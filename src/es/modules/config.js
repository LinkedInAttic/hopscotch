import * as Utils from './utils.js';

export default class Config {
  constructor(configHash, parentConfig) {
    this.parent = parentConfig;
    this.configHash = Utils.extend({}, configHash);
  }
  get(name) {
    if (this.configHash && typeof this.configHash[name] !== 'undefined') {
      return this.configHash[name];
    }
    if (this.parent) {
      return this.parent.get(name);
    }
  }
  set(name, value) {
    this.configHash[name] = value;
  }
}