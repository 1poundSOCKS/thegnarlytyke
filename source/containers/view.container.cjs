let CreateViewContainer = () => {
  const div = document.createElement('div')
  return {root:div,views:new Map()}
}

let AddViewToContainer = (container,view,name) => {
  container.views.set(name,view)
}

let DisplayView = (container,name) => {
  container.views.forEach( (mappedContainer, mappedName) => {
    if( mappedName == name ) {
      container.root.appendChild(mappedContainer.root)
    }
    else {
      mappedContainer.root.remove()
    }
  })
}

exports.Create = CreateViewContainer
exports.AddView = AddViewToContainer
exports.DisplayView = DisplayView
