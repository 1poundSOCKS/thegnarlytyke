const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require('./objects/image-storage.cjs');
const CragIndex = require('./objects/crag-index.cjs');
const PageHeaderNav = require('./objects/page-header-nav.cjs')
// const PageHeader = require('./objects/page-header.cjs')
const CragMediaScroller = require('./objects/crag-media-scroller.cjs');
const Cookie = require('./objects/cookie.cjs')

let _cookie = null;
// let _pageHeader = null;
let _pageHeaderNav = null;
let _cragIndex = null;
let _cragMediaScroller = null;

window.onload = () => {
  Config.Load().then( () => OnConfigLoad() );
}

let OnConfigLoad = async () => {
  _cookie = new Cookie();

  _pageHeaderNav = new PageHeaderNav(document.getElementById('page-header-nav'),'edit',_cookie,Config.mode == "edit");

  DataStorage.Init(Config, _cookie.GetValue("user-id"), _cookie.GetValue("user-token"));
  ImageStorage.Init(Config, _cookie.GetValue("user-id"), _cookie.GetValue("user-token"));

  _cragIndex = new CragIndex(Config);
  const cragIndexData = await _cragIndex.LoadForUserEdit(DataStorage, ImageStorage);
  _cragMediaScroller = new CragMediaScroller(document.getElementById('crag-covers-container'), Config.images_url, cragIndexData.crags, OnCragSelected)
  document.getElementById('image-file').onchange = OnUploadImageFile;
  document.getElementById("crag-name").onchange = OnCragNameChanged;
}

let OnCragSelected = () => {
  document.getElementById("crag-name").value = _cragMediaScroller.selectedContainer.crag.name;
}

let OnCragNameChanged = () => {
  if( _cragMediaScroller.selectedContainer ) _cragMediaScroller.selectedContainer.crag.name = document.getElementById("crag-name").value;
  _cragMediaScroller.RefreshSelectedContainer();
}

module.exports = OnAddCrag = () => {
  const crag = _cragIndex.AppendCrag();
  _cragMediaScroller.AppendCrag(crag);
}

let OnUploadImageFile = async () => {
  const imageFileElement = document.getElementById('image-file');
  _cragMediaScroller.selectedContainer.LoadImageFromFile(imageFileElement.files[0]);
}

module.exports = OnSaveCragIndex = () => {
  document.getElementById("status").value = "Saving..."
  _cragIndex.Save(DataStorage, ImageStorage)
  .then( (response) => {
    document.getElementById("status").value = response.error ? "ERROR!" : "Success!"
  })
  .catch( (e) => {
    document.getElementById("status").value = "ERROR!"
  })
}
