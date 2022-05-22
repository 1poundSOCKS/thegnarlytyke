const RouteTable = require('./route-table.cjs');
const Topo = require('./topo.cjs');

const columnIndex_Button = 4;

let TopoRouteTable = function(element, callback) {
  this.element = element;
  this.clientCallback = callback;
  this.topo = null;
  this.selectedRow = null;
  this.selectedRouteID = null;
}

TopoRouteTable.prototype.Refresh = function(forEdit) {
  this.selectedRow = null;
  this.selectedRouteID = null;
  
  const table = new RouteTable(this.element);
  if( !this.topo ) {
    table.Refresh([]);
    return;
  }
  
  const topo = new Topo(this.topo);
  table.Refresh(topo.GetSortedRouteInfo());
  
  if( forEdit ) {
    Array.from(this.element.rows).forEach( row => {
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
  this.selectedRouteID = RouteTable.prototype.GetRowID(this.selectedRow);
  let buttonCell = this.selectedRow.cells[columnIndex_Button];
  buttonCell.classList.add('fa');
  buttonCell.classList.add('fa-edit');
  if( this.clientCallback ) this.clientCallback(rowElement);
}

module.exports = TopoRouteTable;
