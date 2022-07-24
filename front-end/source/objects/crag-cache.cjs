const CragStorage = require('./crag-storage.cjs')
const Crag = require('./crag.cjs')

let CragCache = function(config) {
  this.config = config;
  this.map = new Map();
}

CragCache.prototype.Load = async function(id) {
  let crag = this.map.get(id)
  if( crag ) return crag
  const cragStorage = new CragStorage('client', this.config)
  crag = new Crag(await cragStorage.Load(id))
  this.map.set(id, crag)
  return crag
}

module.exports = CragCache;
