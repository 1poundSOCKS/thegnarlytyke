let Crag = function() {
  this.id = null;
  this.routes = [];
  this.topos = [];
}

Crag.prototype.Attach = function(oldCragObject) {
  this.id = oldCragObject.id;
  this.routes = oldCragObject.routes;
  this.topos = oldCragObject.topos;
}

module.exports = Crag;
