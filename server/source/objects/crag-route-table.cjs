const Crag = require("./crag.cjs");
const RouteTable = require("./route-table.cjs");
const Topo = require("./topo.cjs");

const columnIndex_Button = 4;

let CragRouteTable = function(element) {
  this.element = element;
  this.crag = null;
}

CragRouteTable.prototype.Refresh = function(topoData) {
  const table = new RouteTable(this.element);
  if( !this.crag ) {
    table.Refresh([]);
    return;
  }
  table.Refresh(this.crag.routes);
  Array.from(this.element.rows).forEach( row => {
    table.EnableRowEdit(row);
    if( topoData ) {
      const routeID = table.GetRowID(row);
      const topo = new Topo(topoData);
      const route = topo.GetMatchingRoute(routeID);
      this.AddButtonsToRow(row, route);
     }
  });
}

CragRouteTable.prototype.AddButtonsToRow = function(row, routeOnTopo) {
  // let id = row.cells[columnIndex_ID].innerText;
  let buttonCell = row.cells[columnIndex_Button];
  if( !buttonCell ) buttonCell = row.insertCell(columnIndex_Button);
  // if( id.length > 0 ) {
    buttonCell.classList.add('fa');
    buttonCell.classList.add(routeOnTopo ? 'fa-toggle-on' : 'fa-toggle-off');
  // }
}

module.exports = CragRouteTable;
