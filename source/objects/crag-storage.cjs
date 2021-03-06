// const Config = require('./config.cjs');
// const Crag = require('./crag.cjs');

let CragStorage = function(type, config) {
  this.type = type;
  if( config ) {
    this.dataURL = config.data_url;
    this.saveCragURL = config.save_crag_url;
  }
}

CragStorage.prototype.Load = async function(id) {
  switch( this.type ) {
    case 'client':
      return this.LoadFromClient(id);
  }
}

CragStorage.prototype.Save = async function(id) {
  switch( this.type ) {
    case 'client':
      return this.SaveFromClient(id);
  }
}

CragStorage.prototype.LoadFromClient = async function(id) {
  const cragURL = `${this.dataURL}${id}.crag.json`;
  let loadedString = await fetch(cragURL, {cache: "reload"});
  let crag = await loadedString.json();
  this.UpdateCragAfterRestore(crag);
  return crag;
}

CragStorage.prototype.SaveFromClient = async function(crag) {
  const cragToStore = this.FormatCragForStorage(crag);
  const requestBody = JSON.stringify(cragToStore);
  const url = `${this.saveCragURL}?id=${crag.id}`;
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    body: requestBody
  });
  return response;
}

CragStorage.prototype.UpdateCragAfterRestore = function(crag) {
  const routeInfoMap = new Map();
  if( crag.routes ) crag.routes.forEach( route => routeInfoMap.set(route.id, route) );

  const pointArray = [];
  const pointMap = new Map();

  const toposWithRoutes = crag.topos.filter( topo => topo.routes && topo.routes.length > 0 );

  toposWithRoutes.forEach( topo => {
    topo.routes.forEach( route => {
      route.info = routeInfoMap.get(route.id);
      route.points.forEach( point => {
        pointArray.push(point);
        pointMap.set(point.id, point);
      });
    });
  });

  pointArray.forEach( point => {
    if( point.attachedTo ) point.attachedTo = pointMap.get(point.attachedTo);
  });
}

CragStorage.prototype.FormatCragForStorage = function(crag) {
  const cragForStorage = {};
  if( crag.id ) cragForStorage.id = crag.id;
  if( crag.name ) cragForStorage.name = crag.name;
  if( crag.routes ) cragForStorage.routes = this.FormatRoutesForStorage(crag.routes);
  if( crag.topos ) cragForStorage.topos = this.FormatToposForStorage(crag.topos);
  return cragForStorage;
}

CragStorage.prototype.FormatRoutesForStorage = function(routes) {
  return routes.map( route => {
    return {
      id: route.id,
      name: route.name,
      grade: route.grade
    };
  });
}

CragStorage.prototype.FormatToposForStorage = function(topos) {
  return topos.map( topo => {
    const topoForStorage = {};
    if( topo.id ) topoForStorage.id = topo.id;
    if( topo.imageFile ) topoForStorage.imageFile = topo.imageFile;
    if( topo.routes ) topoForStorage.routes = this.FormatTopoRoutesForStorage(topo.routes);
    return topoForStorage;
  });
}

CragStorage.prototype.FormatTopoRoutesForStorage = function(routes) {
  return routes.map( route => {
    return {
      id: route.id,
      points: this.FormatPointsForStorage(route.points)
    };
  });
}

CragStorage.prototype.FormatPointsForStorage = function(points) {
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

module.exports = CragStorage;
