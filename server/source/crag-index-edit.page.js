const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require('./objects/image-storage.cjs');
const CragIndex = require('./objects/crag-index.cjs');
const CragMediaScroller = require('./objects/crag_media_scroller.cjs');
const ImageFileCompressor = require('./objects/image-file-compressor.cjs');

let _cragIndex = null;
let _cragMediaScroller = null;

window.onload = () => {
  Config.Load().then( () => OnConfigLoad() );
}

let OnConfigLoad = async () => {
  DataStorage.Init(Config);
  ImageStorage.Init(Config);
  _cragIndex = new CragIndex(Config);
  const cragIndexData = await _cragIndex.Load(DataStorage, ImageStorage);
  _cragMediaScroller = new CragMediaScroller(document.getElementById('crag-covers-container'), Config.images_url, cragIndexData.crags, OnCragSelected)
  document.getElementById('image-file').onchange = OnUploadImageFile;
  document.getElementById("crag-name").onchange = OnCragNameChanged;
}

let OnCragSelected = () => {
  document.getElementById("crag-name").value = _cragMediaScroller.selectedCrag.name;
}

let OnCragNameChanged = () => {
  if( _cragMediaScroller.selectedCrag ) _cragMediaScroller.selectedCrag.name = document.getElementById("crag-name").value;
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
  _cragIndex.Save(DataStorage, ImageStorage);
}
