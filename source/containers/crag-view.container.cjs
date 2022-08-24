const TopoImage = require('../objects/topo-image.cjs')
const TopoRouteTable2 = require('../objects/topo-route-table-2.cjs')
const TopoImagesContainer = require('./topo-images.container.cjs')

let CreateCragViewContainer = () => {
  const element = document.createElement('div')
  const header = CreateCragViewHeader()
  const topoImagesContainer = TopoImagesContainer.Create()
  const topoView = CreateTopoViewContainer()

  topoImagesContainer.container.topoImage = topoView.topoImage
  topoImagesContainer.container.topoRouteTable = topoView.routeTable

  element.appendChild(header.root)
  element.appendChild(topoImagesContainer.root)
  element.appendChild(topoView.root)

  return {root:element,header:header,topoImages:topoImagesContainer,topoView:topoView}
}

let CreateCragViewHeader = () => {
  const element = document.createElement('div')
  element.id = 'crag-view-header'
  element.classList.add('crag-view-header')
  const cragName = document.createElement('span')
  cragName.classList.add('crag-name')
  
  element.appendChild(cragName)
  const closeIcon = document.createElement('i')
  closeIcon.classList.add('close-crag-view-icon','far','fa-window-close')
  closeIcon.title = 'close'
  element.appendChild(closeIcon)

  return {root:element,name:cragName,close:closeIcon}
}

let CreateTopoViewContainer = () => {
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

let RefreshCragViewContainer = (container,crag,imageStorage) => {
  return new Promise( (accept) => {
    if( container.cragNameElement ) {
      if( container.cragNameElement.nodeName.toLowerCase() === 'input' ) {
        container.cragNameElement.value = this.crag.name
        container.cragNameElement.onchange = () => {
          container.selectedContainer.cragDetails.name = container.cragNameElement.value
          container.selectedContainer.crag.name = container.cragNameElement.value
        }
      }
      else {
        container.cragNameElement.innerText = container.crag.name
      }
    }
    if( container.header?.name ) container.header.name.innerText = crag.name
    container.topoImages.container.Refresh(crag,imageStorage)
    .then( () => {
      if( crag.topos?.length == 0 ) container.topoView.root.style = 'display:none'
      else container.topoView.root.style = ''
      accept()
    })
  })
}

exports.Create = CreateCragViewContainer
exports.Refresh = RefreshCragViewContainer
