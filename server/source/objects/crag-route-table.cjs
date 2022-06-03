const Crag = require("./crag.cjs");
const RouteTable = require("./route-table.cjs");
const Topo = require("./topo.cjs");

const columnIndex_AddRouteToTopoSwitch = 4;

let CragRouteTable = function(element, crag, topoData, OnRouteToggled) {
  this.element = element;
  this.table = new RouteTable(element, crag.routes, true, this);
  this.crag = crag;
  this.topo = topoData ? new Topo(topoData) : null;
  this.OnRouteToggled = OnRouteToggled;
  this.Refresh();
}

CragRouteTable.prototype.Refresh = function() {
  if( !this.crag ) {
    this.table.Refresh([]);
    return;
  }
  this.table.Refresh();
  Array.from(this.element.rows).forEach( row => {
    if( this.topo ) {
      const routeID = this.table.GetRowID(row);
      const cragRoute = this.crag.GetMatchingRoute(routeID);
      const topoRoute = this.topo.GetMatchingRoute(routeID);
      this.AddButtonsToRow(row, cragRoute, topoRoute);
     }
  });
  this.AddRowForAppend();
}

CragRouteTable.prototype.AddButtonsToRow = function(row, cragRoute, topoRoute) {
  let buttonCell = row.cells[columnIndex_AddRouteToTopoSwitch];
  if( !buttonCell ) buttonCell = row.insertCell(columnIndex_AddRouteToTopoSwitch);
  buttonCell.classList.add('fa');
  buttonCell.classList.add(topoRoute ? 'fa-toggle-on' : 'fa-toggle-off');
  buttonCell.onclick = event => {
    let row = event.target.parentElement;
    let routeID = cragRoute.id;
    if( buttonCell.classList.contains('fa-toggle-off') ) {
      const route = this.crag.GetMatchingRoute(routeID);
      this.topo.AppendRoute(route);
      buttonCell.classList.remove('fa-toggle-off');
      buttonCell.classList.add('fa-toggle-on');
      if( this.OnRouteToggled ) this.OnRouteToggled(cragRoute);
    }
    else {
      this.topo.RemoveMatchingRoute(routeID);
      buttonCell.classList.remove('fa-toggle-on');
      buttonCell.classList.add('fa-toggle-off');
      if( this.OnRouteToggled ) this.OnRouteToggled(cragRoute);
    }
  }
}

CragRouteTable.prototype.AddRowForAppend = function() {
  let row = this.table.AppendRow();
  row.cells[columnIndex_AddRouteToTopoSwitch];
}

CragRouteTable.prototype.OnRouteNameChanged = function(id, name) {
  console.log(`${id}, ${name}`);
  if( !id ) {
    this.AppendRoute(name, '');
    return;
  }
  const route = this.crag.GetMatchingRoute(id);
  if( !route ) return;
  route.name = name;
}

CragRouteTable.prototype.OnRouteGradeChanged = function(id, grade) {
  console.log(`${id}, ${grade}`);
  if( !id ) {
    this.AppendRoute('', grade);
    return;
  }
  const route = this.crag.GetMatchingRoute(id);
  if( !route ) return;
  route.grade = grade;
}

CragRouteTable.prototype.AppendRoute = function(name, grade) {
  console.log(`append route: name=${name}, grade=${grade}`);
}

module.exports = CragRouteTable;
