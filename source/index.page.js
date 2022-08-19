const Config = require('./objects/config.cjs')
const DataStorage = require('./objects/data-storage.cjs')
const ImageStorage = require('./objects/image-storage.cjs')
const Cookie = require('./objects/cookie.cjs')
const CreatePageHeader = require('./objects/page-header.cjs')
const CragIndexContainer = require('./objects/crag-index-container.cjs')
const CragViewContainer = require('./objects/crag-view-container.cjs')

let _cragIndexContainer = null;

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
  DataStorage.Init(Config);
  ImageStorage.Init(Config);

  const cragViewContainer = CragViewContainer.Create()

  const page = document.getElementById('page')
  page.appendChild(CreatePageHeader('home',cookie,Config))
  page.appendChild(CreateCragIndexContainer(cragViewContainer,DataStorage,ImageStorage))
  page.appendChild(cragViewContainer.root)

  cragViewContainer.topoMediaScroller.topoImage = cragViewContainer.topoImage
  cragViewContainer.topoMediaScroller.topoRouteTable = cragViewContainer.topoRouteTable
  cragViewContainer.topoMediaScroller.autoSelectOnRefresh = true

  _cragIndexContainer = new CragIndexContainer(document.getElementById('crag-index-container'),DataStorage,ImageStorage)
  _cragIndexContainer.Load(() => DisplayCragView(cragViewContainer))

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

let DisplayCragView = cragViewContainer => {
  document.getElementById('crag-index-container').style = 'display:none'
  _cragIndexContainer.selectedContainer.LoadCrag(DataStorage)
  .then( crag => CragViewContainer.Refresh(cragViewContainer,crag,ImageStorage) )
  .then( () => {
    window.scrollTo( 0, 0 );  
    document.getElementById('crag-view-container').style = ''
  })
}

let CreateCragIndexContainer = (refreshContainer,dataStorage,imageStorage) => {
  const div = document.createElement('div')
  div.id = 'crag-index-container'
  _cragIndexContainer = new CragIndexContainer(div,refreshContainer,dataStorage,imageStorage)
  return div
}
