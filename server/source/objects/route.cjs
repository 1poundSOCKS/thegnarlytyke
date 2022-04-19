let uuid = require('uuid');

let Route = function(route) {
  this.id = route.id;
  this.points = route.points ? route.points : [];
}

Route.prototype.AppendPoint = function(x, y) {
  const pointCount = this.points.push({id: uuid.v4(), x: x, y: y});
  return this.points[pointCount-1];
}

module.exports = Route;
