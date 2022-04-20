module.exports = rsRouteStart = Symbol("rsRouteStart");
module.exports = rsRouteEnd = Symbol("rsRouteEnd");
module.exports = rsRouteJoin = Symbol("rsRouteJoin");
module.exports = rsRouteLine = Symbol("rsRouteLine");

let TopoOverlay = function() {
  this.lines = [];
  this.points = [];
}

TopoOverlay.prototype.GeneratePointsFromRoute = function(route, routeIndex) {
  if( !route.points ) return;
  let lastPointIndex = route.points.length - 1;
  route.points.forEach( (point, index) => {
    let pointType = rsRouteJoin;
    if( index == 0 ) pointType = rsRouteStart;
    else if( index == lastPointIndex ) pointType = rsRouteEnd;
    this.points.push({
      routeIndex: routeIndex,
      type: pointType,
      id: point.id,
      x: point.x,
      y: point.y
    });
  });
}

TopoOverlay.prototype.GeneratePointsFromTopo = function(topo) {
  let topoRoutes = topo.routes ? topo.routes : [];
  let topoRoutesWithPoints = topoRoutes.filter( route => route.points && route.points.length > 0 );
  topoRoutesWithPoints.forEach( (route, index) => {
    this.GeneratePointsFromRoute(route, index);
  });
}

TopoOverlay.prototype.GenerateLinesFromRoute = function(route) {
  if( !route.points ) return;
  const lines = route.points.map( (point, index, points) => {
    let nextPoint = points[index + 1];
    return nextPoint ? { startID: point.id, startX: point.x, startY: point.y, endID: nextPoint.id, endX: nextPoint.x, endY: nextPoint.y } : null;
  });
  const validLines = lines.filter( line => line );
  validLines.forEach( line => {
    this.lines.push(line);
  });
}

TopoOverlay.prototype.GenerateLinesFromTopo = function(topo) {
  if( !topo.routes ) return;
  topo.routes.forEach( route => this.GenerateLinesFromRoute(route) );
}

TopoOverlay.prototype.GenerateFromTopo = function(topo) {
  this.GenerateLinesFromTopo(topo);
  this.GeneratePointsFromTopo(topo);
}

TopoOverlay.prototype.UpdatePoints = function(id, x, y) {
  this.lines.forEach( line => {
    if( line.startID === id ) {
      line.startX = x;
      line.startY = y;
    }
    if( line.endID === id ) {
      line.endX = x;
      line.endY = y;
    }
  });

  this.points.forEach( point => {
    if( point.id === id ) {
      point.x = x;
      point.y = y;
    }
  });
}

module.exports = TopoOverlay;
