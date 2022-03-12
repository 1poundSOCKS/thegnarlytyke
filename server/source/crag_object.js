let uuid = require('uuid');

module.exports = rsRouteStart = Symbol("rsRouteStart");
module.exports = rsRouteEnd = Symbol("rsRouteEnd");
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
  if( !firstMatchingTopo ) return [];

  let routes = firstMatchingTopo.routes;

  let routesWithAnIndex = routes.map( (route, index) => Object.assign({index: index}, route));

  let routesWithStartPoints = routesWithAnIndex.filter( route => route?.points?.length && route.points.length > 0 );
  let routesWithEndPoints = routesWithAnIndex.filter( route => route?.points?.length && route.points.length > 1 );

  let routeStartPoints = routesWithStartPoints.map(route => {
    return {
      type: rsRouteStart,
      index: route.index+1,
      x: route.points[0].x,
      y: route.points[0].y
    }
  });

  let routeEndPoints = routesWithEndPoints.map(route => {
    return {
      type: rsRouteEnd,
      index: route.index+1,
      x: route.points[route.points.length-1].x,
      y: route.points[route.points.length-1].y
    }
  });

  let routesWithLines = routesWithEndPoints.map(route => {
    let routeLines = route.points.map( (point, index, points) => {
      return {
        type: rsRouteLine,
        start: point,
        end: points[index+1]
      };
    });
    return routeLines.filter( line => line.end );
  });

  let routeLines = [];
  routesWithLines.forEach( route => {
    routeLines = routeLines.concat(route);
  });

  return routeLines.concat(routeStartPoints, routeEndPoints);
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
