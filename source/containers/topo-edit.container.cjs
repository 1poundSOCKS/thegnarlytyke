const IconBarContainer = require('./icon-bar.container.cjs')

let Create = () => {
  const div = document.createElement('div')

  const iconBarContainer = IconBarContainer.Create()
  IconBarContainer.AddIcon(iconBarContainer,'close','close','fas','fa-close')

  div.appendChild(iconBarContainer.root)

  return {root:div,iconBar:iconBarContainer}
}

exports.Create = Create
