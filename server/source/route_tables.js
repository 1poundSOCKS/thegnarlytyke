const columnIndex_ID = 0;
const columnIndex_Index = 1;
const columnIndex_Name = 2;
const columnIndex_Grade = 3;
const columnIndex_Button = 4;

module.exports = RefreshCragRouteTable = (cragObject) => {
  let cragRouteTable = document.getElementById('crag-route-table');
  if( !cragRouteTable ) return;
  RefreshRouteTable(cragRouteTable, cragObject, GetCragRouteIDs(cragObject), true);
  let emptyRow = AppendRouteTableRow(cragRouteTable);
  EnableRouteTableRowEdit(emptyRow, cragObject);
}

module.exports = EnableTopoCommandsInCragRouteTable = (cragObject, topoID) => {
  let cragRouteTable = document.getElementById('crag-route-table');
  if( !cragRouteTable ) return;
  AddRouteTableButtons(cragRouteTable, cragObject, topoID);
}

module.exports = RefreshTopoRouteTable = (cragObject, topoID) => {
  let topoRouteTable = document.getElementById("topo-route-table");
  RefreshRouteTable(topoRouteTable, cragObject, GetTopoRouteIDs(cragObject, topoID));
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
}

let AddRouteTableButtons = (routeTable, cragObject, topoID) => {
  Array.from(routeTable.rows).forEach( row => {
    let id = row.cells[columnIndex_ID].innerText;
    let buttonCell = row.insertCell(columnIndex_Button);
    if( id.length > 0 ) {
      let button = buttonCell.appendChild(document.createElement('button'));
      button.innerText = '+';
      button.onclick = event => {
        let cell = event.target.parentElement;
        let row = cell.parentElement;
        let routeID = row.cells[columnIndex_ID].innerText;
        AddCragRouteToTopo(cragObject, routeID, topoID);
        RefreshTopoRouteTable(cragObject, topoID);
      }
    }
  });
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
