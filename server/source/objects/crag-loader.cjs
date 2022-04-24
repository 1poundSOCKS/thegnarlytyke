const Config = require('./config.cjs');

let CragLoader = function(cragID) {
  this.cragID = cragID;
}

CragLoader.prototype.LoadFromClient = async function() {
  const env = Config.environment;
  const cragURL = `env/${env}/data/${this.cragID}.crag.json`;
  let response = await fetch(cragURL);
  return response.json();
}

module.exports = CragLoader;
