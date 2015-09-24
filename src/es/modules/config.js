export default class Config {
  constructor(configHash, parentConfig) {
    this.parent = parentConfig;
    this.configHash = configHash;
  }
  get(name) {
    if(this.configHash && this.configHash[name]) {
      return this.configHash[name];
    }
    if(this.parent) {
      return this.parent.get(name);
    }
  }
  set(name, value) {
    if(!this.configHash) {
      this.configHash = {};
    }
    this.configHash[name] = value;
  }
}