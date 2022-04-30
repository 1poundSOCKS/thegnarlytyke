const columnIndex_ID = 0;
const columnIndex_Index = 1;
const columnIndex_Name = 2;
const columnIndex_Grade = 3;
const columnIndex_Button = 4;

let RouteTable = function(element) {
  this.element = element;
  this.contentEditable = false;
}

RouteTable.prototype.Refresh = function(routesInfo) {
  let tableBody = this.element.getElementsByTagName('tbody')[0];
  if( !tableBody ) tableBody = this.element.createTBody();
  while( this.element.rows.length > 0 ) this.element.deleteRow(0);
  routesInfo.forEach( routeInfo => {
    let newRow = this.AppendRow(routeInfo);
    if( this.contentEditable ) EnableRouteTableRowEdit(newRow, cragObject);
  });
}

RouteTable.prototype.AppendRow = function(routeInfo) {
  let newRow = this.element.insertRow(this.element.rows.length);
  newRow.insertCell(columnIndex_ID).innerText = routeInfo.id;
  newRow.insertCell(columnIndex_Index).innerText = routeInfo ? this.element.rows.length : '#';
  newRow.insertCell(columnIndex_Name).innerText = routeInfo.name;
  newRow.insertCell(columnIndex_Grade).innerText = routeInfo.grade;
  return newRow;
}

RouteTable.prototype.AppendEditButtons = function() {
  Array.from(this.element.rows).forEach( row => {
    let buttonCell = row.insertCell(columnIndex_Button);
    buttonCell.classList.add('fa');
    buttonCell.classList.add('fa-edit');
  });
}

module.exports = RouteTable;
