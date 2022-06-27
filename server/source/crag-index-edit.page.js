const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require('./objects/image-storage.cjs');
const CragIndex = require('./objects/crag-index.cjs');
const PageHeader = require('./objects/page-header.cjs')
const CragMediaScroller = require('./objects/crag-media-scroller.cjs');
const ImageFileCompressor = require('./objects/image-file-compressor.cjs');

let _pageHeader = null;
let _cragIndex = null;
let _cragMediaScroller = null;

window.onload = () => {
  Config.Load().then( () => OnConfigLoad() );
}

let OnConfigLoad = async () => {
  _pageHeader = new PageHeader(document.getElementById("page-header"));

  const plusIcon = _pageHeader.AddIcon("fa-plus","Add crag");
  plusIcon.onclick = () => OnAddCrag();

  const uploadIcon = _pageHeader.AddIcon("fa-file-arrow-up","Upload image");
  uploadIcon.onclick = () => document.getElementById('image-file').click();

  const saveIcon = _pageHeader.AddIcon("fa-save","Save");
  saveIcon.onclick = () => OnSaveCragIndex();

  const icon = _pageHeader.AddIcon("fa-sign-in","Logon");

  document.getElementById('page-subheader-text').innerText = "crag index editor";

  DataStorage.Init(Config);
  ImageStorage.Init(Config);
  _cragIndex = new CragIndex(Config);
  const cragIndexData = await _cragIndex.Load(DataStorage, ImageStorage);
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
  const ifc = new ImageFileCompressor(_cragMediaScroller.selectedCanvas);
  const imageData = await ifc.LoadAndCompress(imageFileElement.files[0]);
  _cragMediaScroller.selectedCrag.imageData = imageData;
}

module.exports = OnSaveCragIndex = () => {
  document.getElementById("status").value = "Saving..."
  _cragIndex.Save(DataStorage, ImageStorage)
  .then( () => {
    document.getElementById("status").value = "Success!"
  })
  .catch( () => {
    document.getElementById("status").value = "ERROR!"
  })
}
