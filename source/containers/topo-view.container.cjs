const TopoImage = require('../objects/topo-image.cjs')
const { CreateTopoRouteTableContainer, RefreshTopoRouteTableContainer } = require('./topo-route-table.container.cjs')

let CreateTopoViewContainer = () => {
  const element = document.createElement('div')
  element.classList.add('main-topo-container')
  
  const imageContainer = document.createElement('div')
  imageContainer.classList.add('main-topo-image-container')
  
  const imageCanvas = document.createElement('canvas')
  imageCanvas.classList.add('main-topo-image')
  const topoImage = new TopoImage(imageCanvas, false)
  imageContainer.appendChild(imageCanvas)  

  const tableContainer = CreateTopoRouteTableContainer()

  element.appendChild(imageContainer)
  element.appendChild(tableContainer.root)

  return {root:element,topoImage:topoImage,table:tableContainer}
}

let RefreshTopoViewContainer = (container,crag,topo,image,editable) => {
  container.topoImage.image = image
  container.topoImage.topo = topo
  container.topoImage.routeID = null
  container.topoImage.OnRouteChangedCallback = OnRouteChangedCallback
  container.topoImage.callbackObject = container
  container.topoImage.Refresh()

  container.table.crag = crag
  container.table.topo = topo
  container.table.editable = editable
  container.table.OnRouteSelectCallback = OnRouteSelectCallback
  container.table.OnRouteClearCallback = OnRouteClearCallback
  container.table.callbackObject = container
  RefreshTopoRouteTableContainer(container.table/*,crag,topo,editable*/)
}

let OnRouteSelectCallback = (container,routeInfo) => {
  container.topoImage.routeID = routeInfo.id
}

let OnRouteClearCallback = (container,routeInfo) => {
  container.topoImage.Refresh()
}

let OnRouteChangedCallback = (container, routeInfo) => {
  RefreshTopoRouteTableContainer(container.table)
}

exports.CreateTopoViewContainer = CreateTopoViewContainer
exports.RefreshTopoViewContainer = RefreshTopoViewContainer
