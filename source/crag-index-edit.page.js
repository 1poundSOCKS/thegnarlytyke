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
  
  const topoMediaScroller = new TopoMediaScroller(document.getElementById('topo-images-container'),document.getElementById('update-topo-image'))

  _cragIndexContainer = new CragIndexContainer(document.getElementById('crag-covers-container'),DataStorage,ImageStorage)
  _cragIndexContainer.topoMediaScroller = topoMediaScroller
  _cragIndexContainer.Load(SelectCragCoverContainer)

  _cragCoverImage = document.getElementById('crag-cover-image')
  _mainTopoImage = new TopoImage(document.getElementById('topo-image-edit'), true);

  /* page event handlers */
  document.getElementById('add-crag').onclick = () => document.getElementById('add-crag-image-file').click()
  document.getElementById('add-crag-image-file').onchange = () => OnAddCrag()
  document.getElementById('update-crag-cover-image').onclick = () => document.getElementById('update-crag-image-file').click()
  document.getElementById('update-crag-image-file').onchange = () => OnUpdateCragImage()
  document.getElementById('edit-crag').onclick = () => OnEditCrag()
  document.getElementById('save').onclick = () => OnSave()
  document.getElementById("crag-name").onchange = OnCragNameChanged;
  document.getElementById('close-crag-view').onclick = () => {
    document.getElementById('crag-view-container').style = 'display:none'
    document.getElementById('crag-index-container').style = ''
  }
  document.getElementById('close-topo-view').onclick = () => {
    document.getElementById('topo-edit-container').style = 'display:none'
    document.getElementById('crag-view-container').style = ''
  }
}

let SelectCragCoverContainer = cragCoverContainer => {
}

let OnCragNameChanged = () => {
  if( _cragMediaScroller.selectedContainer ) _cragMediaScroller.selectedContainer.crag.name = document.getElementById("crag-name").value;
  _cragMediaScroller.RefreshSelectedContainer();
}

let OnAddCrag = async () => {
  const imageFiles = document.getElementById('add-crag-image-file')
  _cragIndexContainer.AddNewCrag(imageFiles.files[0],SelectCragCoverContainer)
}

let OnUpdateCragImage = async () => {
  const imageFiles = document.getElementById('update-crag-image-file')
  _cragIndexContainer.UpdateSelectedImage(imageFiles.files[0])
}

let OnEditCrag = async () => {
  document.getElementById('crag-index-container').style = 'display:none'
  await _cragIndexContainer.EditSelectedCrag()
  window.scrollTo( 0, 0 );
  document.getElementById('crag-view-container').style = ''
}

let OnSave = () => {
  _cragIndexContainer.Save()
}
