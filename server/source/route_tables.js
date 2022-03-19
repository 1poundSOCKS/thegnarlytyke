const columnIndex_ID = 0;
const columnIndex_Index = 1;
const columnIndex_Name = 2;
const columnIndex_Grade = 3;
const columnIndex_Button = 4;

let _contentEditable = false;

module.exports = SetTableContentEditable = (editable) => _contentEditable = editable;

module.exports = RefreshCragRouteTable = (cragObject, topoID) => {
  let cragRouteTable = document.getElementById('crag-route-table');
  if( !cragRouteTable ) return;

  let cragRouteIDs = GetCragRouteIDs(cragObject);
  if( topoID ) {
    let topoRouteIDs = GetTopoRouteIDs(cragObject, topoID);
    let topoRoutesIDsMatches = new Set(topoRouteIDs);
    cragRouteIDs = cragRouteIDs.filter(routeID => !topoRoutesIDsMatches.has(routeID));
  }
  RefreshRouteTable(cragRouteTable, cragObject, cragRouteIDs, true);
  let emptyRow = AppendRouteTableRow(cragRouteTable);
  EnableRouteTableRowEdit(emptyRow, cragObject);

  if( topoID ) EnableTopoCommandsInCragRouteTable(cragObject, topoID);
}

module.exports = EnableTopoCommandsInCragRouteTable = (cragObject, topoID) => {
  let cragRouteTable = document.getElementById('crag-route-table');
  if( !cragRouteTable ) return;
  AddCragRouteTableButtons(cragRouteTable);
  UpdateCragRouteTableCommands(cragObject, topoID);
}

module.exports = RefreshTopoRouteTable = (cragObject, topoID) => {
  let topoRouteTable = document.getElementById("topo-route-table");
  if( !topoRouteTable ) return;
  RefreshRouteTable(topoRouteTable, cragObject, GetTopoRouteIDs(cragObject, topoID));
  if( _contentEditable ) {
    AddTopoRouteTableButtons(topoRouteTable, cragObject, topoID);
    UpdateTopoRouteTableCommands(cragObject, topoID);
  }
}

let RefreshRouteTable = (routeTable, cragObject, routeIDs) => {
  let tableBody = routeTable.getElementsByTagName('tbody')[0];
  if( !tableBody ) tableBody = routeTable.createTBody();
  while( routeTable.rows.length > 0 ) routeTable.deleteRow(0);
  routeIDs.forEach( (routeID, index) => {
    let newRow = AppendRouteTableRow(routeTable, cragObject, routeID);
    if( _contentEditable )
      EnableRouteTableRowEdit(newRow, cragObject);
  });
}

let AddCragRouteTableButtons = (routeTable, cragObject, topoID) => {
  Array.from(routeTable.rows).forEach( row => AddButtonsToCragTableRow(row) );
}

let AddButtonsToCragTableRow = row => {
  let id = row.cells[columnIndex_ID].innerText;
  let buttonCell = row.insertCell(columnIndex_Button);
  if( id.length > 0 ) {
    buttonCell.classList.add('fa');
    buttonCell.classList.add('fa-plus');
    // let button = buttonCell.appendChild(document.createElement('button'));
    // button.innerText = '+';
  }
}

let UpdateCragRouteTableCommands = (cragObject, topoID) => {
  let cragRouteTable = document.getElementById('crag-route-table');
  Array.from(cragRouteTable.rows).forEach( row => {
    UpdateCragRouteCommands(row, cragObject, topoID);
  });
}

let UpdateCragRouteCommands = (row, cragObject, topoID) => {
  let button = row.cells[columnIndex_Button];
  // let button = row.cells[columnIndex_Button].getElementsByTagName('button')[0];
  if( !button ) return;
  button.onclick = event => {
    let row = event.target.parentElement;
    // let row = cell.parentElement;
    let routeID = row.cells[columnIndex_ID].innerText;
    AddCragRouteToTopo(cragObject, routeID, topoID);
    RefreshTopoRouteTable(cragObject, topoID);
    RefreshCragRouteTable(cragObject, topoID);
  }
}

let AddTopoRouteTableButtons = (routeTable) => {
  Array.from(routeTable.rows).forEach( row => AddButtonsToTopoRouteTableRow(row) );
}

let AddButtonsToTopoRouteTableRow = row => {
  let id = row.cells[columnIndex_ID].innerText;
  let buttonCell = row.insertCell(columnIndex_Button);
  if( id.length > 0 ) {
    buttonCell.classList.add('fa');
    buttonCell.classList.add('fa-minus');
    // let button = buttonCell.appendChild(document.createElement('button'));
    // button.innerText = '-';
  }
}

let UpdateTopoRouteTableCommands = (cragObject, topoID) => {
  let topoRouteTable = document.getElementById('topo-route-table');
  Array.from(topoRouteTable.rows).forEach( row => {
    let button = row.cells[columnIndex_Button];
    // let button = row.cells[columnIndex_Button].getElementsByTagName('button')[0];
    button.onclick = event => {
      let row = event.target.parentElement;
      // let row = cell.parentElement;
      let routeID = row.cells[columnIndex_ID].innerText;
      RemoveCragRouteFromTopo(cragObject, routeID, topoID);
      RefreshTopoRouteTable(cragObject, topoID);
      RefreshCragRouteTable(cragObject, topoID);
      RefreshMainTopoView();
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
  // newRow.insertCell(columnIndex_Button).innerText = routeInfo.grade;
  return newRow;
}

let EnableRouteTableRowEdit = (row, cragObject) => {
  row.cells[columnIndex_Name].setAttribute('contenteditable', true);
  DisableCellMultilineEdit(row.cells[columnIndex_Name]);
  row.cells[columnIndex_Name].addEventListener('focusout', event => {
    let row = event.target.parentElement;
    let id = row.cells[columnIndex_ID].innerText;
    let name = event.target.innerText;
    if( id.length > 0 ) SetCragRouteName(cragObject, id, name);
    else if( name.length > 0 ) {
      let row = event.target.parentElement;
      id = AppendNewCragRoute(row, cragObject);
      SetCragRouteName(cragObject, id, name);
      AddButtonsToCragTableRow(row);
      UpdateCragRouteCommands(row, cragObject, GetSelectedTopoID());
    }
  });

  row.cells[columnIndex_Grade].setAttribute('contenteditable', true);
  DisableCellMultilineEdit(row.cells[columnIndex_Grade]);
  row.cells[columnIndex_Grade].addEventListener('focusout', event => {
    let row = event.target.parentElement;
    let id = row.cells[columnIndex_ID].innerText;
    let grade = event.target.innerText;
    if( id.length > 0 ) SetCragRouteGrade(cragObject, id, grade);
    else if( grade.length > 0 ) {
      id = AppendNewCragRoute(row, cragObject);
      SetCragRouteGrade(cragObject, id, grade);
      AddButtonsToCragTableRow(row);
      UpdateCragRouteCommands(row, cragObject, GetSelectedTopoID());
    }
  });
}

let AppendNewCragRoute = (row, cragObject) => {
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
