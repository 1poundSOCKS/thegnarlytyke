const IconBarContainer = require('./icon-bar.container.cjs')
const TopoViewContainer = require('./topo-view.container.cjs')

let Create = () => {
  const root = document.createElement('div')

  const iconBarContainer = IconBarContainer.Create()
  IconBarContainer.AddIcon(iconBarContainer,'close','close','fas','fa-close')

  const topoEditContainer = document.createElement('div')
  topoEditContainer.classList.add('topo-edit-container')

  const topoView = TopoViewContainer.Create()
  topoView.topoImage.contentEditable = true
  topoView.topoImage.AddMouseHandler()
  topoEditContainer.appendChild(topoView.root)

  root.appendChild(iconBarContainer.root)
  root.appendChild(topoEditContainer)
  return {root:root,iconBar:iconBarContainer,topoView:topoView}
}

let Refresh = (container,crag,topo,image) => {
  TopoViewContainer.Refresh(container.topoView,crag,topo,image,true)
}

exports.Create = Create
exports.Refresh = Refresh
