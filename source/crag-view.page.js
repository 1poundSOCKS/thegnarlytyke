const Config = require('./objects/config.cjs')
const DataStorage = require('./objects/data-storage.cjs')
const ImageStorage = require('./objects/image-storage.cjs')
const Cookie = require('./objects/cookie.cjs')
const CreatePageHeader = require('./objects/page-header.cjs')
const ViewContainer = require('./containers/view.container.cjs')
const CragIndexContainer = require('./containers/crag-index.container.cjs')
const CragViewContainer = require('./containers/crag-view.container.cjs')
const LoadingContainer = require('./containers/loading.container.cjs')

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

  const viewContainer = ViewContainer.Create()
  const cragIndexContainer = CragIndexContainer.Create(DataStorage,ImageStorage)
  const cragViewContainer = CragViewContainer.Create()
  ViewContainer.AddView(viewContainer,cragIndexContainer,'crag-index')
  ViewContainer.AddView(viewContainer,cragViewContainer,'crag')
  ViewContainer.DisplayView(viewContainer,'crag-index')

  CragIndexContainer.AddCragSelectionHandler( cragIndexContainer, async (cragContainer) => {
    const crag = await cragContainer.LoadCrag(DataStorage)
    await CragViewContainer.Refresh(cragViewContainer,crag,ImageStorage)
    ViewContainer.DisplayView(viewContainer,'crag')
  })

  // create the main page view and add the views
  const pageViewContainer = ViewContainer.Create()
  const loadingContainer = LoadingContainer.Create()
  ViewContainer.AddView(pageViewContainer,viewContainer,'view')
  ViewContainer.AddView(pageViewContainer,loadingContainer,'loading')
  
  const page = document.getElementById('page')
  const pageHeader = CreatePageHeader('home',cookie,Config)
  page.appendChild(pageHeader.root)
  page.appendChild(pageViewContainer.root)

  cragViewContainer.header.close.onclick = () => {
    ViewContainer.DisplayView(viewContainer,'crag-index')
  }

  ViewContainer.DisplayTemporaryView(pageViewContainer,'loading','view', async () => {
    return CragIndexContainer.Load(cragIndexContainer)
  })
}
