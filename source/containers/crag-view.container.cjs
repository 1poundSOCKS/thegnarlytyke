const TopoImagesContainer = require('./topo-images.container.cjs')
const TopoViewContainer = require('./topo-view.container.cjs')

let Create = () => {
  const element = document.createElement('div')
  const header = CreateHeader()
  const topoImagesContainer = TopoImagesContainer.Create()
  const topoView = TopoViewContainer.Create()

  topoImagesContainer.topoMediaScroller.autoSelectOnRefresh = true

  element.appendChild(header.root)
  element.appendChild(topoImagesContainer.root)
  element.appendChild(topoView.root)

  return {root:element,header:header,topoImages:topoImagesContainer,topoView:topoView}
}

let CreateHeader = () => {
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

let Refresh = (container,crag,imageStorage) => {
  container.topoImages.topoMediaScroller.OnSelectCallbackFunction = OnSelectTopo
  container.topoImages.topoMediaScroller.onSelectCallbackObject = container

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
    container.topoImages.topoMediaScroller.Refresh(crag,imageStorage)
    .then( () => {
      if( crag.topos?.length == 0 ) container.topoView.root.style = 'display:none'
      else container.topoView.root.style = ''
      accept()
    })
  })
}

let OnSelectTopo = (container,crag,topo,image) => {
  TopoViewContainer.Refresh(container.topoView,crag,topo,image)
}

exports.Create = Create
exports.Refresh = Refresh
