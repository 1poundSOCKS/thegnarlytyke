const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require('./objects/image-storage.cjs');
const CreatePageHeader = require('./objects/page-header.cjs');
const ViewContainer = require('./containers/view.container.cjs')
const CragIndexContainer = require('./containers/crag-index.container.cjs')
const LoadingContainer = require('./containers/loading.container.cjs')
// const CragIndexContainer = require('./objects/crag-index-container.cjs')
const Cookie = require('./objects/cookie.cjs')
const TopoMediaScroller = require('./objects/topo-media-scroller.cjs')
const TopoEditContainer = require('./objects/topo-edit-container.cjs')

let _cookie = null;

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
  _cookie = new Cookie();

  const pageHeader = CreatePageHeader('edit',_cookie,Config)
  const iconBarContainer = CreateIconBarContainer()
  const viewContainer = ViewContainer.Create()
  const cragIndexContainer = CragIndexContainer.Create(DataStorage,ImageStorage)
  const loadingContainer = LoadingContainer.Create()
  // const cragIndexContainer = CreateCragIndexContainer()
  // const cragViewContainer = CreateCragViewContainer()
  // const topoEditContainer = CreateTopoEditContainer()

  ViewContainer.AddView(viewContainer,cragIndexContainer,'crag-index')
  ViewContainer.AddView(viewContainer,loadingContainer,'loading')

  const page = document.getElementById('page')
  page.appendChild(pageHeader.root)
  page.appendChild(iconBarContainer.root)
  // page.appendChild(cragIndexContainer.root)
  // page.appendChild(cragViewContainer.root)
  // page.appendChild(topoEditContainer.root)
  page.appendChild(viewContainer.root)

  DataStorage.Init(Config, _cookie.GetValue("user-id"), _cookie.GetValue("user-token"),true);
  ImageStorage.Init(Config, _cookie.GetValue("user-id"), _cookie.GetValue("user-token"));

  // cragIndexContainer.container.topoMediaScroller = cragViewContainer.topoIndexContainer
  // cragIndexContainer.container.Load(()=> {
  //   cragViewContainer.cragName.value = cragIndexContainer.container.selectedContainer.cragDetails.name
  // })

  // cragViewContainer.cragName.onchange = () => {
  //   cragIndexContainer.container.selectedContainer.cragDetails.name = cragIndexContainer.container.selectedCrag.name = cragViewContainer.cragName.value
  // }

  // OnEditIndex(iconBarContainer,cragIndexContainer,cragViewContainer,topoEditContainer)
  // iconBarContainer.icons.get('save').onclick = () => OnSave(cragIndexContainer)

  ViewContainer.DisplayView(viewContainer,'loading')

  CragIndexContainer.Load(cragIndexContainer)
  .then( () => {
    ViewContainer.DisplayView(viewContainer,'crag-index')
  })
}

let OnEditIndex = (iconBarContainer,cragIndexContainer, cragViewContainer, topoEditContainer) => {
  cragViewContainer.root.style = 'display:none'
  topoEditContainer.root.style = 'display:none'
  cragIndexContainer.container.RefreshSelectedContainer()
  iconBarContainer.icons.get('add').onclick = () => cragIndexContainer.container.AddNewCrag()
  iconBarContainer.icons.get('updateImage').onclick = () => cragIndexContainer.container.UpdateSelectedImage()
  iconBarContainer.icons.get('shiftLeft').onclick = () => cragIndexContainer.container.ShiftCragLeft()
  iconBarContainer.icons.get('shiftRight').onclick = () => cragIndexContainer.container.ShiftCragRight()
  iconBarContainer.icons.get('edit').onclick = () => OnEditCrag(iconBarContainer,cragIndexContainer, cragViewContainer, topoEditContainer)
  iconBarContainer.icons.get('publish').onclick = () => OnPublishUserUpdates()
  iconBarContainer.icons.get('discard').onclick = () => OnDiscardUserUpdates()
  iconBarContainer.icons.get('close').style = 'display:none'
  cragIndexContainer.root.style = ''
}

let OnEditCrag = (iconBarContainer, cragIndexContainer, cragViewContainer, topoEditContainer) => {
  cragIndexContainer.container.ShowSelectedCrag()
  .then( (crag) => {
    if( !crag ) return
    cragIndexContainer.root.style = 'display:none'
    topoEditContainer.root.style = 'display:none'
    iconBarContainer.icons.get('add').onclick = () => cragViewContainer.topoIndexContainer.AddNew()
    iconBarContainer.icons.get('updateImage').onclick = () => cragViewContainer.topoIndexContainer.UpdateSelectedImage()
    iconBarContainer.icons.get('shiftLeft').onclick = () => cragViewContainer.topoIndexContainer.ShiftSelectedLeft()
    iconBarContainer.icons.get('shiftRight').onclick = () => cragViewContainer.topoIndexContainer.ShiftSelectedRight()
    iconBarContainer.icons.get('edit').onclick = () => OnEditTopo(iconBarContainer, cragIndexContainer, cragViewContainer, topoEditContainer)
    iconBarContainer.icons.get('close').onclick = () => OnEditIndex(iconBarContainer, cragIndexContainer, cragViewContainer, topoEditContainer)
    iconBarContainer.icons.get('add').style = ''
    iconBarContainer.icons.get('updateImage').style = ''
    iconBarContainer.icons.get('shiftLeft').style = ''
    iconBarContainer.icons.get('shiftRight').style = ''
    iconBarContainer.icons.get('edit').style = ''
    iconBarContainer.icons.get('close').style = ''
    window.scrollTo( 0, 0 )
    cragViewContainer.root.style = ''
  })
}

let OnEditTopo = (iconBarContainer, cragIndexContainer, cragViewContainer, topoEditContainer) => {
  cragViewContainer.root.style = 'display:none'
  iconBarContainer.icons.get('close').onclick = () => OnEditCrag(iconBarContainer, cragIndexContainer, cragViewContainer, topoEditContainer)
  topoEditContainer.container.Refresh(cragIndexContainer.container.selectedCrag,cragViewContainer.topoIndexContainer.selectedTopo)
  iconBarContainer.icons.get('add').style = 'display:none'
  iconBarContainer.icons.get('updateImage').style = 'display:none'
  iconBarContainer.icons.get('shiftLeft').style = 'display:none'
  iconBarContainer.icons.get('shiftRight').style = 'display:none'
  iconBarContainer.icons.get('edit').style = 'display:none'
  window.scrollTo( 0, 0 )
  topoEditContainer.root.style = ''
}

let OnSave = (cragIndexContainer) => {
  cragIndexContainer.container.Save()
}

let OnPublishUserUpdates = () => {
  fetch(`${Config.publish_user_updates_url}?user_id=${_cookie.GetValue("user-id")}&user_token=${_cookie.GetValue("user-token")}`)
  .then( responseData => responseData.json() )
  .then( response => {
    if( response.error ) {
      console.log(response.error)
      return
    }
    console.log('published!')
  })
  .catch( err => console.log(err) )
}

let OnDiscardUserUpdates = () => {
  fetch(`${Config.delete_user_updates_url}?user_id=${_cookie.GetValue("user-id")}&user_token=${_cookie.GetValue("user-token")}`)
  .then( responseData => responseData.json() )
  .then( response => {
    if( response.error ) {
      console.log(response.error)
      return
    }
    console.log('Discarded!')
  })
  .catch( err => console.log(err) )
}

let CreateIconBarContainer = () => {
  const element = document.createElement('div')
  element.id = 'icon-bar-container'
  element.classList.add('icon-bar-container')

  const icons = new Map()

  icons.set('add',element.appendChild(CreateIcon('icon-add','add','fa','fa-plus-square')))
  icons.set('updateImage',element.appendChild(CreateIcon('icon-update-image','update image','fa','fa-file-upload')))
  icons.set('shiftLeft',element.appendChild(CreateIcon('icon-shift-left','shift left','fas','fa-arrow-left')))
  icons.set('shiftRight',element.appendChild(CreateIcon('icon-shift-right','shift right','fas','fa-arrow-right')))
  icons.set('edit',element.appendChild(CreateIcon('icon-edit','edit','fas','fa-edit')))
  icons.set('save',element.appendChild(CreateIcon('icon-save','save','fas','fa-save')))
  icons.set('publish',element.appendChild(CreateIcon('icon-publish','publish','fa','fa-book')))
  icons.set('discard',element.appendChild(CreateIcon('icon-discard','discard','fa','fa-trash')))
  icons.set('close',element.appendChild(CreateIcon('icon-close','close','far','fa-window-close')))

  return {root:element,icons:icons}
}

let CreateIcon = (id,title,...classes) => {
  const icon = document.createElement('i')
  icon.id = id
  icon.title = title
  classes.forEach( cls => icon.classList.add(cls) )
  return icon
}

let CreateCragIndexContainer = () => {
  const element = document.createElement('div')
  element.id = 'crag-index-container'

  const statusBarContainer = document.createElement('div')
  statusBarContainer.classList.add('crag-view-header')
  statusBarContainer.style = 'display:none'

  const status = document.createElement('input')
  status.id = 'status'
  status.classList.add('status-bar')
  status.type = 'text'
  status.name = 'name'
  status.size = 20
  status.readOnly = true

  statusBarContainer.appendChild(status)

  element.appendChild(statusBarContainer)

  const cragCoversContainer = document.createElement('div')
  cragCoversContainer.id = 'crag-covers-container'
  element.appendChild(cragCoversContainer)

  const cragIndexContainer = new CragIndexContainer(cragCoversContainer,DataStorage,ImageStorage)

  return {root:element,container:cragIndexContainer}
}

let CreateCragViewContainer = () => {
  const element = document.createElement('div')
  element.id = 'crag-view-container'
  element.style = 'display:none'

  const cragViewHeader = document.createElement('div')
  cragViewHeader.id = 'crag-view-header'
  cragViewHeader.classList.add('crag-view-header')

  const cragName = document.createElement('input')
  cragName.id = 'crag-name'
  cragName.classList.add('crag-name')

  cragViewHeader.appendChild(cragName)

  element.appendChild(cragViewHeader)

  const topoImagesContainer = document.createElement('div')
  topoImagesContainer.id = 'topo-images-container'
  topoImagesContainer.classList.add('topo-images-container-edit')
  element.appendChild(topoImagesContainer)

  _topoMediaScroller = new TopoMediaScroller(topoImagesContainer)

  return {root:element,cragName:cragName,topoIndexContainer:_topoMediaScroller}
}

let CreateTopoEditContainer = () => {
  const element = document.createElement('div')
  element.id = 'topo-edit-container'
  const topoEditContainer = new TopoEditContainer(element)
  return {root:element,container:topoEditContainer}
}
