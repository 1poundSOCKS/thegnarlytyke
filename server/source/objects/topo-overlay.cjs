const Route = require("../../source/objects/route.cjs");
const Topo = require("../../source/objects/topo.cjs");

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
    if( point.attachedTo ) {
      // this.attachedStarts.push({routeIndex:routeIndex,point:point});
    }
    else {
      this.points.push({
        routeIndex: routeIndex,
        type: pointType,
        id: point.id,
        x: point.x,
        y: point.y
      });
    }
  });
}

TopoOverlay.prototype.GeneratePointsFromTopo = function(topoData, includeIntermediatePoints) {
  if( includeIntermediatePoints == undefined ) includeIntermediatePoints = true;
  this.points = [];
  const topo = new Topo(topoData);
  const routes = topo.GetSortedRoutes();
  let routesToRender = routes.filter( route => route.points && route.points.length > 0 );
  routesToRender.forEach( (route, index) => this.GeneratePointsFromRoute(route, index) );
  this.points = this.points.filter( point => point.type != rsRouteJoin || includeIntermediatePoints );
  const startMap = topo.GetMapOfRouteStarts();
  this.points.forEach( point => {
  });
}

TopoOverlay.prototype.GenerateLinesFromRoute = function(routeData) {
  const route = new Route(routeData);
  const points = route.GetResolvedPoints();
  points.forEach( (point, index, points) => {
    let nextPoint = points[index + 1];
    if( nextPoint ) {
      this.lines.push({ startID: point.id, startX: point.x, startY: point.y, 
        endID: nextPoint.id, endX: nextPoint.x, endY: nextPoint.y });
    }
  });
}

TopoOverlay.prototype.GenerateLinesFromTopo = function(topo) {
  if( !topo.routes ) return;
  topo.routes.forEach( route => this.GenerateLinesFromRoute(route) );
}

TopoOverlay.prototype.GenerateFromTopo = function(topo, includeIntermediatePoints) {
  this.GenerateLinesFromTopo(topo);
  this.GeneratePointsFromTopo(topo, includeIntermediatePoints);
  this.GenerateRouteMarkersFromTopo(topo);
}

TopoOverlay.prototype.GenerateRouteMarkersFromTopo = function(topoData) {
  const startPoints = this.points.filter( point => point.type == rsRouteStart );
  startPoints.forEach( point => {

  });
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
