const Config = require('./objects/config.cjs');
const DataStorage = require('./objects/data-storage.cjs');
const ImageStorage = require('./objects/image-storage.cjs');
const Cookie = require('./objects/cookie.cjs')
const PageHeaderNav = require('./objects/page-header-nav.cjs')
const CragIndexContainer = require('./objects/crag-index-container.cjs')
const CragViewContainer = require('./objects/crag-view-container.cjs')

let _cragIndexContainer = null;
let _cragViewContainer = null

window.onload = () => {
  InitWindowStyle()
  Config.Load().then( () => OnConfigLoad() );
}

window.onresize = () => {
  InitWindowStyle()
}

let InitWindowStyle = () => {
  const cragCoversColumnCount = Math.max(1,~~(window.innerWidth / 400))
  document.documentElement.style.setProperty("--crag-covers-column-count", cragCoversColumnCount)
}

let OnConfigLoad = async () => {
  const cookie = new Cookie();
  
  new PageHeaderNav(document.getElementById('page-header-nav'),'home',cookie,Config.mode == "edit");
  
  DataStorage.Init(Config);
  ImageStorage.Init(Config);

  _cragViewContainer = new CragViewContainer(document.getElementById('main-topo-container'),ImageStorage)

  _cragIndexContainer = new CragIndexContainer(document.getElementById('crag-index-container'),DataStorage,ImageStorage)
  
  _cragIndexContainer.Load(() => {
    DisplayCragView()
  })

  document.getElementById('close-crag-view').onclick = () => {
    DisplayIndexView()
  }
}

let DisplayIndexView = () => {
  document.getElementById('crag-view-container').style = 'display:none'
  window.scrollTo( 0, 0 );
  _cragIndexContainer.Unselect();
  document.getElementById('crag-index-container').style = ''
}

let DisplayCragView = container => {
  document.getElementById('crag-index-container').style = 'display:none'
  _cragIndexContainer.selectedContainer.LoadCrag(DataStorage)
  .then( crag => _cragViewContainer.Refresh(crag) )
  .then( () => {
    window.scrollTo( 0, 0 );  
    document.getElementById('crag-view-container').style = ''
  })
}
