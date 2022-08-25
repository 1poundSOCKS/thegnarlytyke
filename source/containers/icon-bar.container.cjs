let Create = () => {
  const element = document.createElement('div')
  element.classList.add('icon-bar-container')
  const icons = new Map()
  return {root:element,icons:icons}
}

let AddIcon = (container,id,title,...classes) => {
  const icon = document.createElement('i')
  icon.title = title
  classes.forEach( cls => icon.classList.add(cls) )
  container.root.appendChild(icon)
  container.icons.set(id,icon)
  return icon
}

exports.Create = Create
exports.AddIcon = AddIcon
