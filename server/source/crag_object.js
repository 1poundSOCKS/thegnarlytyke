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
  let topoObject = GetFirstMatchingTopo(cragObject, topoID);
  if( !topoObject.routes ) return [];
  let orderedRoutes = AddRenderIndexToTopoRoutes(topoObject);
  return orderedRoutes.map(route => route.id);
}

module.exports = GetCragRouteIDs = (cragObject) => {
  return cragObject.routes.map(route => route.id);
}

module.exports = GetCragRouteInfo = (cragObject, routeID) => {
  let firstMatchingRoute = GetFirstMatchingRoute(cragObject, routeID);
  return firstMatchingRoute ? {
    name: firstMatchingRoute.name,
    grade: firstMatchingRoute.grade
  } : null;
}

module.exports = SetCragRouteName = (cragObject, routeID, routeName) => {
  let firstMatchingRoute = GetFirstMatchingRoute(cragObject, routeID);
  firstMatchingRoute.name = routeName;
}

module.exports = SetCragRouteGrade = (cragObject, routeID, routeGrade) => {
  let firstMatchingRoute = GetFirstMatchingRoute(cragObject, routeID);
  firstMatchingRoute.grade = routeGrade;
}

module.exports = AppendCragRoute = (cragObject) => {
  let id = uuid.v4();
  cragObject.routes.push({id: id, name: '', grade: ''});
  return id;
}

module.exports = AddCragRouteToTopo = (cragObject, routeID, topoID) => {
  let topoObject = GetFirstMatchingTopo(cragObject, topoID);
  topoObject.routes.push({id: routeID});
}

module.exports = RemoveCragRouteFromTopo = (cragObject, routeID, topoID) => {
  let topoObject = GetFirstMatchingTopo(cragObject, topoID);
  topoObject.routes = topoObject.routes.filter( route => route.id != routeID );
}

module.exports = GetTopoOverlayRenderSteps = (cragObject, topoID) => {  
  let topoObject = GetFirstMatchingTopo(cragObject, topoID);
  if( !topoObject ) return [];

  AddRenderIndexToTopoRoutes(topoObject);

  let routes = topoObject.routes;
  let routesWithStartPoints = routes.filter( route => route.points && route.points.length > 0 );
  
  let routesWithEndPoints = routesWithStartPoints.filter( route => route.points && route.points.length > 1 );

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

module.exports = GetNearestTopoPointID = (cragObject, topoID, x, y) => {
  let topoObject = GetFirstMatchingTopo(cragObject, topoID);
  if( !topoObject ) return null;
  let nearestPoint = GetNearestPointForTopo(x, y, topoObject);
  return nearestPoint.id;
}

module.exports = GetPointInfo = (cragObject, topoID, pointID) => {
  let topoObject = GetFirstMatchingTopo(cragObject, topoID);
  if( !topoObject ) return null;
  let routes = GetRoutesContainingPoint(topoObject, pointID);
  return routes.length > 0 ? routes[0][0] : null;
}

let GetRoutesContainingPoint = (topoObject, pointID) => {
  return topoObject.routes.map(route => {
    return route.points ? route.points.filter(point => point.id === pointID) : [];
  })
  .filter( points => points && points.length > 0 );
}

let GetNearestPointForTopo = (x, y, topo) => {
  let nearestPointsForTopo = topo?.routes.map( route => GetNearestPointForRoute(x, y, route) )
  .filter( point => point );
  return nearestPointsForTopo ? GetNearestPointForArrayOfPoints(x, y, nearestPointsForTopo) : null;
}

let GetNearestPointForRoute = (x, y, route) => {
  return route.points ? GetNearestPointForArrayOfPoints(x, y, route.points) : null;
}

let GetNearestPointForArrayOfPoints = (x, y, points) => {
  let nearestPoint = points.reduce( (previousPoint, currentPoint) => {
    let distanceFromPrevious = GetDistanceBetweenPoints(previousPoint.x, previousPoint.y, x, y);
    let distanceFromCurrent = GetDistanceBetweenPoints(currentPoint.x, currentPoint.y, x, y);
    if( distanceFromCurrent < distanceFromPrevious ) return currentPoint;
    else return previousPoint;
  });

  return nearestPoint;
}

let GetDistanceBetweenPoints = (x1, y1, x2, y2) => {
  let dx = x1 - x2;
  let dy = y1 - y2;
  return Math.sqrt( dx*dx + dy*dy );
}

let AddRenderIndexToTopoRoutes = (topoObject) => {
  let routesInLeftToRightOrder = topoObject.routes.sort( (route1, route2) => {
    if( !route1.points && !route2.points ) return 0;
    else if( route1.points && !route2.points ) return -1;
    else if( !route1.points && route2.points ) return 1;
    else return route1.points[0].x - route2.points[0].x;
  });

  let nextRenderIndex = 0;
  routesInLeftToRightOrder.forEach( route => {
    if( route.points && route.points.length > 0 ) route.index = nextRenderIndex++;
    else delete route.index;
  });

  return routesInLeftToRightOrder;
}

let GetFirstMatchingRoute = (cragObject, routeID) => {
  let matchingRoutes = cragObject.routes.filter(route => route.id === routeID);
  return matchingRoutes[0];
}

let GetFirstMatchingTopo = (cragObject, topoID) => {
  let matchingTopos = cragObject.topos.filter(topo => topo.id === topoID);
  return matchingTopos[0];
}
