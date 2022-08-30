const IconBarContainer = require('./icon-bar.container.cjs')
const CragIndexContainer = require("./crag-index.container.cjs")

let Create = (dataStorage,imageStorage) => {
  const div = document.createElement('div')

  const iconBarContainer = IconBarContainer.Create()
  IconBarContainer.AddIcon(iconBarContainer,'add','add','fa','fa-plus-square')
  IconBarContainer.AddIcon(iconBarContainer,'updateImage','update image','fa','fa-file-upload')
  IconBarContainer.AddIcon(iconBarContainer,'shiftLeft','shift left','fas','fa-arrow-left')
  IconBarContainer.AddIcon(iconBarContainer,'shiftRight','shift right','fas','fa-arrow-right')
  IconBarContainer.AddIcon(iconBarContainer,'edit','edit','fas','fa-edit')

  const cragIndexContainer = CragIndexContainer.Create(dataStorage,imageStorage)

  iconBarContainer.icons.get('add').onclick = () => {
    cragIndexContainer.cragIndex.AddNewCrag()
  }

  iconBarContainer.icons.get('updateImage').onclick = () => {
    cragIndexContainer.cragIndex.UpdateSelectedImage()
  }

  iconBarContainer.icons.get('shiftLeft').onclick = () => {
    cragIndexContainer.cragIndex.ShiftCragLeft()
  }

  iconBarContainer.icons.get('shiftRight').onclick = () => {
    cragIndexContainer.cragIndex.ShiftCragRight()
  }

  div.appendChild(iconBarContainer.root)
  div.appendChild(cragIndexContainer.root)

  return {root:div,iconBar:iconBarContainer,cragIndex:cragIndexContainer}
}

let LoadSelectedCrag = async (container) => {
  return CragIndexContainer.LoadSelectedCrag(container.cragIndex)
}

let UpdateSelectedCragName = (container,name) => {
  container.cragIndex.cragIndex.selectedContainer.cragDetails.name = name
  container.cragIndex.cragIndex.selectedContainer.crag.name = name
}

exports.Create = Create
exports.LoadSelectedCrag = LoadSelectedCrag
exports.UpdateSelectedCragName = UpdateSelectedCragName
