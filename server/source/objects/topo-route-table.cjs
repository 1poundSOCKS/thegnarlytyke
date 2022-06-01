const RouteTable = require('./route-table.cjs');
const Topo = require('./topo.cjs');

const columnIndex_Button = 4;

let TopoRouteTable = function(element, topoData, OnRouteSelectedCallback) {
  this.table = new RouteTable(element);
  this.topo = new Topo(topoData);
  this.OnRouteSelectedCallback = OnRouteSelectedCallback;
  this.selectedRow = null;
  this.selectedRouteID = null;
  this.selectedRoute = null;
}

TopoRouteTable.prototype.Refresh = function(forEdit) {
  this.selectedRow = null;
  this.selectedRouteID = null;
  
  if( !this.topo ) {
    this.table.Refresh([]);
    return;
  }
  
  const routeInfo = this.topo.GetSortedRouteInfo();
  console.table(routeInfo);
  this.table.Refresh(routeInfo);
  
  if( forEdit ) {
    Array.from(this.table.element.rows).forEach( row => {
      row.insertCell(columnIndex_Button);
      row.onclick = event => {
        this.OnRowClick(event.target.parentElement);
      }
    });
  }
}

TopoRouteTable.prototype.OnRowClick = function(rowElement) {
  if( this.selectedRow ) {
    let buttonCell = this.selectedRow.cells[columnIndex_Button];
    buttonCell.classList.remove('fa');
    buttonCell.classList.remove('fa-edit');
  }
  this.selectedRow = rowElement;
  let buttonCell = this.selectedRow.cells[columnIndex_Button];
  buttonCell.classList.add('fa');
  buttonCell.classList.add('fa-edit');
  this.selectedRouteID = this.table.GetRowID(this.selectedRow);
  this.selectedRoute = this.topo.GetMatchingRoute(this.selectedRouteID);
  if( this.OnRouteSelectedCallback ) this.OnRouteSelectedCallback(this.selectedRoute);
}

module.exports = TopoRouteTable;
