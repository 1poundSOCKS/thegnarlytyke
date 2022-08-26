const TopoImage = require('../objects/topo-image.cjs')
const TopoRouteTable2 = require('../objects/topo-route-table-2.cjs')

let Create = () => {
  const element = document.createElement('div')
  element.classList.add('main-topo-container')
  
  const imageContainer = document.createElement('div')
  imageContainer.classList.add('main-topo-image-container')
  
  const imageCanvas = document.createElement('canvas')
  imageCanvas.classList.add('main-topo-image')
  const topoImage = new TopoImage(imageCanvas, false);
  imageContainer.appendChild(imageCanvas)
  
  const tableContainer = document.createElement('div')
  tableContainer.classList.add('topo-route-table-container')
  const topoRouteTable = new TopoRouteTable2(tableContainer)

  element.appendChild(imageContainer)
  element.appendChild(tableContainer)

  return {root:element,topoImage:topoImage,routeTable:topoRouteTable}
}

let Refresh = (container,topo,image) => {
  container.topoImage.image = image
  container.topoImage.topo = topo
  container.topoImage.Refresh()
  container.routeTable.Refresh(topo)
}

exports.Create = Create
exports.Refresh = Refresh
