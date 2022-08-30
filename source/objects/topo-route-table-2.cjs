const RouteTable = require('./route-table.cjs');
const Topo = require('./topo.cjs');

const columnIndex_Button = 4;

let TopoRouteTable2 = function(parentElement, callbackObject) {
  this.element = parentElement.appendChild(document.createElement('table'))
  this.callbackObject = callbackObject
}

TopoRouteTable2.prototype.Refresh = function(topoData) {
  this.element.innerHTML = ''
  if( topoData ) this.topo = new Topo(topoData);
  this.routeInfo = this.topo.GetSortedRouteInfo();
  this.table = new RouteTable(this.element, this.routeInfo);
  this.selectedRow = null;
  this.selectedRouteID = null;
  this.selectedRoute = null;
  
  this.table.Refresh();
  
  if( this.callbackObject ) {
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
  if( this.callbackObject ) this.callbackObject.OnTopoRouteSelected(this.selectedRoute);
}

TopoRouteTable2.prototype.OnCragRouteToggled = function(crag,cragRoute) {
  this.Refresh()
}

module.exports = TopoRouteTable2;
