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

  const pageHeader = CreatePageHeader('edit',cookie,Config)
  const iconBar = IconBarContainer.Create()

  const cragIndexEditContainer = CragIndexEditContainer.Create(DataStorage,ImageStorage)
  const topoIndexEditContainer = TopoIndexEditContainer.Create()
  const topoEditContainer = TopoEditContainer.Create()
  const loadingContainer = LoadingContainer.Create()

  const viewContainer = ViewContainer.Create()
  ViewContainer.AddView(viewContainer,cragIndexEditContainer,'crag-index')
  ViewContainer.AddView(viewContainer,topoIndexEditContainer,'topo-index')
  ViewContainer.AddView(viewContainer,topoEditContainer,'topo-edit')
  ViewContainer.AddView(viewContainer,loadingContainer,'loading')

  const page = document.getElementById('page')
  page.appendChild(pageHeader.root)
  page.appendChild(iconBar.root)
  page.appendChild(viewContainer.root)

  cragIndexEditContainer.iconBar.icons.get('edit').onclick = async () => {
    loadingContainer.root.innerText = 'loading...'
    ViewContainer.DisplayView(viewContainer,'loading')
    const crag = await CragIndexEditContainer.LoadSelectedCrag(cragIndexEditContainer)
    TopoIndexEditContainer.Refresh(topoIndexEditContainer,crag,ImageStorage)
    ViewContainer.DisplayView(viewContainer,'topo-index')
  }

  IconBarContainer.AddIcon(iconBar,'save','save','fas','fa-save').onclick = async () => {
    loadingContainer.root.innerText = 'saving...'
    ViewContainer.DisplayView(viewContainer,'loading')
    try {
      await CragIndexContainer.Save(cragIndexEditContainer.cragIndex)
    }
    catch( e ) {
      console.log(e)
    }
    ViewContainer.DisplayView(viewContainer,'crag-index')
  }

  IconBarContainer.AddIcon(iconBar,'publish','publish','fa','fa-book').onclick = async () => {
    loadingContainer.root.innerText = 'publishing user updates...'
    ViewContainer.DisplayView(viewContainer,'loading')
    try {
      await OnPublishUserUpdates(cookie)
    }
    catch( e ) {}
    ViewContainer.DisplayView(viewContainer,'crag-index')
  }

  IconBarContainer.AddIcon(iconBar,'discard','discard','fa','fa-trash').onclick = async () => {
    loadingContainer.root.innerText = 'discarding user updates...'
    ViewContainer.DisplayView(viewContainer,'loading')
    try {
      await OnDiscardUserUpdates(cookie)
    }
    catch( e ) {}
    ViewContainer.DisplayView(viewContainer,'crag-index')
  }

  topoIndexEditContainer.iconBar.icons.get('edit').onclick = () => {
    const crag = topoIndexEditContainer.topoImages.topoMediaScroller.crag
    const topo = TopoIndexEditContainer.GetSelectedTopo(topoIndexEditContainer)
    const image = TopoIndexEditContainer.GetSelectedTopoImage(topoIndexEditContainer)
    TopoEditContainer.Refresh(topoEditContainer,crag,topo,image)
    ViewContainer.DisplayView(viewContainer,'topo-edit')
  }

  topoIndexEditContainer.iconBar.icons.get('close').onclick = () => {
    ViewContainer.DisplayView(viewContainer,'crag-index')
  }
  
  topoEditContainer.iconBar.icons.get('close').onclick = () => {
    ViewContainer.DisplayView(viewContainer,'topo-index')
  }

  loadingContainer.root.innerText = 'loading...'
  ViewContainer.DisplayView(viewContainer,'loading')

  CragIndexContainer.Load(cragIndexEditContainer.cragIndex)
  .then( () => {
    ViewContainer.DisplayView(viewContainer,'crag-index')
  })
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
