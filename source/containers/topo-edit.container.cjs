const CragRouteTable = require('../objects/crag-route-table.cjs')
const IconBarContainer = require('./icon-bar.container.cjs')
const TopoViewContainer = require('./topo-view.container.cjs')

let Create = () => {
  const root = document.createElement('div')

  const iconBarContainer = IconBarContainer.Create()
  IconBarContainer.AddIcon(iconBarContainer,'close','close','fas','fa-close')

  const topoEditContainer = document.createElement('div')
  topoEditContainer.classList.add('topo-edit-container')

  const topoView = TopoViewContainer.Create()
  topoView.topoImage.contentEditable = true
  topoView.topoImage.AddMouseHandler()
  topoView.routeTable.callbackObject = topoView.topoImage

  const cragRouteTableContainer = document.createElement('div')
  const cragRouteTable = new CragRouteTable(cragRouteTableContainer,topoView.routeTable)

  topoEditContainer.appendChild(topoView.root)
  topoEditContainer.appendChild(cragRouteTableContainer)

  root.appendChild(iconBarContainer.root)
  root.appendChild(topoEditContainer)

  return {root:root,iconBar:iconBarContainer,topoView:topoView,cragRouteTable:cragRouteTable}
}

let Refresh = (container,crag,topo,image) => {
  TopoViewContainer.Refresh(container.topoView,topo,image)
  container.cragRouteTable.Refresh(crag,topo)
}

exports.Create = Create
exports.Refresh = Refresh
