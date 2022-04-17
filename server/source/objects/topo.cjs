let Topo = function(topo) {
  this.topo = topo;
}

Topo.prototype.GetNearestPointWithin = function(x, y, within) {
  if( !this.topo.routes ) return null;
  let nearestPointsForTopo = this.topo.routes.map( route => GetNearestPointForRoute(x, y, route) )
  .filter( point => point );
  const nearestPoint = GetNearestPointForArrayOfPoints(x, y, nearestPointsForTopo);
  let distance = GetDistanceBetweenPoints(x, y, nearestPoint.x, nearestPoint.y);
  return (distance <= within) ? nearestPoint : null;
}

module.exports = Topo;

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
