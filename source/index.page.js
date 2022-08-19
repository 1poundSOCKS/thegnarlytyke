const Config = require('./objects/config.cjs')
const DataStorage = require('./objects/data-storage.cjs')
const ImageStorage = require('./objects/image-storage.cjs')
const Cookie = require('./objects/cookie.cjs')
const CreatePageHeader = require('./objects/page-header.cjs')
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
  
  const page = document.getElementById('page')
  page.appendChild(CreatePageHeader('home',cookie,Config))
  page.appendChild(CreateCragIndexContainer())
  page.appendChild(CreateCragViewContainer())
  page.appendChild(CreateTopoImagesContainer())
  
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

let CreateCragIndexContainer = () => {
  const element = document.createElement('div')
  element.id = 'crag-index-container'
  return element
}

let CreateCragViewContainer = () => {
  const element = document.createElement('div')
  element.id = 'crag-view-container'
  element.style = 'display:none'
  element.appendChild(CreateCragViewHeader())
  element.appendChild(CreateTopoImagesContainer())
  element.appendChild(CreateMainTopoContainer())
  return element
}

let CreateCragViewHeader = () => {
  const element = document.createElement('div')
  element.id = 'crag-view-header'
  element.classList.add('crag-view-header')
  const cragName = document.createElement('span')
  cragName.id = 'crag-name'
  cragName.classList.add('crag-name')
  element.appendChild(cragName)
  const closeIcon = document.createElement('i')
  closeIcon.id = 'close-crag-view'
  closeIcon.classList.add('close-crag-view-icon','far','fa-window-close')
  closeIcon.title = 'close'
  element.appendChild(closeIcon)
  return element
}

let CreateTopoImagesContainer = () => {
  const element = document.createElement('div')
  element.id = 'topo-images-container'
  element.classList.add('topo-images-container')
  return element
}

let CreateMainTopoContainer = () => {
  const element = document.createElement('div')
  element.id = 'main-topo-container'
  element.classList.add('main-topo-container')
  
  const imageContainer = document.createElement('div')
  imageContainer.classList.add('main-topo-image-container')
  
  const imageCanvas = document.createElement('canvas')
  imageCanvas.id = 'main-topo-image'
  imageCanvas.classList.add('main-topo-image')
  imageContainer.appendChild(imageCanvas)
  
  element.appendChild(imageContainer)
  
  const tableContainer = document.createElement('div')
  tableContainer.id = 'topo-route-table-container'
  tableContainer.classList.add('topo-route-table-container')
  element.appendChild(tableContainer)

  return element
}
