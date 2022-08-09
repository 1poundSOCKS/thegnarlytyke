const TopoImage = require('./topo-image.cjs')
const CragRouteTable = require('./crag-route-table.cjs')
const TopoRouteTable2 = require('./topo-route-table-2.cjs')

let TopoEditContainer = function(element) {
  this.element = element
  this.topoImage = new TopoImage(document.createElement('canvas'),true)
  this.topoImage.AddMouseHandler()
  this.element.appendChild(this.topoImage.canvas)
  this.cragRouteTable = new CragRouteTable(this.element)
  this.topoRouteTable = new TopoRouteTable2(this.element)
}

TopoEditContainer.prototype.Hide = function() {
  this.element.style = 'display:none'
}

TopoEditContainer.prototype.Unhide = function() {
  this.element.style = ''
}

TopoEditContainer.prototype.Refresh = function(crag,topo) {
  this.topoImage.Refresh(topo)
  this.cragRouteTable.Refresh(crag)
  this.topoRouteTable.Refresh(topo)
}

module.exports = TopoEditContainer
