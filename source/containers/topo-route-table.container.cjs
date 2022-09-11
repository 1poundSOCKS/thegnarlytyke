const Topo = require('../objects/topo.cjs')

const columnIndex_ID = 0;
const columnIndex_Index = 1;
const columnIndex_Name = 2;
const columnIndex_Grade = 3;
const columnIndex_Button = 4;
const columnIndex_Clear = 5;

let CreateTopoRouteTableContainer = () => {
  const root = document.createElement('div')
  root.classList.add('topo-route-table-container')
  const table = document.createElement('table')
  const tableBody = table.createTBody()
  root.appendChild(table)
  return { root: root, table: table, tableBody: tableBody }
}

let RefreshTopoRouteTableContainer = (container, cragObj, topo, editable) => {
  container.tableBody.innerHTML = ''
  if( !topo ) return

  const topoObj = new Topo(topo)
  const routes = topoObj.GetSortedRouteInfo()

  const rows = routes.map( routeInfo => {
    let newRow = container.tableBody.insertRow(container.tableBody.rows.length);
    newRow.insertCell(columnIndex_ID).innerText = routeInfo.id;
    newRow.insertCell(columnIndex_Index).innerText = routeInfo ? container.tableBody.rows.length : '#';
    newRow.insertCell(columnIndex_Name).innerText = routeInfo.name;
    newRow.insertCell(columnIndex_Grade).innerText = routeInfo.grade;
    return newRow;
  });

  if( editable ) {
    rows.forEach( row => {
      EnableRowEdit(container,row,topoObj)
      EnableRowSelect(container,row)
      EnableRouteClear(container,row,topoObj)
    })
    const newRow = AddRowForNewRoute(container.tableBody)
    EnableRowEdit(container,newRow,topoObj,cragObj)
  }
}

let EnableRowEdit = (container,row,topoObj,cragObj) => {
  row.cells[columnIndex_Name].setAttribute('contenteditable', true);
  DisableCellMultilineEdit(row.cells[columnIndex_Name]);
  row.cells[columnIndex_Name].addEventListener('focusout', event => {
    let row = event.target.parentElement;
    let id = row.cells[columnIndex_ID].innerText;
    if( id?.length > 0 ) {
      let name = event.target.innerText;
      const route = topoObj?.GetMatchingRoute(id)
      if( route ) route.info.name = name
    }
    else {
      const name = row.cells[columnIndex_Name].innerText
      if( name.length > 0 ) {
        const route = cragObj.AppendRoute(name,'')
        topoObj.AppendRoute(route)
        row.cells[columnIndex_ID].innerText = route.id
        EnableRowSelect(container,row)
        const newRow = AddRowForNewRoute(container.tableBody)
        EnableRowEdit(container,newRow,topoObj,cragObj)
      }
    }
  });

  row.cells[columnIndex_Grade].setAttribute('contenteditable', true);
  DisableCellMultilineEdit(row.cells[columnIndex_Grade]);
  row.cells[columnIndex_Grade].addEventListener('focusout', event => {
    let row = event.target.parentElement;
    let id = row.cells[columnIndex_ID].innerText;
    if( id?.length > 0 ) {
      let grade = event.target.innerText;
      const route = topoObj?.GetMatchingRoute(id)
      if( route ) route.info.grade = grade
    }
    else {
      const grade = row.cells[columnIndex_Grade].innerText
      if( grade.length > 0 ) {
        const route = cragObj.AppendRoute('',grade)
        topoObj.AppendRoute(route)
        row.cells[columnIndex_ID].innerText = route.id
        EnableRowSelect(container,row)
        const newRow = AddRowForNewRoute(tableBody)
        EnableRowEdit(container,newRow,topoObj,cragObj)
      }
    }
  })
}

let EnableRowSelect = (container,row) => {
  let cell = row.insertCell(columnIndex_Button)
  cell.classList.add('fa')
  cell.classList.add('fa-edit')
  cell.onclick = (event) => {
    const row = event.target.parentElement
    const tableBody = row.parentElement
    Array.from(tableBody.rows).forEach( row => {
      row.classList.remove('row-selected')
    })
    row.classList.add('row-selected')
    const rowData = GetRowData(row)
    if( container.OnRouteSelectCallback ) container.OnRouteSelectCallback(container.callbackObject,rowData)
  }
}

let EnableRouteClear = (container,row,topoObj) => {
  let cell = row.insertCell(columnIndex_Clear)
  cell.classList.add('fa')
  cell.classList.add('fa-eraser')
  cell.onclick = (event) => {
    const row = event.target.parentElement
    const rowData = GetRowData(row,topoObj)
    topoObj.ClearRoute(rowData.id)
    if( container.OnRouteClearCallback ) container.OnRouteClearCallback(container.callbackObject,rowData)
  }
}

let GetRowData = row => {
  return {
    id: row.cells[columnIndex_ID].innerText,
    name: row.cells[columnIndex_Name].innerText,
    grade: row.cells[columnIndex_Grade].innerText
  }
}

let AddRowForNewRoute = (tableBody) => {
  let newRow = tableBody.insertRow(tableBody.rows.length);
  newRow.insertCell(columnIndex_ID);
  newRow.insertCell(columnIndex_Index);
  newRow.insertCell(columnIndex_Name);
  newRow.insertCell(columnIndex_Grade);
  return newRow
}

let DisableCellMultilineEdit = (cell) => {
  cell.onkeydown = event => {
    if( event.keyCode == 13 ) {
      event.preventDefault();
      document.activeElement.blur();
    }
  }
}

exports.CreateTopoRouteTableContainer = CreateTopoRouteTableContainer
exports.RefreshTopoRouteTableContainer = RefreshTopoRouteTableContainer
