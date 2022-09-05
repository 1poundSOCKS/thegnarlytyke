const TopoImage = require('../objects/topo-image.cjs')
const { CreateTopoRouteTableContainer, RefreshTopoRouteTableContainer } = require('./topo-route-table.container.cjs')

let Create = () => {
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

let Refresh = (container,crag,topo,image,editable) => {
  container.topoImage.image = image
  container.topoImage.topo = topo
  container.topoImage.routeID = null
  container.topoImage.Refresh()
  RefreshTopoRouteTableContainer(container.table,crag,topo,editable,OnRouteSelectCallback,container)
}

let OnRouteSelectCallback = (container,routeInfo) => {
  container.topoImage.routeID = routeInfo.id
}

exports.Create = Create
exports.Refresh = Refresh
