const RouteTable = require("./route-table.cjs");

let CragRouteTable = function(element) {
  this.element = element;
  this.crag = null;
}

CragRouteTable.prototype.Refresh = function() {
  const table = new RouteTable(this.element);
  if( !this.crag ) {
    table.Refresh([]);
    return;
  }
  table.Refresh(this.crag.routes);
}

module.exports = CragRouteTable;
