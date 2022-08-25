const TopoMediaScroller = require('../objects/topo-media-scroller.cjs')

let Create = () => {
  const element = document.createElement('div')
  element.classList.add('topo-images-container')
  const topoMediaScroller = new TopoMediaScroller(element)
  return {root:element,topoMediaScroller:topoMediaScroller}
}

let Refresh = (container,crag,imageStorage) => {
  container.topoMediaScroller.Refresh(crag,imageStorage)
}

exports.Create = Create
exports.Refresh = Refresh
