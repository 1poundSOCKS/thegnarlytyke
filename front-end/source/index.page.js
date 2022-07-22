const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require('./objects/image-storage.cjs');
const CragIndex = require('./objects/crag-index.cjs');
const PageHeader = require('./objects/page-header.cjs')
const CragCoverContainer = require('./objects/crag-cover-container.cjs');
const Cookie = require('./objects/cookie.cjs')

let _pageHeader = null;

window.onload = () => {
  Config.Load().then( () => OnConfigLoad() );
}

let OnConfigLoad = async () => {
  const cookie = new Cookie();
  const loggedOn = cookie.IsUserLoggedOn();
  
  _pageHeader = new PageHeader(document.getElementById("page-header"));

  if( Config.mode === "edit" && loggedOn ) {
    const icon = _pageHeader.AddIcon("fa-edit","Edit");
    icon.onclick = () => {
      window.location.href = "crag-index-edit.html";
    }
  }

  if( !loggedOn ) _pageHeader.AddLogonIcon();

  document.getElementById('crag-name').innerText = "crag index";

  DataStorage.Init(Config);
  ImageStorage.Init(Config);
  const cragIndex = new CragIndex();
  await cragIndex.Load(DataStorage,ImageStorage);
  const parentElement = document.getElementById('crag-covers-container');
  cragIndex.data.crags.forEach( crag => {
    AppendCrag(crag, parentElement);
  })
}

let AppendCrag = (crag, parentElement) => {
  const cragCover = new CragCoverContainer(crag, Config.images_url);
  parentElement.appendChild(cragCover.element);
  cragCover.element.setAttribute('onclick',`window.location.href='crag-view.html?id=${crag.id}'`);
}
