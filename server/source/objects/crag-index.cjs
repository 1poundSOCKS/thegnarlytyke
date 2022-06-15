let uuid = require('uuid');

let CragIndex = function(config) {
  this.dataURL = config.data_url;
  this.data = null;
}

CragIndex.prototype.Load = async function() {
  const response = await fetch(`${this.dataURL}crag-index.json`, {cache: "reload"});
  this.data = await response.json();
  return this.data;
}

CragIndex.prototype.AppendCrag = function() {
  const cragCount = this.data.crags.push({id: uuid.v4(),name:"NEW CRAG"})
  return this.data.crags[cragCount-1]
}

module.exports = CragIndex;
