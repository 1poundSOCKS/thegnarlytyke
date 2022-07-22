let uuid = require('uuid');
const Topo = require('./topo.cjs');

let Route = function(route) {
  if( !route ) this.route = {id:uuid.v4()};
  else this.route = route;
}

Route.prototype.AppendPoint = function(x, y) {
  if( !this.route.points ) this.route.points = [];
  const pointCount = this.route.points.push({id: uuid.v4(), x: x, y: y});
  return this.route.points[pointCount-1];
}

Route.prototype.GetResolvedPoints = function() {
  if( !this.route.points ) this.route.points = [];
  return this.route.points.map(point => {
      if( point.attachedTo ) {
        return point.attachedTo;
      }  
      return point;
    });
}

Route.prototype.GetJoinPoints = function() {
  if( !this.route.points || this.route.points.length < 3 ) return [];
  return this.route.points.filter( (point, index) => !point.attachedTo && index > 0 && index < this.route.points.length-1 );
}

module.exports = Route;
