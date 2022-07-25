let Config = function() {
}

Config.prototype.Load = async function() {
  const response = await fetch('config.json', {cache: "reload"});
  const configData = await response.json();
  Object.assign(this, configData);
}

module.exports = new Config;
