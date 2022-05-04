let Topo = function(topo) {
  this.topo = topo;
}

Topo.prototype.GetMatchingRoute = function(id) {
  if( !this.topo.routes ) return null;
  let matchingRoutes = this.topo.routes.filter(route => route.id === id);
  if( matchingRoutes.length != 1 ) return null;
  return matchingRoutes[0];
}

Topo.prototype.GetNearestPointWithin = function(x, y, within) {
  if( !this.topo.routes || this.topo.routes.length == 0 ) return null;
  let nearestPointsForTopo = this.topo.routes.map( route => GetNearestPointForRoute(x, y, route) )
  .filter( point => point );
  const nearestPoint = GetNearestPointForArrayOfPoints(x, y, nearestPointsForTopo);
  let distance = GetDistanceBetweenPoints(x, y, nearestPoint.x, nearestPoint.y);
  return (distance <= within) ? nearestPoint : null;
}

Topo.prototype.GetNextNearestPointWithin = function(x, y, within, exludedPointID) {
  if( !this.topo.routes || this.topo.routes.length == 0 ) return null;
  let nearestPointsForTopo = this.topo.routes.map( route => GetNextNearestPointForRoute(x, y, route, exludedPointID) )
  .filter( point => point );
  const nearestPoint = GetNearestPointForArrayOfPoints(x, y, nearestPointsForTopo);
  if( !nearestPoint ) return null;
  let distance = GetDistanceBetweenPoints(x, y, nearestPoint.x, nearestPoint.y);
  return (distance <= within) ? nearestPoint : null;
}

Topo.prototype.GetSortedRoutes = function() {
  if( !this.topo.routes ) return [];
  const routes = this.topo.routes.map(route=>route);
  return routes.sort( (route1, route2) => this.CalculateSortOrder(route1, route2) );
}

Topo.prototype.CalculateSortOrder = function(route1, route2) {
  const route1Start = this.GetRouteStartPoint(route1);
  const route2Start = this.GetRouteStartPoint(route2);

  if( !route1Start && !route2Start ) return 0;
  if( !route2Start ) return -1;
  if( !route1Start ) return 1;

  const route1End = this.GetRouteEndPoint(route1);
  const route2End = this.GetRouteEndPoint(route2);

  if( route1Start.x < route2Start.x ) return -1;
  if( route2Start.x < route1Start.x ) return 1;

  if( !route1End && !route2End ) return 0;
  if( !route2End ) return -1;
  if( !route1End ) return 1;

  if( route1End.x < route2End.x ) return -1;
  if( route2End.x < route1End.x ) return 1;

  return 0;
}

Topo.prototype.GetRouteStartPoint = function(route) {
  if( !route.points || route.points.length == 0 ) return null;
  if( route.points[0].attachedTo ) {
    const attachedToRoute = this.GetRouteContainingPoint(route.points[0].attachedTo);
    return this.GetRouteStartPoint(attachedToRoute);
  }
  return route.points[0];
}

Topo.prototype.GetRouteEndPoint = function(route) {
  if( !route.points || route.points.length < 2 ) return null;
  const lastPointIndex = route.points.length - 1;
  if( route.points[lastPointIndex].attachedTo ) {
    const attachedToRoute = this.GetRouteContainingPoint(route.points[lastPointIndex].attachedTo);
    return this.GetRouteEndPoint(attachedToRoute);
  }
  return route.points[lastPointIndex];
}

Topo.prototype.GetRouteContainingPoint = function(pointToFind) {
  const matchingRoutes = this.topo.routes.filter( route => {
    const matchingPoints = route.points.filter( point => point == pointToFind );
    return matchingPoints.length > 0;
  });
  if( matchingRoutes.length == 0 ) return null;
  return matchingRoutes[0];
}

Topo.prototype.GetSortedRouteInfo = function() {
  const routeInfo = [];
  const routes = this.GetSortedRoutes();
  routes.forEach(route => {
    routeInfo.push({id:route.info.id,name:route.info.name,grade:route.info.grade});
  });
  return routeInfo;
}

Topo.prototype.AppendRoute = function(route) {
  if( !this.topo.routes ) this.topo.routes = [];
  this.topo.routes.push({id:route.id,info:route})
}

Topo.prototype.RemoveMatchingRoute = function(id) {
  const remainingRoutes = this.topo.routes.filter( route => route.id != id );
  this.topo.routes = remainingRoutes;
}

Topo.prototype.GetRouteLines = function() {
  if( !this.topo.routes ) return [];
  const lines = [];
  this.topo.routes.forEach( route => {
    if( route.points ) {
      const points = route.points.map( point => point.attachedTo ? point.attachedTo : point );
      points.forEach( (point, index, points) => {
        const nextPoint = points[index + 1];
        if( nextPoint ) lines.push({startPoint:point, endPoint:nextPoint});
      });
    }
  });
  return lines;
}

Topo.prototype.GetSortedRouteStartPoints = function() {
  const sortedRoutes = this.GetSortedRoutes();
  return sortedRoutes.map( route => this.GetRouteStartPoint(route) )
  .filter( point => point );
}

Topo.prototype.GetSortedRouteEndPoints = function() {
  const sortedRoutes = this.GetSortedRoutes();
  return sortedRoutes.map( route => this.GetRouteEndPoint(route) )
  .filter( point => point );
}

Topo.prototype.GetRouteJoinPoints = function(route) {
  return [];
}

module.exports = Topo;

let GetNearestPointForRoute = (x, y, route) => GetNextNearestPointForRoute(x, y, route, null);

let GetNextNearestPointForRoute = (x, y, route, excludedPointID) => {
  if( !route.points ) return null;
  const includedPoints = route.points.filter( point => point.id !== excludedPointID );
  const nearestPoint = GetNearestPointForArrayOfPoints(x, y, includedPoints);
  if( nearestPoint ) nearestPoint.parent = route;
  return nearestPoint;
}

let GetNearestPointForArrayOfPoints = (x, y, points) => {
  const unattachedPoints = points.filter( point => !point.attachedTo );
  let nearestPoint = unattachedPoints.reduce( (previousResult, currentPoint) => {
    if( !previousResult.point ) return {point: currentPoint, distance: GetDistanceBetweenPoints(currentPoint.x, currentPoint.y, x, y)};
    const currentResult = {point: currentPoint, distance: GetDistanceBetweenPoints(currentPoint.x, currentPoint.y, x, y)};
    return previousResult.distance < currentResult.distance ? previousResult : currentResult;
  }, {});

  return nearestPoint.point;
}

let GetDistanceBetweenPoints = (x1, y1, x2, y2) => {
  let dx = x1 - x2;
  let dy = y1 - y2;
  return Math.sqrt( dx*dx + dy*dy );
}
