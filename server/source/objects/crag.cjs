let uuid = require('uuid');

let Crag = function(cragObject) {
  if( cragObject ) {
    this.Attach(cragObject);
  }
  else {
    this.id = uuid.v4();
    this.routes = [];
    this.topos = [];
  }
}

Crag.prototype.Attach = function(cragObject) {
  this.id = cragObject.id;
  this.name = cragObject.name;
  this.routes = cragObject.routes ? cragObject.routes : [];
  this.topos = cragObject.topos ? cragObject.topos : [];
}

Crag.prototype.AppendTopo = function(topo) {
  return this.topos.push(topo);
}

Crag.prototype.GetTopoIndex = function(topoID) {
  const indexedTopos = this.topos.map( (topo, index) => {
    return {topo: topo, index: index}
  });
  const matchingTopos = indexedTopos.filter(indexedTopo => indexedTopo.topo.id === topoID);
  if( matchingTopos.length != 1 ) return -1;
  return matchingTopos[0].index;
}

Crag.prototype.GetLastTopoIndex = function () {
  return this.topos.length - 1;
}

Crag.prototype.SwapTopos = function(index1, index2) {
  const firstTopo = this.topos[index1];
  this.topos[index1] = this.topos[index2];
  this.topos[index2] = firstTopo;
}

Crag.prototype.GetMatchingTopo = function(id) {
  let matchingTopos = this.topos.filter( topo => topo.id === id );
  if( matchingTopos.length != 1 ) return null;
  return matchingTopos[0];
}

Crag.prototype.GetMatchingRoute = function(id) {
  if( !this.routes ) return null;
  let matchingRoutes =  this.routes.filter( route => route.id === id);
  if( matchingRoutes.length != 1 ) return null;
  return matchingRoutes[0];
}

module.exports = Crag;
