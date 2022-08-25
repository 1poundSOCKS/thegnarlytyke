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
  div.appendChild(topoImagesContainer.root)

  return {root:div,iconBar:iconBarContainer,topoImages:topoImagesContainer}
}

let Refresh = (container,crag,imageStorage) => {
  TopoImagesContainer.Refresh(container.topoImages,crag,imageStorage)
}

exports.Create = Create
exports.Refresh = Refresh
