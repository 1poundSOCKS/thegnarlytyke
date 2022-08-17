const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require('./objects/image-storage.cjs');
const PageHeader = require('./objects/page-header.cjs');
const CragIndexContainer = require('./objects/crag-index-container.cjs')
const Cookie = require('./objects/cookie.cjs')
const TopoMediaScroller = require('./objects/topo-media-scroller.cjs')
const TopoEditContainer = require('./objects/topo-edit-container.cjs');

let _cookie = null;
let _cragIndexContainer = null;
let _mainTopoImage = null;
let _topoEditContainer = null

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

  new PageHeader(document.getElementById('page-header-container'),'edit',_cookie,Config)

  DataStorage.Init(Config, _cookie.GetValue("user-id"), _cookie.GetValue("user-token"),true);
  ImageStorage.Init(Config, _cookie.GetValue("user-id"), _cookie.GetValue("user-token"));

  document.getElementById('icon-bar-container').style = ''
  
  _cragCoverImage = document.getElementById('crag-cover-image')
  _topoEditContainer = new TopoEditContainer(document.getElementById('topo-edit-container'))

  _topoMediaScroller = new TopoMediaScroller(document.getElementById('topo-images-container'))
  _topoMediaScroller.topoImage = _mainTopoImage

  _cragIndexContainer = new CragIndexContainer(document.getElementById('crag-covers-container'),DataStorage,ImageStorage)
  _cragIndexContainer.cragNameElement = document.getElementById("crag-name")
  _cragIndexContainer.topoMediaScroller = _topoMediaScroller
  _cragIndexContainer.Load(SelectCragCoverContainer)

  OnEditIndex()
  document.getElementById('icon-save').onclick = () => OnSave()
}

let SelectCragCoverContainer = cragCoverContainer => {
}

let OnEditIndex = () => {
  document.getElementById('crag-view-container').style = 'display:none'
  _topoEditContainer.Hide()
  _cragIndexContainer.RefreshSelectedContainer()
  document.getElementById('icon-add').onclick = () => _cragIndexContainer.AddNewCrag()
  document.getElementById('icon-update-image').onclick = () => _cragIndexContainer.UpdateSelectedImage()
  document.getElementById('icon-shift-left').onclick = () => _cragIndexContainer.ShiftCragLeft()
  document.getElementById('icon-shift-right').onclick = () => _cragIndexContainer.ShiftCragRight()
  document.getElementById('icon-edit').onclick = () => OnEditCrag()
  document.getElementById('icon-publish').onclick = () => OnPublishUserUpdates()
  document.getElementById('crag-index-container').style = ''
}

let OnEditCrag = () => {
  _cragIndexContainer.ShowSelectedCrag()
  .then( (crag) => {
    if( !crag ) return
    document.getElementById('crag-index-container').style = 'display:none'
    _topoEditContainer.Hide()
    document.getElementById('icon-add').onclick = () => _topoMediaScroller.AddNew()
    document.getElementById('icon-update-image').onclick = () => _topoMediaScroller.UpdateSelectedImage()
    document.getElementById('icon-shift-left').onclick = () => _topoMediaScroller.ShiftSelectedLeft()
    document.getElementById('icon-shift-right').onclick = () => _topoMediaScroller.ShiftSelectedRight()
    document.getElementById('icon-edit').onclick = () => OnEditTopo()
    document.getElementById('icon-close').onclick = () => OnEditIndex()
    window.scrollTo( 0, 0 )
    document.getElementById('crag-view-container').style = ''
  })
}

let OnEditTopo = () => {
  document.getElementById('crag-view-container').style = 'display:none'
  document.getElementById('icon-close').onclick = () => OnEditCrag()
  _topoEditContainer.Refresh(_cragIndexContainer.selectedCrag,_topoMediaScroller.selectedTopo)
  window.scrollTo( 0, 0 )
  _topoEditContainer.Unhide()
  document.getElementById('topo-edit-container').style = ''
}

let OnSave = () => {
  _cragIndexContainer.Save()
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
