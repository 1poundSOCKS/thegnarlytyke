const RouteTable = require('./route-table.cjs');
const Topo = require('./topo.cjs');

const columnIndex_Button = 4;

let TopoRouteTable2 = function(parentElement, OnRouteSelectedCallback) {
  this.element = parentElement.appendChild(document.createElement('table'))
  this.OnRouteSelectedCallback = OnRouteSelectedCallback
}

TopoRouteTable2.prototype.Refresh = function(topoData) {
  this.topo = new Topo(topoData);
  this.routeInfo = this.topo.GetSortedRouteInfo();
  this.table = new RouteTable(this.element, this.routeInfo);
  this.selectedRow = null;
  this.selectedRouteID = null;
  this.selectedRoute = null;
  
  this.table.Refresh();
  
  if( this.OnRouteSelectedCallback ) {
    Array.from(this.table.element.rows).forEach( row => {
      row.insertCell(columnIndex_Button);
      row.onclick = event => {
        this.OnRowClick(event.target.parentElement);
      }
    });
  }
}

TopoRouteTable2.prototype.OnRowClick = function(rowElement) {
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

module.exports = TopoRouteTable2;
