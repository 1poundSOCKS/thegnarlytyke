const IconBarContainer = require('./icon-bar.container.cjs')
const TopoViewContainer = require('./topo-view.container.cjs')

let Create = () => {
  const div = document.createElement('div')

  const iconBarContainer = IconBarContainer.Create()
  IconBarContainer.AddIcon(iconBarContainer,'close','close','fas','fa-close')

  const topoView = TopoViewContainer.Create()

  div.appendChild(iconBarContainer.root)
  div.appendChild(topoView.root)

  return {root:div,iconBar:iconBarContainer,topoView:topoView}
}

let Refresh = (container,topo,image) => {
  TopoViewContainer.Refresh(container.topoView,topo,image)
}

exports.Create = Create
exports.Refresh = Refresh
