const Config = require('./objects/config.cjs');
const Cookie = require('./objects/cookie.cjs')
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require('./objects/image-storage.cjs');
const CreatePageHeader = require('./objects/page-header.cjs');
const ViewContainer = require('./containers/view.container.cjs')
const CragIndexContainer = require('./containers/crag-index.container.cjs')
const CragIndexEditContainer = require('./containers/crag-index-edit.container.cjs')
const TopoIndexEditContainer = require('./containers/topo-index-edit.container.cjs')
const TopoEditContainer = require('./containers/topo-edit.container.cjs')
const IconBarContainer = require('./containers/icon-bar.container.cjs')
const LoadingContainer = require('./containers/loading.container.cjs')

window.onload = () => {
  InitWindowStyle()
  Config.Load().then( () => OnConfigLoad() )
}

window.onresize = () => {
  InitWindowStyle()
}

let InitWindowStyle = () => {
  const cragCoversColumnCount = ~~(window.innerWidth / 400)
  const cragtoposColumnCount = ~~(window.innerWidth / 400)
  document.documentElement.style.setProperty("--crag-covers-column-count", cragCoversColumnCount)
  document.documentElement.style.setProperty("--crag-topos-column-count", cragtoposColumnCount)
}

let OnConfigLoad = async () => {
  const cookie = new Cookie();
  DataStorage.Init(Config, cookie.GetValue("user-id"), cookie.GetValue("user-token"),true);
  ImageStorage.Init(Config, cookie.GetValue("user-id"), cookie.GetValue("user-token"));

  // create the containers for the edit view
  const cragIndexEditContainer = CragIndexEditContainer.Create(DataStorage,ImageStorage)
  const topoIndexEditContainer = TopoIndexEditContainer.Create()
  const topoEditContainer = TopoEditContainer.Create()
  const editLoadingContainer = LoadingContainer.Create()

  // create the edit view with icon bar and add the views
  const editViewContainer = ViewContainer.Create()
  const iconBar = IconBarContainer.Create()
  editViewContainer.root.appendChild(iconBar.root)
  ViewContainer.AddView(editViewContainer,cragIndexEditContainer,'crag-index')
  ViewContainer.AddView(editViewContainer,topoIndexEditContainer,'topo-index')
  ViewContainer.AddView(editViewContainer,topoEditContainer,'topo-edit')
  ViewContainer.AddView(editViewContainer,editLoadingContainer,'loading')
  ViewContainer.DisplayView(editViewContainer,'crag-index')

  // create the main page view and add the views
  const mainViewContainer = ViewContainer.Create()
  const mainLoadingContainer = LoadingContainer.Create()
  ViewContainer.AddView(mainViewContainer, editViewContainer,'edit')
  ViewContainer.AddView(mainViewContainer, mainLoadingContainer,'loading')

  // setup the page and display the edit view
  const page = document.getElementById('page')
  const pageHeader = CreatePageHeader('edit',cookie,Config)
  page.appendChild(pageHeader.root)
  page.appendChild(mainViewContainer.root)
  ViewContainer.DisplayView(mainViewContainer,'edit')

  // setup the command handlers
  cragIndexEditContainer.iconBar.icons.get('edit').onclick = async () => {
    editLoadingContainer.header.innerText = 'loading'
    ViewContainer.DisplayView(editViewContainer,'loading')
    const crag = await CragIndexEditContainer.LoadSelectedCrag(cragIndexEditContainer)
    TopoIndexEditContainer.Refresh(topoIndexEditContainer,crag,ImageStorage)
    ViewContainer.DisplayView(editViewContainer,'topo-index')
  }

  IconBarContainer.AddIcon(iconBar,'save','save','fas','fa-save').onclick = async () => {
    mainLoadingContainer.header.innerText = 'saving'
    ViewContainer.DisplayView(mainViewContainer,'loading')
    try {
      await CragIndexContainer.Save(cragIndexEditContainer.cragIndex)
    }
    catch( e ) {
      console.log(e)
    }
    ViewContainer.DisplayView(mainViewContainer,'edit')
  }

  IconBarContainer.AddIcon(iconBar,'publish','publish','fa','fa-book').onclick = async () => {
    mainLoadingContainer.header.innerText = 'publishing updates'
    ViewContainer.DisplayView(mainViewContainer,'loading')
    try {
      await OnPublishUserUpdates(cookie)
    }
    catch( e ) {}
    ViewContainer.DisplayView(mainViewContainer,'edit')
  }

  IconBarContainer.AddIcon(iconBar,'discard','discard','fa','fa-trash').onclick = async () => {
    mainLoadingContainer.header.innerText = 'discarding updates'
    ViewContainer.DisplayView(mainViewContainer,'loading')
    try {
      await OnDiscardUserUpdates(cookie)
    }
    catch( e ) {}
    ViewContainer.DisplayView(mainViewContainer,'edit')
  }

  topoIndexEditContainer.iconBar.icons.get('edit').onclick = () => {
    const crag = topoIndexEditContainer.topoImages.topoMediaScroller.crag
    const topo = TopoIndexEditContainer.GetSelectedTopo(topoIndexEditContainer)
    const image = TopoIndexEditContainer.GetSelectedTopoImage(topoIndexEditContainer)
    TopoEditContainer.Refresh(topoEditContainer,crag,topo,image)
    ViewContainer.DisplayView(editViewContainer,'topo-edit')
  }

  topoIndexEditContainer.iconBar.icons.get('close').onclick = () => {
    CragIndexContainer.RefreshSelectedContainer(cragIndexEditContainer.cragIndex)
    ViewContainer.DisplayView(editViewContainer,'crag-index')
  }
  
  topoEditContainer.iconBar.icons.get('close').onclick = () => {
    ViewContainer.DisplayView(editViewContainer,'topo-index')
  }

  ViewContainer.DisplayTemporaryView(mainViewContainer,'loading','edit', async () => CragIndexContainer.Load(cragIndexEditContainer.cragIndex))
}

let OnPublishUserUpdates = async (cookie) => {
  const responseData = await fetch(`${Config.publish_user_updates_url}?user_id=${cookie.GetValue("user-id")}&user_token=${cookie.GetValue("user-token")}`)
  const response = await responseData.json()
  console.log(response)
  if( response.error ) {
    console.log(response.error)
    throw response.error
  }
  return response
}

let OnDiscardUserUpdates = async (cookie) => {
  const responseData = await fetch(`${Config.delete_user_updates_url}?user_id=${cookie.GetValue("user-id")}&user_token=${cookie.GetValue("user-token")}`)
  const response = await responseData.json()
  console.log(response)
  if( response.error ) {
    console.log(response.error)
    throw response.error
  }
  return response
}
