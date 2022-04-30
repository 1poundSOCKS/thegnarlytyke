const Crag = require('./objects/crag.cjs');
const Topo = require('./objects/topo.cjs');
const RouteTable = require('./objects/route-table.cjs');

require('./crag_object.js');

const columnIndex_ID = 0;
const columnIndex_Index = 1;
const columnIndex_Name = 2;
const columnIndex_Grade = 3;
const columnIndex_Button = 4;

let _contentEditable = false;
module.exports = _selectedTopoRouteTableRow = null;

module.exports = SetTableContentEditable = (editable) => _contentEditable = editable;

module.exports = RefreshCragRouteTable = (cragObject, topoID) => {
  let cragRouteTable = document.getElementById('crag-route-table');
  if( !cragRouteTable ) return;

  let cragRouteIDs = GetCragRouteIDs(cragObject);
  RefreshRouteTable(cragRouteTable, cragObject, cragRouteIDs, true);
  let emptyRow = AppendRouteTableRow(cragRouteTable);
  EnableRouteTableRowEdit(emptyRow, cragObject);

  if( topoID ) EnableCommandsInCragRouteTable(cragObject, topoID);
}

module.exports = EnableCommandsInCragRouteTable = (cragObject, topoID) => {
  let cragRouteTable = document.getElementById('crag-route-table');
  if( !cragRouteTable ) return;
  AddCragRouteTableButtons(cragRouteTable, cragObject, topoID);
  UpdateCragRouteTableCommands(cragObject, topoID);
}

module.exports = RefreshTopoRouteTable = (cragObject, topoID) => {
  const crag = new Crag(cragObject);
  const topoData = crag.GetMatchingTopo(topoID);
  const topo = new Topo(topoData);
  const routeInfo = topo.GetSortedRouteInfo();
  const routeTable = new RouteTable(document.getElementById("topo-route-table"));
  routeTable.Refresh(routeInfo);
  if( _contentEditable ) routeTable.AppendEditButtons();
}

module.exports = RefreshTopoRouteTable_OLD = (cragObject, topoID) => {
  let selectedID = GetSelectedTopoRouteTableID();
  _selectedTopoRouteTableRow = null;
  let topoRouteTable = document.getElementById("topo-route-table");
  if( !topoRouteTable ) return;
  let topoRouteIDs = GetTopoRouteIDs(cragObject, topoID);
  RefreshRouteTable(topoRouteTable, cragObject, topoRouteIDs, false);
  if( _contentEditable ) {
    AddTopoRouteTableButtons(topoRouteTable);
    Array.from(topoRouteTable.rows).forEach( row => {
      row.onclick = event => {
        SelectTopoRouteTableRow(event.target.parentElement);
      }
    });
    if( selectedID ) SelectTopoRouteTableRowByID(selectedID);
  }
}

let SelectTopoRouteTableRowByID = (routeID) => {
  let topoRouteTable = document.getElementById("topo-route-table");
  let firstMatchingRow = Array.from(topoRouteTable.rows).filter( row => row.cells[columnIndex_ID].innerText === routeID )[0];
  if( firstMatchingRow ) SelectTopoRouteTableRow(firstMatchingRow);
}

let SelectTopoRouteTableRow = (row) => {
  let buttonCell = _selectedTopoRouteTableRow ? _selectedTopoRouteTableRow.cells[columnIndex_Button] : null;
  if( buttonCell ) {
    buttonCell.classList.remove('topo-route-table-row-selected');
  }
  _selectedTopoRouteTableRow = row;
  buttonCell = _selectedTopoRouteTableRow ? _selectedTopoRouteTableRow.cells[columnIndex_Button] : null;
  if( buttonCell ) {
    buttonCell.classList.add('topo-route-table-row-selected');
  }
}

module.exports = GetSelectedTopoRouteTableID = () => {
  if( !_selectedTopoRouteTableRow ) return null;
  return _selectedTopoRouteTableRow.cells[columnIndex_ID].innerText;
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

let AddCragRouteTableButtons = (routeTable, cragObject, topoID) => {
  let topoRouteIDs = GetTopoRouteIDs(cragObject, topoID);
  let topoRouteIDChecker = new Set(topoRouteIDs);
  Array.from(routeTable.rows).forEach( row => {
    let routeID = row.cells[columnIndex_ID].innerText;
    let routeOnTopo = topoRouteIDChecker.has(routeID);
    AddButtonsToCragTableRow(row, routeOnTopo);
  });
}

let AddButtonsToCragTableRow = (row, routeOnTopo) => {
  let id = row.cells[columnIndex_ID].innerText;
  let buttonCell = row.cells[columnIndex_Button];
  if( !buttonCell ) buttonCell = row.insertCell(columnIndex_Button);
  if( id.length > 0 ) {
    buttonCell.classList.add('fa');
    buttonCell.classList.add(routeOnTopo ? 'fa-toggle-on' : 'fa-toggle-off');
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
  if( !button ) return;
  button.onclick = event => {
    let row = event.target.parentElement;
    let routeID = row.cells[columnIndex_ID].innerText;
    if( button.classList.contains('fa-toggle-off') ) {
      AddCragRouteToTopo(cragObject, routeID, topoID);
      RefreshTopoRouteTable(cragObject, topoID);
      button.classList.remove('fa-toggle-off');
      button.classList.add('fa-toggle-on');
    }
    else {
      RemoveCragRouteFromTopo(cragObject, routeID, topoID);
      RefreshTopoRouteTable(cragObject, topoID);
      button.classList.remove('fa-toggle-on');
      button.classList.add('fa-toggle-off');
    }
    RefreshMainTopoView();
  }
}

let AddTopoRouteTableButtons = (routeTable) => {
  Array.from(routeTable.rows).forEach( row => {
    let buttonCell = row.insertCell(columnIndex_Button);
    buttonCell.classList.add('fa');
    buttonCell.classList.add('fa-edit');
  });
}

let AppendRouteTableRow = (routeTable, cragObject, routeID) => {
  let routeInfo = cragObject && routeID ? GetCragRouteInfo(cragObject, routeID) : {name: '', grade: ''};
  let newRow = routeTable.insertRow(routeTable.rows.length);
  newRow.insertCell(columnIndex_ID).innerText = routeID ? routeID : '';
  newRow.insertCell(columnIndex_Index).innerText = routeID ? routeTable.rows.length : '#';
  newRow.insertCell(columnIndex_Name).innerText = routeInfo.name;
  newRow.insertCell(columnIndex_Grade).innerText = routeInfo.grade;
  let topoID = GetSelectedTopoID();
  if( topoID ) newRow.insertCell(columnIndex_Button);
  return newRow;
}

let EnableRouteTableRowEdit = (row, cragObject) => {
  row.cells[columnIndex_Name].setAttribute('contenteditable', true);
  DisableCellMultilineEdit(row.cells[columnIndex_Name]);
  row.cells[columnIndex_Name].addEventListener('focusout', event => {
    let row = event.target.parentElement;
    let id = row.cells[columnIndex_ID].innerText;
    let name = event.target.innerText;
    let topoID = GetSelectedTopoID();
    if( id.length > 0 ) SetCragRouteName(cragObject, id, name);
    else if( name.length > 0 ) {
      let row = event.target.parentElement;
      id = AppendNewCragRoute(row, cragObject);
      SetCragRouteName(cragObject, id, name);
      if( topoID ) {
        AddButtonsToCragTableRow(row);
        UpdateCragRouteCommands(row, cragObject, topoID);
      }
    }
    if( topoID ) RefreshTopoRouteTable(cragObject, topoID);
  });

  row.cells[columnIndex_Grade].setAttribute('contenteditable', true);
  DisableCellMultilineEdit(row.cells[columnIndex_Grade]);
  row.cells[columnIndex_Grade].addEventListener('focusout', event => {
    let row = event.target.parentElement;
    let id = row.cells[columnIndex_ID].innerText;
    let grade = event.target.innerText;
    let topoID = GetSelectedTopoID();
    if( id.length > 0 ) SetCragRouteGrade(cragObject, id, grade);
    else if( grade.length > 0 ) {
      id = AppendNewCragRoute(row, cragObject);
      SetCragRouteGrade(cragObject, id, grade);
      AddButtonsToCragTableRow(row);
      UpdateCragRouteCommands(row, cragObject, topoID);
    }
    if( topoID ) RefreshTopoRouteTable(cragObject, topoID);
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
