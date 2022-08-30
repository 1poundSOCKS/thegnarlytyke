
const CragIndexContainer = require('../objects/crag-index-container.cjs')

let Create = (dataStorage,imageStorage) => {
  const div = document.createElement('div')
  const cragIndexContainer = new CragIndexContainer(div,dataStorage,imageStorage)
  return {root:div,cragIndex:cragIndexContainer}
}

let Load = async (container) => {
  return container.cragIndex.Load()
}

let Save = async (container) => {
  return container.cragIndex.Save()
}

let AddCragSelectionHandler = (container,handler) => {
  container.cragIndex.AddUserSelectionHandler(handler)
}

let LoadSelectedCrag = async (container) => {
  return container.cragIndex.LoadSelectedCrag()
}

let RefreshSelectedContainer = (container) => {
  container.cragIndex.RefreshSelectedContainer()
}

exports.Create = Create
exports.Load = Load
exports.Save = Save
exports.AddCragSelectionHandler = AddCragSelectionHandler
exports.LoadSelectedCrag = LoadSelectedCrag
exports.RefreshSelectedContainer = RefreshSelectedContainer
