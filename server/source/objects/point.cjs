let Point = function(point) {
  this.point = point;
}

Point.prototype.AttachTo = function(point) {
  this.point.attachedTo = point;
  delete this.point.x;
  delete this.point.y;
}

module.exports = Point;
