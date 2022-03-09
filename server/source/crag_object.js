let uuid = require('uuid');

module.exports = CreateCragObject = loadedObject => {
  let cragID = uuid.v4();
  if( !loadedObject ) {
    return {
      loadedObject: {},
      id: cragID,
      routes: [],
      topos: []
    };
  }

  let cragRoutes = loadedObject.routes ? loadedObject.routes.map(route => {
    return {
      id: route.id
    };
  })
  : [];
  
  let cragTopos = loadedObject.topos ? loadedObject.topos.map(topo => {
    return {
      id: topo.id,
      imageFilename: topo.imageFile ? topo.imageFile : null
    };
  })
  : [];
  
  return {
    id: cragID,
    routes: cragRoutes,
    topos: cragTopos
  }
}

module.exports = SetUUIDGenFunction = (cragObject, UUIDGenFunction) => {
  cragObject.UUIDGenFunction = UUIDGenFunction;
}

module.exports = GetCragTopoIDs = cragObject => {
  return cragObject.topos ? cragObject.topos.map( topo => topo.id ) : [];
}

module.exports = GetCragRoutes = cragObject => {
  return cragObject.routes;
}

module.exports = GetTopoImageFilename = (cragObject, id) => {
  let matchingTopos = cragObject.topos.filter( topo => topo.id == id );
  if( matchingTopos.length == 0 ) return null;
  return matchingTopos[0].imageFilename;
}

module.exports = GetTopoRouteIDs = (cragObject, topoID) => {
  return [ '111-aaa' ];
}

module.exports = GetTopoRouteInfo = (cragObject, topoID, routeID) => {
  return { name: 'Gnarly Route', grade: 'e12 7b' };
}

module.exports = AppendRouteToCrag = (cragObject, routeName, routeGrade) => {
  let routeID = uuidv4(cragObject);
  return cragObject.routes[cragObject.routes.push({id: routeID, name: routeName, grade: routeGrade}) - 1];
}

let uuidv4 = cragObject => {
  return cragObject.UUIDGenFunction ? cragObject.UUIDGenFunction() : uuid.v4();
}
