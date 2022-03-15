const columnIndex_ID = 0;
const columnIndex_Index = 1;
const columnIndex_Name = 2;
const columnIndex_Grade = 3;

module.exports = RefreshTopoRouteTable = (topoRouteTable, cragObject, topoID) => {
  RefreshRouteTable(topoRouteTable, cragObject, GetTopoRouteIDs(cragObject, topoID));
}

module.exports = RefreshCragRouteTable = (cragObject) => {
  let cragRouteTable = document.getElementById('crag-route-table');
  if( !cragRouteTable ) return;

  let cragRouteIDs = GetCragRouteIDs(cragObject);
  RefreshRouteTable(cragRouteTable, cragObject, cragRouteIDs, true);
}

let RefreshRouteTable = (routeTable, cragObject, routeIDs, contentEditable) => {
  let tableBody = routeTable.getElementsByTagName('tbody')[0];
  if( !tableBody ) tableBody = routeTable.createTBody();
  while( routeTable.rows.length > 0 ) routeTable.deleteRow(0);
  routeIDs.forEach( (routeID, index) => {
    let newRow = AppendRouteTableRow(routeTable, cragObject, routeID);
    if( contentEditable )
      EnableRouteTableRowEdit(newRow, cragObject);
  });

  if( contentEditable ) {
    let emptyRow = AppendRouteTableRow(routeTable);
    EnableRouteTableRowEdit(emptyRow, cragObject);
  }
}

let AppendRouteTableRow = (routeTable, cragObject, routeID) => {
  let routeInfo = cragObject && routeID ? GetCragRouteInfo(cragObject, routeID) : {name: '', grade: ''};
  let newRow = routeTable.insertRow(routeTable.rows.length);
  newRow.insertCell(columnIndex_ID).innerText = routeID ? routeID : '';
  newRow.insertCell(columnIndex_Index).innerText = routeID ? routeTable.rows.length : '#';
  newRow.insertCell(columnIndex_Name).innerText = routeInfo.name;
  newRow.insertCell(columnIndex_Grade).innerText = routeInfo.grade;
  return newRow;
}

let EnableRouteTableRowEdit = (row, cragObject) => {
  row.cells[columnIndex_Name].setAttribute('contenteditable', true);
  DisableCellMultilineEdit(row.cells[columnIndex_Name]);
  row.cells[columnIndex_Name].addEventListener('focusout', event => {
    let id = GetCellEventRouteID(event);
    let name = event.target.innerText;
    if( id.length > 0 ) SetCragRouteName(cragObject, id, name);
    else if( name.length > 0 ) {
      id = AppendRouteOnRouteTableCellEvent(event, cragObject);
      console.log(`id: ${id}, name: ${name}`);
      SetCragRouteName(cragObject, id, name);
    }
  });

  row.cells[columnIndex_Grade].setAttribute('contenteditable', true);
  DisableCellMultilineEdit(row.cells[columnIndex_Grade]);
  row.cells[columnIndex_Grade].addEventListener('focusout', event => {
    let id = GetCellEventRouteID(event);
    let grade = event.target.innerText;
    if( id.length > 0 ) SetCragRouteGrade(cragObject, id, grade);
    else if( grade.length > 0 ) {
      id = AppendRouteOnRouteTableCellEvent(event, cragObject);
      SetCragRouteGrade(cragObject, id, grade);
    }
  });
}

let GetCellEventRouteID = event => {
  let row = event.target.parentElement;
  return row.cells[columnIndex_ID].innerText;
}

let AppendRouteOnRouteTableCellEvent = (event, cragObject) => {
  let row = event.target.parentElement;
  let id = AppendCragRoute(cragObject);
  row.cells[columnIndex_ID].innerText = id;
  row.cells[columnIndex_Index].innerText = row.rowIndex + 1;
  let table = row.parentElement.parentElement;
  let emptyRow = AppendRouteTableRow(table);
  EnableRouteTableRowEdit(emptyRow, cragObject);
  return id;
}

let DisableCellMultilineEdit = cell => {
  cell.onkeydown = event => {
    if( event.keyCode == 13 ) {
      event.preventDefault();
      document.activeElement.blur();
    }
  }
}

