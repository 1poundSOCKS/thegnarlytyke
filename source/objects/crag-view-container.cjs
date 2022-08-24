const TopoMediaScroller = require('./topo-media-scroller.cjs')
const TopoImage = require('./topo-image.cjs')
const TopoRouteTable2 = require('./topo-route-table-2.cjs')

let CreateCragViewContainer = function() {
  container = {}
  container.root = document.createElement('div')
  container.root.id = 'crag-view-container'
  container.header = CreateCragViewHeader()
  container.root.appendChild(container.header.root)
  container.root.appendChild(CreateTopoImagesContainer(container))
  container.root.appendChild(CreateMainTopoContainer(container))

  container.topoMediaScroller.topoImage = container.topoImage
  container.topoMediaScroller.topoRouteTable = container.topoRouteTable
  container.topoMediaScroller.autoSelectOnRefresh = true

  return container
}

let CreateCragViewHeader = () => {
  const element = document.createElement('div')
  element.id = 'crag-view-header'
  element.classList.add('crag-view-header')
  const cragName = document.createElement('span')
  cragName.id = 'crag-name'
  cragName.classList.add('crag-name')
  
  element.appendChild(cragName)
  const closeIcon = document.createElement('i')
  closeIcon.id = 'close-crag-view'
  closeIcon.classList.add('close-crag-view-icon','far','fa-window-close')
  closeIcon.title = 'close'
  element.appendChild(closeIcon)

  return {root:element,name:cragName,close:closeIcon}
}

let CreateTopoImagesContainer = (container) => {
  const element = document.createElement('div')
  element.id = 'topo-images-container'
  element.classList.add('topo-images-container')
  
  container.topoMediaScroller = new TopoMediaScroller(element)
  
  return element
}

let CreateMainTopoContainer = (container) => {
  const element = document.createElement('div')
  element.id = 'main-topo-container'
  element.classList.add('main-topo-container')
  
  container.topoContainer = element
  
  const imageContainer = document.createElement('div')
  imageContainer.classList.add('main-topo-image-container')
  
  const imageCanvas = document.createElement('canvas')
  imageCanvas.id = 'main-topo-image'
  imageCanvas.classList.add('main-topo-image')

  container.topoImage = new TopoImage(imageCanvas, false);

  imageContainer.appendChild(imageCanvas)
  
  element.appendChild(imageContainer)
  
  const tableContainer = document.createElement('div')
  tableContainer.id = 'topo-route-table-container'
  tableContainer.classList.add('topo-route-table-container')

  container.topoRouteTable = new TopoRouteTable2(tableContainer)

  element.appendChild(tableContainer)

  return element
}

RefreshCragViewContainer = function(container,crag,imageStorage) {
  return new Promise( (accept) => {
    container.crag = crag
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
    container.topoMediaScroller.Refresh(container.crag,imageStorage,true)
    .then( () => {
      if( container.crag.topos?.length == 0 ) container.topoContainer.style = 'display:none'
      else container.topoContainer.style = ''
      accept()
    })
  })
}

exports.Create = CreateCragViewContainer
exports.Refresh = RefreshCragViewContainer
