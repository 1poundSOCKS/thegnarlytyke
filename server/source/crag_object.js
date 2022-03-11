let uuid = require('uuid');

module.exports = rsRouteStart = Symbol("rsRouteStart");
module.exports = rsRouteLine = Symbol("rsRouteLine");

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

  let objectCopy = Object.assign( { loadedObject: loadedObject, id: cragID }, loadedObject );
  if( !objectCopy.routes ) objectCopy.routes = [];
  if( !objectCopy.topos ) objectCopy.topos = [];

  return objectCopy;
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

module.exports = GetTopoImageFile = (cragObject, topoID) => {
  let firstMatchingTopo = GetFirstMatchingTopo(cragObject, topoID);
  return firstMatchingTopo && firstMatchingTopo.imageFile ? firstMatchingTopo.imageFile : null;
}

module.exports = GetTopoRouteIDs = (cragObject, topoID) => {
  let firstMatchingTopo = GetFirstMatchingTopo(cragObject, topoID);
  return (firstMatchingTopo && firstMatchingTopo.routes) ? firstMatchingTopo.routes.map(route => route.id) : [];
}

module.exports = GetCragRouteInfo = (cragObject, routeID) => {
  let firstMatchingRoute = GetFirstMatchingRoute(cragObject, routeID);
  return firstMatchingRoute ? {
    name: firstMatchingRoute.name,
    grade: firstMatchingRoute.grade
  } : null;
}

module.exports = GetTopoOverlayRenderSteps = (cragObject, topoID) => {
  let firstMatchingTopo = GetFirstMatchingTopo(cragObject, topoID);
  console.log(`*** topo: ${JSON.stringify(firstMatchingTopo)}`);
  if( !firstMatchingTopo ) return [];

  let routeStartMarkers = firstMatchingTopo.routes.map(route => {
    if( !route.points || route.points.length == 0) return null;
    else return { type: rsRouteStart, x: route.points[0].x, y: route.points[0].y }
  });

  return routeStartMarkers.filter( step => step );
}

module.exports = GetRenderStepType = renderStep => {
  return renderStep.type;
}

module.exports = GetRenderStepX = renderStep => {
  return renderStep.x;
}

module.exports = GetRenderStepY = renderStep => {
  return renderStep.y;
}

let uuidv4 = cragObject => {
  return cragObject.UUIDGenFunction ? cragObject.UUIDGenFunction() : uuid.v4();
}

let GetFirstMatchingRoute = (cragObject, routeID) => {
  let matchingRoutes = cragObject.routes.filter(route => route.id == routeID);
  return matchingRoutes[0];
}

let GetFirstMatchingTopo = (cragObject, topoID) => {
  let matchingTopos = cragObject.topos.filter(topo => topo.id == topoID);
  return matchingTopos[0];
}
