let uuid = require('uuid');
const Topo = require('./topo.cjs');

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
  return this.route.points.map(point => ResolvePoint(point));
}

module.exports = Route;

let ResolvePoint = (point) => {
  if( point.attachedTo ) {
    return point.attachedTo;
  }

  return point;
}
