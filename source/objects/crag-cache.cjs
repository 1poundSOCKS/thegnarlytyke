const Crag = require('./crag.cjs')

let CragCache = function(dataStorage) {
  this.dataStorage = dataStorage;
  this.map = new Map();
}

CragCache.prototype.Load = async function(id) {
  let crag = this.map.get(id)
  if( crag ) return crag
  crag = new Crag()
  await crag.LoadForUserEdit(id,this.dataStorage)
  this.map.set(id, crag)
  return crag
}

module.exports = CragCache;
