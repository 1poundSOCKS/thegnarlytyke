let uuid = require('uuid');
const Route = require('./route.cjs');

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

Crag.prototype.Save = async function(dataStorage) {
  const cragData = this.FormatForStorage();
  return dataStorage.Save(`${this.id}.crag`, cragData);
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

Crag.prototype.AppendRoute = function(name, grade) {
  const route = new Route().route;
  route.name = name;
  route.grade = grade;
  this.routes.push(route);
  return route;
}

Crag.prototype.FormatForStorage = function() {
  const cragForStorage = {};
  if( this.id ) cragForStorage.id = this.id;
  if( this.name ) cragForStorage.name = this.name;
  if( this.routes ) cragForStorage.routes = this.FormatRoutesForStorage();
  if( this.topos ) cragForStorage.topos = this.FormatToposForStorage();
  return cragForStorage;
}

Crag.prototype.FormatRoutesForStorage = function() {
  if( !this.routes ) return [];
  return this.routes.map( route => {
    return {
      id: route.id,
      name: route.name,
      grade: route.grade
    };
  });
}

Crag.prototype.FormatToposForStorage = function() {
  if( !this.topos ) return [];
  return this.topos.map( topo => {
    const topoForStorage = {};
    if( topo.id ) topoForStorage.id = topo.id;
    if( topo.imageFile ) topoForStorage.imageFile = topo.imageFile;
    if( topo.routes ) topoForStorage.routes = this.FormatTopoRoutesForStorage(topo.routes);
    return topoForStorage;
  });
}

Crag.prototype.FormatTopoRoutesForStorage = function(routes) {
  return routes.map( route => {
    return {
      id: route.id,
      points: this.FormatPointsForStorage(route.points)
    };
  });
}

Crag.prototype.FormatPointsForStorage = function(points) {
  if( !points ) return [];
  return points.map( point => {
    const pointToSave = {id: point.id};
    if( point.attachedTo ) {
      pointToSave.attachedTo = point.attachedTo.id;
    }
    else {
      pointToSave.x = point.x;
      pointToSave.y = point.y;
    }
    return pointToSave;
  });
}

module.exports = Crag;
