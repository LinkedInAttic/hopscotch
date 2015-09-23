export default class Config {
  constructor(configHash, parent) {
    this.parent = parent;
    this.configHash = configHash;
  }
  get(name) {
    if(this.configHash && this.configHash[name]) {
      return this.configHash[name];
    }
    if(this.parent) {
      return this.parent.getOption(name);
    }
  }
  set(name, value) {
    if(!this.configHash) {
      this.configHash = {};
    }
    this.configHash[name] = value;
  }
}