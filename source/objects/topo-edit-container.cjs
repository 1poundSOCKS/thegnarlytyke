const TopoImage = require('./topo-image.cjs')
const CragRouteTable = require('./crag-route-table.cjs')
const TopoRouteTable2 = require('./topo-route-table-2.cjs')

let TopoEditContainer = function(element) {
  this.element = element

  this.topoImageContainer = document.createElement('div')
  this.topoImageContainer.classList.add('topo-image-container')
  this.element.appendChild(this.topoImageContainer)

  this.topoImage = new TopoImage(document.createElement('canvas'),true)
  this.topoImage.AddMouseHandler()
  this.topoImageContainer.appendChild(this.topoImage.canvas)
  
  this.tablesContainer = document.createElement('div')
  this.tablesContainer.classList.add('route-tables-container')
  this.element.appendChild(this.tablesContainer)

  this.topoRouteTable = new TopoRouteTable2(this.tablesContainer, this)
  this.cragRouteTable = new CragRouteTable(this.tablesContainer, this)
}

TopoEditContainer.prototype.Hide = function() {
  this.element.style = 'display:none'
}

TopoEditContainer.prototype.Unhide = function() {
  this.element.style = ''
}

TopoEditContainer.prototype.Refresh = function(crag,topo) {
  this.topoImage.Refresh(topo)
  this.cragRouteTable.Refresh(crag,topo)
  this.topoRouteTable.Refresh(topo)
}

TopoEditContainer.prototype.OnTopoRouteSelected = function(route) {
  this.topoImage.routeID = route.id
}

TopoEditContainer.prototype.OnCragRouteToggled = function(crag,route) {
  this.topoRouteTable.Refresh()
}

module.exports = TopoEditContainer
