
const CragIndexContainer = require('../objects/crag-index-container.cjs')

let Create = (dataStorage,imageStorage) => {
  const div = document.createElement('div')
  div.id = 'crag-index-container'
  const cragIndexContainer = new CragIndexContainer(div,dataStorage,imageStorage)
  return {root:div,container:cragIndexContainer}
}

let AddCragSelectionHandler = (container,handler) => {
  container.container.AddUserSelectionHandler(handler)
}

exports.Create = Create
exports.AddCragSelectionHandler = AddCragSelectionHandler
