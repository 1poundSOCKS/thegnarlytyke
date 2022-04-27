let uuid = require('uuid');

let Route = function(route) {
  this.route = route;
}

Route.prototype.AppendPoint = function(x, y) {
  if( !this.route.points ) this.route.points = [];
  const pointCount = this.route.points.push({id: uuid.v4(), x: x, y: y});
  return this.route.points[pointCount-1];
}

module.exports = Route;
