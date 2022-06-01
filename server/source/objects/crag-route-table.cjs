const Crag = require("./crag.cjs");
const RouteTable = require("./route-table.cjs");
const Topo = require("./topo.cjs");

const columnIndex_Button = 4;

let CragRouteTable = function(element, crag, topoData, OnRouteToggled) {
  this.element = element;
  this.crag = crag;
  this.topo = topoData ? new Topo(topoData) : null;
  this.OnRouteToggled = OnRouteToggled;
}

CragRouteTable.prototype.Refresh = function() {
  const table = new RouteTable(this.element);
  if( !this.crag ) {
    table.Refresh([]);
    return;
  }
  table.Refresh(this.crag.routes);
  Array.from(this.element.rows).forEach( row => {
    table.EnableRowEdit(row);
    if( this.topo ) {
      const routeID = table.GetRowID(row);
      const cragRoute = this.crag.GetMatchingRoute(routeID);
      const topoRoute = this.topo.GetMatchingRoute(routeID);
      this.AddButtonsToRow(row, cragRoute, topoRoute);
     }
  });
}

CragRouteTable.prototype.AddButtonsToRow = function(row, cragRoute, topoRoute) {
  let buttonCell = row.cells[columnIndex_Button];
  if( !buttonCell ) buttonCell = row.insertCell(columnIndex_Button);
  buttonCell.classList.add('fa');
  buttonCell.classList.add(topoRoute ? 'fa-toggle-on' : 'fa-toggle-off');
  buttonCell.onclick = event => {
    let row = event.target.parentElement;
    let routeID = cragRoute.id;
    if( buttonCell.classList.contains('fa-toggle-off') ) {
      const route = this.crag.GetMatchingRoute(routeID);
      this.topo.AppendRoute(route);
      buttonCell.classList.remove('fa-toggle-off');
      buttonCell.classList.add('fa-toggle-on');
      if( this.OnRouteToggled ) this.OnRouteToggled(cragRoute);
    }
    else {
      this.topo.RemoveMatchingRoute(routeID);
      buttonCell.classList.remove('fa-toggle-on');
      buttonCell.classList.add('fa-toggle-off');
      if( this.OnRouteToggled ) this.OnRouteToggled(cragRoute);
    }
  }
}

module.exports = CragRouteTable;
