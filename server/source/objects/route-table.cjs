const columnIndex_ID = 0;
const columnIndex_Index = 1;
const columnIndex_Name = 2;
const columnIndex_Grade = 3;

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

RouteTable.prototype.GetRowID = function(row) {
  return row.cells[columnIndex_ID].innerText;
}

RouteTable.prototype.EnableRowEdit = function(row, cragObject) {
  row.cells[columnIndex_Name].setAttribute('contenteditable', true);
  this.DisableCellMultilineEdit(row.cells[columnIndex_Name]);
  row.cells[columnIndex_Name].addEventListener('focusout', event => {
    let row = event.target.parentElement;
    let id = row.cells[columnIndex_ID].innerText;
    let name = event.target.innerText;
    // let topoID = GetSelectedTopoID();
    // if( id.length > 0 ) SetCragRouteName(cragObject, id, name);
    // else if( name.length > 0 ) {
    //   let row = event.target.parentElement;
    //   id = AppendNewCragRoute(row, cragObject);
    //   SetCragRouteName(cragObject, id, name);
    //   if( topoID ) {
    //     AddButtonsToCragTableRow(row);
    //     UpdateCragRouteCommands(row, cragObject, topoID);
    //   }
    // }
    // if( topoID ) RefreshTopoRouteTable(cragObject, topoID);
  });

  row.cells[columnIndex_Grade].setAttribute('contenteditable', true);
  this.DisableCellMultilineEdit(row.cells[columnIndex_Grade]);
  row.cells[columnIndex_Grade].addEventListener('focusout', event => {
    let row = event.target.parentElement;
    let id = row.cells[columnIndex_ID].innerText;
    let grade = event.target.innerText;
    // let topoID = GetSelectedTopoID();
    // if( id.length > 0 ) SetCragRouteGrade(cragObject, id, grade);
    // else if( grade.length > 0 ) {
    //   id = AppendNewCragRoute(row, cragObject);
    //   SetCragRouteGrade(cragObject, id, grade);
    //   AddButtonsToCragTableRow(row);
    //   UpdateCragRouteCommands(row, cragObject, topoID);
    // }
    // if( topoID ) RefreshTopoRouteTable(cragObject, topoID);
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
