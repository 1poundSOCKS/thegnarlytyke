const TopoMediaScroller = require('../objects/topo-media-scroller.cjs')

let CreateTopoImagesContainer = () => {
  const element = document.createElement('div')
  element.classList.add('topo-images-container')
  const topoMediaScroller = new TopoMediaScroller(element)
  topoMediaScroller.autoSelectOnRefresh = true
  return {root:element,container:topoMediaScroller}
}

exports.Create = CreateTopoImagesContainer
