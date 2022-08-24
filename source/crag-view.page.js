const Config = require('./objects/config.cjs')
const DataStorage = require('./objects/data-storage.cjs')
const ImageStorage = require('./objects/image-storage.cjs')
const Cookie = require('./objects/cookie.cjs')
const CreatePageHeader = require('./objects/page-header.cjs')
const CragIndexContainer = require('./objects/crag-index-container.cjs')
const CragViewContainer = require('./objects/crag-view-container.cjs')

window.onload = () => {
  InitWindowStyle()
  Config.Load().then( () => OnConfigLoad() );
}

window.onresize = () => {
  InitWindowStyle()
}

let InitWindowStyle = () => {
  const cragCoversColumnCount = Math.max(1,~~(window.innerWidth / 400))
  document.documentElement.style.setProperty("--crag-covers-column-count", cragCoversColumnCount)
}

let OnConfigLoad = async () => {
  const cookie = new Cookie();

  DataStorage.Init(Config);
  ImageStorage.Init(Config);

  const pageHeader = CreatePageHeader('home',cookie,Config)

  const viewContainer = CreateViewContainer()

  const cragViewContainer = CragViewContainer.Create()
  const cragIndexContainer = CreateCragIndexContainer(DataStorage,ImageStorage)

  AddViewToContainer(viewContainer,cragIndexContainer,'crag-index')
  AddViewToContainer(viewContainer,cragViewContainer,'crag-view')

  const page = document.getElementById('page')
  page.appendChild(pageHeader.root)
  page.appendChild(viewContainer.root)

  cragIndexContainer.container.Load()
  .then( () => {
    DisplayView(viewContainer,'crag-index')
    AddCragIndexContainerSelectionHandler( cragIndexContainer, async (container) => {
      const crag = await container.LoadCrag(DataStorage)
      await CragViewContainer.Refresh(cragViewContainer,crag,ImageStorage)
      DisplayView(viewContainer,'crag-view')
    })
  })

  cragViewContainer.header.close.onclick = () => {
    DisplayView(viewContainer,'crag-index')
  }
}

let CreateCragIndexContainer = (dataStorage,imageStorage) => {
  const div = document.createElement('div')
  div.id = 'crag-index-container'
  const cragIndexContainer = new CragIndexContainer(div,dataStorage,imageStorage)
  return {root:div,container:cragIndexContainer}
}

let AddCragIndexContainerSelectionHandler = (container,handler) => {
  container.container.AddUserSelectionHandler(handler)
}

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
