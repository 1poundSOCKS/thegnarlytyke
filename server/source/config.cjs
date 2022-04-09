let Config = function() {
  this.environment = "prod";
  this.mode = "view";
}

Config.prototype.Load = function(config) {
  Object.assign(this, config);
  return this;
}

module.exports = new Config;
