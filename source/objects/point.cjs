let Point = function(point) {
  this.point = point;
}

Point.prototype.AttachTo = function(point) {
  if( this.point.id == point.id ) return;
  this.point.attachedTo = point;
  delete this.point.x;
  delete this.point.y;
}

module.exports = Point;
