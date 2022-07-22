const columnIndex_ID = 0;
const columnIndex_Index = 1;
const columnIndex_Name = 2;
const columnIndex_Grade = 3;

let RouteTable = function(element, routes, editable, eventHandlerObject) {
  this.element = element;
  this.routes = routes;
  this.contentEditable = editable;
  this.eventHandlerObject = eventHandlerObject;
}

RouteTable.prototype.Refresh = function() {
  let tableBody = this.element.getElementsByTagName('tbody')[0];
  if( !tableBody ) tableBody = this.element.createTBody();
  while( this.element.rows.length > 0 ) this.element.deleteRow(0);
  this.routes.forEach( routeInfo => this.AppendRow(routeInfo) );
}

RouteTable.prototype.AppendRow = function(routeInfo) {
  let newRow = this.element.insertRow(this.element.rows.length);
  if( !routeInfo ) {
    newRow.insertCell(columnIndex_ID);
    newRow.insertCell(columnIndex_Index);
    newRow.insertCell(columnIndex_Name);
    newRow.insertCell(columnIndex_Grade);
    if( this.contentEditable ) this.EnableRowEdit(newRow);
    return newRow;
  }
  newRow.insertCell(columnIndex_ID).innerText = routeInfo.id;
  newRow.insertCell(columnIndex_Index).innerText = routeInfo ? this.element.rows.length : '#';
  newRow.insertCell(columnIndex_Name).innerText = routeInfo.name;
  newRow.insertCell(columnIndex_Grade).innerText = routeInfo.grade;
  if( this.contentEditable ) this.EnableRowEdit(newRow);
  return newRow;
}

RouteTable.prototype.GetRowID = function(row) {
  return row.cells[columnIndex_ID].innerText;
}

RouteTable.prototype.EnableRowEdit = function(row) {
  row.cells[columnIndex_Name].setAttribute('contenteditable', true);
  this.DisableCellMultilineEdit(row.cells[columnIndex_Name]);
  row.cells[columnIndex_Name].addEventListener('focusout', event => {
    let row = event.target.parentElement;
    let id = row.cells[columnIndex_ID].innerText;
    let name = event.target.innerText;
    this.eventHandlerObject.OnRouteNameChanged(row, id, name);
  });

  row.cells[columnIndex_Grade].setAttribute('contenteditable', true);
  this.DisableCellMultilineEdit(row.cells[columnIndex_Grade]);
  row.cells[columnIndex_Grade].addEventListener('focusout', event => {
    let row = event.target.parentElement;
    let id = row.cells[columnIndex_ID].innerText;
    let grade = event.target.innerText;
    this.eventHandlerObject.OnRouteGradeChanged(row, id, grade);
  });
}

RouteTable.prototype.DisableCellMultilineEdit = function(cell) {
  cell.onkeydown = event => {
    if( event.keyCode == 13 ) {
      event.preventDefault();
      document.activeElement.blur();
    }
  }
}

module.exports = RouteTable;
