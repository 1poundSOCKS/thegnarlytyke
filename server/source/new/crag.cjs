let Crag = function() {
  this.id = null;
  this.routes = [];
  this.topos = [];
}

Crag.prototype.Attach = function(oldCragObject) {
  this.id = oldCragObject.id;
  this.routes = oldCragObject.routes;
  this.topos = oldCragObject.topos;
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

module.exports = Crag;
