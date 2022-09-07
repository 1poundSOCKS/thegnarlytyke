const IconBarContainer = require('./icon-bar.container.cjs')
const TopoImagesContainer = require('./topo-images.container.cjs')

let Create = () => {
  const div = document.createElement('div')

  const iconBarContainer = IconBarContainer.Create()
  IconBarContainer.AddIcon(iconBarContainer,'add','add','fa','fa-plus-square')
  IconBarContainer.AddIcon(iconBarContainer,'updateImage','update image','fa','fa-file-upload')
  IconBarContainer.AddIcon(iconBarContainer,'shiftLeft','shift left','fas','fa-arrow-left')
  IconBarContainer.AddIcon(iconBarContainer,'shiftRight','shift right','fas','fa-arrow-right')
  IconBarContainer.AddIcon(iconBarContainer,'edit','edit','fas','fa-edit')
  IconBarContainer.AddIcon(iconBarContainer,'close','close','fas','fa-close')

  const cragDetailsContainer = document.createElement('div')
  cragDetailsContainer.classList.add('crag-details-container')

  const cragName = document.createElement('input')
  cragDetailsContainer.appendChild(cragName)

  const cragRockType = document.createElement('input')  
  cragDetailsContainer.appendChild(cragRockType)

  const topoImagesContainer = TopoImagesContainer.Create()

  iconBarContainer.icons.get('add').onclick = () => {
    topoImagesContainer.topoMediaScroller.AddNew()
  }

  iconBarContainer.icons.get('updateImage').onclick = () => {
    topoImagesContainer.topoMediaScroller.UpdateSelectedImage()
  }

  iconBarContainer.icons.get('shiftLeft').onclick = () => {
    topoImagesContainer.topoMediaScroller.ShiftSelectedLeft()
  }

  iconBarContainer.icons.get('shiftRight').onclick = () => {
    topoImagesContainer.topoMediaScroller.ShiftSelectedRight()
  }

  div.appendChild(iconBarContainer.root)
  div.appendChild(cragDetailsContainer)
  div.appendChild(topoImagesContainer.root)

  return {
    root:div,
    iconBar:iconBarContainer,
    cragName:cragName,
    cragRockType:cragRockType,
    topoImages:topoImagesContainer
  }
}

let Refresh = (container,crag,imageStorage) => {
  container.cragName.value = crag.name
  container.cragRockType.value = crag.rock_type ? crag.rock_type : ''
  TopoImagesContainer.Refresh(container.topoImages,crag,imageStorage)

  container.cragName.onchange = () => crag.name = container.cragName.value
  container.cragRockType.onchange = () => crag.rock_type = container.cragRockType.value
}

let GetSelectedTopo = (container) => {
  return container.topoImages.topoMediaScroller.selectedTopo
}

let GetSelectedTopoImage = (container) => {
  return container.topoImages.topoMediaScroller.selectedTopo.image
}

exports.Create = Create
exports.Refresh = Refresh
exports.GetSelectedTopo = GetSelectedTopo
exports.GetSelectedTopoImage = GetSelectedTopoImage
