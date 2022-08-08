const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require('./objects/image-storage.cjs');
const PageHeaderNav = require('./objects/page-header-nav.cjs')
const CragIndexContainer = require('./objects/crag-index-container.cjs')
const Cookie = require('./objects/cookie.cjs')
const TopoImage = require('./objects/topo-image.cjs');
const TopoMediaScroller = require('./objects/topo-media-scroller.cjs');

let _cookie = null;
let _cragIndexContainer = null;
let _mainTopoImage = null;

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

  new PageHeaderNav(document.getElementById('page-header-nav'),'edit',_cookie,Config.mode == "edit");

  DataStorage.Init(Config, _cookie.GetValue("user-id"), _cookie.GetValue("user-token"),true);
  ImageStorage.Init(Config, _cookie.GetValue("user-id"), _cookie.GetValue("user-token"));
  
  _cragCoverImage = document.getElementById('crag-cover-image')
  _mainTopoImage = new TopoImage(document.getElementById('topo-image-edit'), true);

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
  document.getElementById('topo-edit-container').style = 'display:none'
  _cragIndexContainer.RefreshSelectedContainer()
  document.getElementById('icon-add').onclick = () => _cragIndexContainer.AddNewCrag()
  document.getElementById('icon-update-image').onclick = () => _cragIndexContainer.UpdateSelectedImage()
  document.getElementById('icon-shift-left').onclick = () => _cragIndexContainer.ShiftCragLeft()
  document.getElementById('icon-shift-right').onclick = () => _cragIndexContainer.ShiftCragRight()
  document.getElementById('icon-edit').onclick = () => OnEditCrag()
  document.getElementById('crag-index-container').style = ''
}

let OnEditCrag = () => {
  _cragIndexContainer.ShowSelectedCrag()
  .then( (crag) => {
    if( !crag ) return
    document.getElementById('crag-index-container').style = 'display:none'
    document.getElementById('topo-edit-container').style = 'display:none'
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
  window.scrollTo( 0, 0 )
  document.getElementById('topo-edit-container').style = ''
}

let OnSave = () => {
  _cragIndexContainer.Save()
}
