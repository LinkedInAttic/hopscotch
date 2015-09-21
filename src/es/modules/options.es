export default class Options {
  constructor(optionsHash, parent) {
    this.parent = parent;
    this.optionsHash = optionsHash;
  }
  getOption(optionName) {
    if(this.optionsHash && this.optionsHash[optionName]) {
      return this.optionsHash[optionName];
    }
    if(this.parent) {
      return this.parent.getOption(optionName);
    }
  }
  setOption(option, value) {
    if(!this.optionsHash) {
      this.optionsHash = {};
    }
    this.optionsHash[option] = value;
  }
  setOptions(options) {
    if(!this.optionsHash) {
      this.optionsHash = {};
    }
    utils.extend(this.optionsHash, options);
  }
}