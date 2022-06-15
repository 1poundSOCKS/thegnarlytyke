let CragIndex = function(config) {
  this.dataURL = config.data_url;
  this.data = null;
}

CragIndex.prototype.Load = async function() {
  const response = await fetch(`${this.dataURL}crag-index.json`, {cache: "reload"});
  this.data = await response.json();
}

module.exports = CragIndex;
