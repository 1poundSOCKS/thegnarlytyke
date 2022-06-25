const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require('./objects/image-storage.cjs');
const CragIndex = require('./objects/crag-index.cjs');
const PageHeader = require('./objects/page-header.cjs')
const CragCoverContainer = require('./objects/crag-cover-container.cjs');

_pageHeader = null;

window.onload = () => {
  Config.Load().then( () => OnConfigLoad() );
}

let OnConfigLoad = async () => {
  _pageHeader = new PageHeader(document.getElementById("page-header"));

  DataStorage.Init(Config);
  ImageStorage.Init(Config);
  const cragIndex = new CragIndex();
  await cragIndex.Load(DataStorage,ImageStorage);
  const parentElement = document.getElementById('crag-covers-container');
  cragIndex.data.crags.forEach( crag => {
    AppendCrag(crag, parentElement);
  })

  if( Config.mode === "edit" ) {
    const icon = _pageHeader.AddIcon("fa-edit","Edit");
    icon.onclick = () => {
      window.location.href = "crag-index-edit.html";
    }
  }
  const icon = _pageHeader.AddIcon("fa-sign-in","Logon");

  document.getElementById('crag-name').innerText = "crag index";
}

let AppendCrag = (crag, parentElement) => {
  const cragCover = new CragCoverContainer(crag, Config.images_url);
  parentElement.appendChild(cragCover.element);
  cragCover.element.setAttribute('onclick',`window.location.href='crag-view.html?id=${crag.id}'`);
}
