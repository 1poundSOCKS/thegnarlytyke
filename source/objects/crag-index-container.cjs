const CragIndex = require('./crag-index.cjs');
const CragCoverContainer = require("./crag-cover-container.cjs");
const FileSelector = require('./file-selector.cjs');

let CragIndexContainer = function(parentElement,dataStorage,imageStorage) {
  this.element = document.createElement('div')
  this.element.classList.add('crag-covers-container')
  parentElement.appendChild(this.element)
  this.dataStorage = dataStorage
  this.imageStorage = imageStorage
  this.cragCoverContainers = new Map()
  this.cragIndex = new CragIndex()
  this.topoMediaScroller = null
  this.fileSelector = new FileSelector(this.element)
}

CragIndexContainer.prototype.Load = function(OnCragSelectedHandler) {
  return new Promise( accept => {
    this.cragIndex.Load(this.dataStorage,this.imageStorage)
    .then( async () => {
      this.data = this.cragIndex.data.crags
      const containers = this.cragIndex.data.crags?.map( cragDetails => {
        return this.AppendCrag(cragDetails,OnCragSelectedHandler);
      })
      await Promise.all(containers)
      accept()
    })
  })
}

CragIndexContainer.prototype.Save = async function() {
  console.log(`saving crags...`)
  const cragImageSaves = Array.from(this.cragCoverContainers.values())
  .map( container => container.SaveCrag(this.dataStorage,this.imageStorage))
  .filter( saveResponse => saveResponse )
  await Promise.all(cragImageSaves)
  console.log(`images saved, saving crag index...`)
  await this.cragIndex.Save(this.dataStorage,this.imageStorage)
  console.log(`all saved!!!`)
}

CragIndexContainer.prototype.AddUserSelectionHandler = function(userSelectionHandler) {
  this.userSelectionHandler = userSelectionHandler
}

CragIndexContainer.prototype.UpdateImage = function(cragCovercontainer) {
  this.fileSelector.SelectFile( file => cragCovercontainer.UpdateImage(file))
}

CragIndexContainer.prototype.UpdateSelectedImage = function() {
  if( !this.selectedContainer ) return
  this.UpdateImage(this.selectedContainer)
}

CragIndexContainer.prototype.AppendCrag = async function(cragDetails,OnCragSelectedHandler) {
  const cragCoverContainer = new CragCoverContainer(cragDetails);
  this.element.appendChild(cragCoverContainer.element);
  this.cragCoverContainers.set(cragCoverContainer.id,cragCoverContainer)
  this.AddSelectionHandler(cragCoverContainer,OnCragSelectedHandler)
  await cragCoverContainer.LoadImage(this.imageStorage)
  return cragCoverContainer
}

CragIndexContainer.prototype.AddSelectionHandler = function(cragCoverContainer,OnCragSelectedHandler) {
  cragCoverContainer.element.onclick = async () => {
    this.SelectContainer(cragCoverContainer,OnCragSelectedHandler)
  }
}

CragIndexContainer.prototype.SelectContainer = function(cragCoverContainer,OnCragSelectedHandler) {
  this.Unselect()
  cragCoverContainer.element.classList.add('selected')
  this.selectedContainer = cragCoverContainer;
  if( OnCragSelectedHandler ) OnCragSelectedHandler();
  if( this.userSelectionHandler ) this.userSelectionHandler(cragCoverContainer)
}

CragIndexContainer.prototype.RefreshSelectedContainer = function() {
  if( this.selectedContainer ) this.selectedContainer.Refresh();
}

CragIndexContainer.prototype.Unselect = function() {
  this.GetContainers().forEach( cragCoverContainer => {
    cragCoverContainer.classList.remove('selected')
  })
  this.selectedContainer = null;
}

CragIndexContainer.prototype.AddNewCrag = async function(OnCragSelectedHandler) {
  const cragIndexEntry = this.cragIndex.AppendCrag('')
  const cragCoverContainer = new CragCoverContainer(cragIndexEntry,true)
  this.cragCoverContainers.set(cragCoverContainer.id,cragCoverContainer)
  this.UpdateImage(cragCoverContainer)
  this.element.appendChild(cragCoverContainer.element)
  this.AddSelectionHandler(cragCoverContainer,OnCragSelectedHandler)
}

CragIndexContainer.prototype.LoadSelectedCrag = async function() {
  this.selectedCrag = await this.selectedContainer?.LoadCrag(this.dataStorage)
  return this.selectedCrag
}

CragIndexContainer.prototype.ShiftCragLeft = function() {
  if( !this.selectedContainer ) return
  this.selectedContainer.ShiftLeft()
  this.RefreshData()
}

CragIndexContainer.prototype.ShiftCragRight = function() {
  if( !this.selectedContainer ) return
  this.selectedContainer.ShiftRight()
  this.RefreshData()
}

CragIndexContainer.prototype.RefreshData = function() {
  const cragContainers = this.GetContainers()
  this.data.length = 0
  cragContainers.forEach( crag => {
    this.data.push(this.cragCoverContainers.get(crag.dataset.id).cragDetails)
  })
}

CragIndexContainer.prototype.GetContainers = function() {
  return Array.from(this.element.childNodes)
  .filter( element => element.dataset.id )
}

CragIndexContainer.prototype.OnTopoSelected = function() {
  
}

CragIndexContainer.prototype.OnCragRouteToggled = function() {
  
}

module.exports = CragIndexContainer;
