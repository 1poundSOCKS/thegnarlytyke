let uuid = require('uuid');

let Route = function(route) {
  this.route = route;
}

Route.prototype.AppendPoint = function(x, y) {
  if( !this.route.points ) this.route.points = [];
  const pointCount = this.route.points.push({id: uuid.v4(), x: x, y: y});
  return this.route.points[pointCount-1];
}

Route.prototype.GetResolvedPoints = function() {
  if( !this.route.points ) this.route.points = [];
  return this.route.points.map(point => CreateNewPointIfDetached(point));
}

Route.prototype.CalculateSortOrder = function(route) {
  const thisRouteStart = this.GetStartPoint();
  const otherRoute = new Route(route);
  const otherRouteStart = otherRoute.GetStartPoint();
  if( !thisRouteStart && !otherRouteStart ) return 0;
  if( !otherRouteStart ) return -1;
  if( !thisRouteStart ) return 1;
  if( thisRouteStart.x < otherRouteStart.x ) return -1;
  if( thisRouteStart.x > otherRouteStart.x ) return 1;
  const thisRouteEnd = this.GetEndPoint();
  const otherRouteEnd = otherRoute.GetEndPoint();
  if( thisRouteEnd.x < otherRouteEnd.x ) return -1;
  if( thisRouteEnd.x > otherRouteEnd.x ) return 1;
  return 0;
}

Route.prototype.GetStartPoint = function() {
  const points = this.GetResolvedPoints();
  return points.length == 0 ? null : [0];
}

Route.prototype.GetEndPoint = function() {
  const points = this.GetResolvedPoints();
  return points.length == 0 ? null : points[points.length-1];
}

module.exports = Route;

let CreateNewPointIfDetached = (point) => {
  if( point.attachedTo ) {
    return {
      id: point.id,
      x: point.attachedTo.x,
      y: point.attachedTo.y
    }
  }

  return point;
}
