let uuid = require('uuid');

module.exports = rsRouteStart = Symbol("rsRouteStart");
module.exports = rsRouteEnd = Symbol("rsRouteEnd");
module.exports = rsRouteJoin = Symbol("rsRouteJoin");
module.exports = rsRouteLine = Symbol("rsRouteLine");

module.exports = CreateCrag = () => {
  return { id: uuid.v4(), routes: [], topos: [] };
}

module.exports = AppendRouteToCrag = (crag, routeName, routeGrade) => {
  let route = { id: uuid.v4(), name: routeName, grade: routeGrade };
  crag.routes.push(route);
  return route;
}

module.exports = CreateCragTopo = (crag) => {
  let topo = { id: uuid.v4(), routes: [] };
  crag.topos.push(topo);
  return topo;
}

module.exports = AddRouteToTopo = (topo, cragRoute) => {
  let topoRoute = { id: cragRoute.id, points: [] };
  topo.routes.push(topoRoute);
  return topoRoute;
}

module.exports = AppendPointToRoute = (route, x, y) => {
  let point = { id: uuid.v4(), x: x, y: y };
  if( !route.points ) route.points = [];
  route.points.push(point);
  return point;
}

module.exports = CreateCragObject = loadedObject => {
  if( !loadedObject ) {
    return {
      id: uuid.v4(),
      routes: [],
      topos: []
    };
  }

  return {
    id: loadedObject.id ? loadedObject.id : uuid.v4(),
    name: loadedObject.name,
    routes: loadedObject.routes ? loadedObject.routes : [],
    topos: loadedObject.topos ? loadedObject.topos : []
  };
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

module.exports = GetTopo = (cragObject, topoID) => {
  return GetFirstMatchingTopo(cragObject, topoID);
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
  if( !topoObject.routes ) topoObject.routes = [];
  topoObject.routes.push({id: routeID});
}

module.exports = RemoveCragRouteFromTopo = (cragObject, routeID, topoID) => {
  let topoObject = GetFirstMatchingTopo(cragObject, topoID);
  topoObject.routes = topoObject.routes.filter( route => route.id != routeID );
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

module.exports = GetTopoRoute = (cragObject, topoID, routeID) => {
  return GetFirstMatchingTopoRoute(cragObject, topoID, routeID);
}

module.exports = GetRoutePoints = (cragObject, topoID, routeID) => {
  let route = GetFirstMatchingTopoRoute(cragObject, topoID, routeID);
  return route ? route.points : null;
}

module.exports = MovePoint = (cragObject, topoID, pointID, x, y) => {
  let point = GetPointInfo(cragObject, topoID, pointID);
  point.x = x;
  point.y = y;
}

let GetRoutesContainingPoint = (topoObject, pointID) => {
  return topoObject.routes.map(route => {
    return route.points ? route.points.filter(point => point.id === pointID) : [];
  })
  .filter( points => points && points.length > 0 );
}

let GetNearestPointForTopo = (x, y, topo) => {
  let nearestPointsForTopo = topo.routes.map( route => GetNearestPointForRoute(x, y, route) )
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

module.exports = GetNearestTopoPointInfo = GetNearestTopoPointInfo = (cragObject, topoID, x, y) => {
  let topoObject = GetFirstMatchingTopo(cragObject, topoID);
  if( !topoObject ) return null;
  return GetNearestPointInfoForTopo(x, y, topoObject);
}

let GetNearestPointInfoForTopo = (x, y, topo) => {
  if( !topo.routes ) return null;
  let nearestPointsForTopo = topo.routes.map( route => GetNearestPointInfoForRoute(x, y, route) )
  .filter( point => point );
  return nearestPointsForTopo ? GetNearestPointInfoForArrayOfPointInfo(x, y, nearestPointsForTopo) : null;
}

let GetNearestPointInfoForRoute = (x, y, route) => {
  if( !route.points ) return null;
  let pointsInfo = route.points.map( point => {
    let distance = GetDistanceBetweenPoints(point.x, point.y, x, y)
    return Object.assign({distance: distance}, point);
  });

  return GetNearestPointInfoForArrayOfPointInfo(x, y, pointsInfo);
}

let GetNearestPointInfoForArrayOfPointInfo = (x, y, pointsInfo) => {
  if( pointsInfo.length == 0 ) return null;
  let nearestPoint = pointsInfo.reduce( (previousPoint, currentPoint) => {
    if( currentPoint.distance < previousPoint.distance ) return currentPoint;
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

let GetFirstMatchingTopoRoute = (cragObject, topoID, routeID) => {
  let matchingTopos = cragObject.topos.filter(topo => topo.id === topoID);
  if( !(matchingTopos[0] && matchingTopos[0].routes) ) return null;
  let matchingRoutes = matchingTopos[0].routes.filter( route => route.id === routeID );
  return matchingRoutes[0];
}
