let Topo = function(topo) {
  this.id = topo.id;
  this.imageFile = topo.imageFile;
  this.routes = topo.routes ? topo.routes : [];
}

Topo.prototype.GetRoute = function(id) {
  if( !this.routes ) return null;
  let matchingRoutes = this.routes.filter(route => route.id === id);
  if( matchingRoutes.length != 1 ) return null;
  return matchingRoutes[0];
}

Topo.prototype.GetNearestPointWithin = function(x, y, within) {
  if( !this.routes || this.routes.length == 0 ) return null;
  let nearestPointsForTopo = this.routes.map( route => GetNearestPointForRoute(x, y, route) )
  .filter( point => point );
  const nearestPoint = GetNearestPointForArrayOfPoints(x, y, nearestPointsForTopo);
  let distance = GetDistanceBetweenPoints(x, y, nearestPoint.x, nearestPoint.y);
  return (distance <= within) ? nearestPoint : null;
}

Topo.prototype.GetNextNearestPointWithin = function(x, y, within, exludedPointID) {
  if( !this.routes || this.routes.length == 0 ) return null;
  let nearestPointsForTopo = this.routes.map( route => GetNextNearestPointForRoute(x, y, route, exludedPointID) )
  .filter( point => point );
  const nearestPoint = GetNearestPointForArrayOfPoints(x, y, nearestPointsForTopo);
  if( !nearestPoint ) return null;
  let distance = GetDistanceBetweenPoints(x, y, nearestPoint.x, nearestPoint.y);
  return (distance <= within) ? nearestPoint : null;
}

Topo.prototype.SortRoutesLeftToRight = function() {
  this.routes.sort( (point1, point2) => point1.points[0].x - point2.points[0].x );
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
