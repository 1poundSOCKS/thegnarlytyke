const Config = require('./config.cjs');
const Crag = require('./crag.cjs');

let CragLoader = function(type) {
  this.type = type;
}

CragLoader.prototype.Load = async function(id) {
  switch( this.type ) {
    case 'client':
      return this.LoadFromClient(id);
  }
}

CragLoader.prototype.Save = async function(id) {
  switch( this.type ) {
    case 'client':
      return this.SaveFromClient(id);
  }
}

CragLoader.prototype.LoadFromClient = async function(id) {
  const env = Config.environment;
  const cragURL = `env/${env}/data/${id}.crag.json`;
  let loadedString = await fetch(cragURL);
  let crag = await loadedString.json();
  this.UpdateCragAfterRestore(crag);
  return crag;
}

CragLoader.prototype.SaveFromClient = async function(crag) {
  const cragToStore = this.FormatCragForStorage(crag);
  const requestBody = JSON.stringify(cragToStore);
  return fetch('./save_crag', {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'same-origin',
    body: requestBody
  });
}

CragLoader.prototype.UpdateCragAfterRestore = function(crag) {
  const routeInfoMap = new Map();
  crag.routes.forEach( route => routeInfoMap.set(route.id, route) );

  const pointArray = [];
  const pointMap = new Map();

  crag.topos.forEach( topo => {
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

CragLoader.prototype.FormatCragForStorage = function(crag) {
  const cragForStorage = {
    id: crag.id,
    name: crag.name,
    routes: crag.routes ? this.FormatRoutesForStorage(crag.routes) : [],
    topos: crag.topos ? this.FormatToposForStorage(crag.topos) : []
  }
  return cragForStorage;
}

CragLoader.prototype.FormatRoutesForStorage = function(routes) {
  return routes.map( route => {
    return {
      id: route.id,
      name: route.name,
      grade: route.grade
    };
  });
}

CragLoader.prototype.FormatToposForStorage = function(topos) {
  return topos.map( topo => {
    return {
      id: topo.id,
      imageFile: topo.imageFile,
      routes: this.FormatTopoRoutesForStorage(topo.routes)
    };
  });
}

CragLoader.prototype.FormatTopoRoutesForStorage = function(routes) {
  return routes.map( route => {
    return {
      id: route.id,
      points: this.FormatPointsForStorage(route.points)
    };
  });
}

CragLoader.prototype.FormatPointsForStorage = function(points) {
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

module.exports = CragLoader;
