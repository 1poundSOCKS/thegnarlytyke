const { default: dataStorage } = require("../objects/data-storage.cjs")

let CreateFeedContainer = () => {
  const root = document.createElement('div')
  root.classList.add('feed-container')
  return { root: root }
}

let LoadFeed = async dataStorage => {
  const feedData = await dataStorage.Load('feed')
  const feed = feedData.data.map( item => {
    return {
      timestamp: item.timestamp,
      type: item.type,
      title: item.title,
      link: item.link,
      description: item.description
    }
  })
  return feed
}

let RefreshFeed = (container, feed) => {
  container.root.innerHTML = ''
  const containers = feed.map( item => CreateFeedItemContainer(item) )
  containers.forEach( itemContainer => {
    container.root.appendChild(itemContainer.root)
  })
}

let CreateFeedItemContainer = (item) => {
  const root = document.createElement('div')
  root.classList.add('feed-item-container')
  const type = document.createElement('div')
  type.classList.add('feed-item-header')
  type.innerText = `${item.timestamp}: ${item.type.toUpperCase()}`
  const linkContainer = document.createElement('div')
  const link = document.createElement('a')
  link.setAttribute('href',item.link)
  link.setAttribute('target','_blank') // open in a new tab
  link.innerText = item.title
  linkContainer.appendChild(link)
  // const descContainer = document.createElement('div')
  // descContainer.classList.add('feed-item-description')
  // descContainer.innerText = item.description
  root.appendChild(type)
  root.appendChild(linkContainer)
  // root.appendChild(descContainer)
  return { root: root }
}

exports.CreateFeedContainer = CreateFeedContainer
exports.LoadFeed = LoadFeed
exports.RefreshFeed = RefreshFeed
