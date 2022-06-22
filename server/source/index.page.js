const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require('./objects/image-storage.cjs');
const CragIndex = require('./objects/crag-index.cjs');
const CragCoverContainer = require('./objects/crag-cover-container.cjs');

window.onload = () => {
  Config.Load().then( () => OnConfigLoad() );
}

let OnConfigLoad = async () => {
  DataStorage.Init(Config);
  ImageStorage.Init(Config);
  const cragIndex = new CragIndex();
  await cragIndex.Load(DataStorage,ImageStorage);
  const parentElement = document.getElementById('crag-covers-container');
  cragIndex.data.crags.forEach( crag => {
    AppendCrag(crag, parentElement);
  })

  if( Config.mode === "edit" ) {
    document.getElementById('edit-crag-index-address').setAttribute('href', `./crag-index-edit.html`);
    document.getElementById('crag-index-icon-bar').classList.remove('do-not-display');
  }
}

let AppendCrag = (crag, parentElement) => {
  const cragCover = new CragCoverContainer(crag, Config.images_url);
  parentElement.appendChild(cragCover.element);
  cragCover.element.setAttribute('onclick',`window.location.href='crag-view.html?id=${crag.id}'`);
}
