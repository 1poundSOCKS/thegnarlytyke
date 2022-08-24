const Config = require('./objects/config.cjs')
const DataStorage = require('./objects/data-storage.cjs')
const ImageStorage = require('./objects/image-storage.cjs')
const Cookie = require('./objects/cookie.cjs')
const CreatePageHeader = require('./objects/page-header.cjs')
const ViewContainer = require('./containers/view.container.cjs')
const CragIndexContainer = require('./containers/crag-index.container.cjs')
const CragViewContainer = require('./objects/crag-view-container.cjs')
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

  const pageHeader = CreatePageHeader('home',cookie,Config)

  const viewContainer = ViewContainer.Create()

  const cragViewContainer = CragViewContainer.Create()
  const cragIndexContainer = CragIndexContainer.Create(DataStorage,ImageStorage)

  const loadingContainer = LoadingContainer.Create()

  ViewContainer.AddView(viewContainer,cragIndexContainer,'crag-index')
  ViewContainer.AddView(viewContainer,cragViewContainer,'crag')
  ViewContainer.AddView(viewContainer,loadingContainer,'loading')

  const page = document.getElementById('page')
  page.appendChild(pageHeader.root)
  page.appendChild(viewContainer.root)

  cragIndexContainer.container.Load()
  .then( () => {
    ViewContainer.DisplayView(viewContainer,'crag-index')
    CragIndexContainer.AddCragSelectionHandler( cragIndexContainer, async (container) => {
      ViewContainer.DisplayView(viewContainer,'loading')
      const crag = await container.LoadCrag(DataStorage)
      await CragViewContainer.Refresh(cragViewContainer,crag,ImageStorage)
      ViewContainer.DisplayView(viewContainer,'crag')
    })
  })

  cragViewContainer.header.close.onclick = () => {
    ViewContainer.DisplayView(viewContainer,'crag-index')
  }
}
