const RouteTable = require('./route-table.cjs');
const Topo = require('./topo.cjs');

let TopoRouteTable = function(element, topo) {
  this.element = element;
  this.topo = topo;
}

TopoRouteTable.prototype.Refresh = function(forEdit, callback) {
  const table = new RouteTable(this.element);
  if( !this.topo ) {
    table.Refresh([]);
    return;
  }
  const topo = new Topo(this.topo);
  table.Refresh(topo.GetSortedRouteInfo());
  if( forEdit ) table.AppendEditButtons(callback);
}

module.exports = TopoRouteTable;
