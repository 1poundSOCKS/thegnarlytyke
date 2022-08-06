const CragIndex = require('./crag-index.cjs');
const CragCoverContainer = require("./crag-cover-container.cjs");
const FileSelector = require('./file-selector.cjs');

let CragIndexContainer = function(parentElement,dataStorage,imageStorage) {
  this.element = document.createElement('div')
  this.element.classList.add('crag-covers-container')
  parentElement.appendChild(this.element)
  this.dataStorage = dataStorage
  this.imageStorage = imageStorage
  this.cragCoverContainers = []
  this.cragIndex = new CragIndex()
  this.topoMediaScroller = null
  this.fileSelector = new FileSelector(this.element)
}

CragIndexContainer.prototype.Load = function(OnCragSelectedHandler) {
  this.cragIndex.Load(this.dataStorage,this.imageStorage)
  .then( () => {
    this.cragIndex.data.crags.forEach( cragDetails => {
      this.AppendCrag(cragDetails,OnCragSelectedHandler);
    })
  })
}

CragIndexContainer.prototype.Save = async function() {
  const imageSaves = this.cragCoverContainers
  .map( container => container.SaveCrag(this.dataStorage,this.imageStorage))
  .filter( saveResponse => saveResponse )
  await Promise.all(imageSaves)
  this.cragIndex.Save(this.dataStorage,this.imageStorage)
}

CragIndexContainer.prototype.UpdateImage = function(cragCovercontainer) {
  this.fileSelector.SelectFile( file => cragCovercontainer.UpdateImage(file))
}

CragIndexContainer.prototype.UpdateSelectedImage = function() {
  if( !this.selectedContainer ) return
  this.UpdateImage(this.selectedContainer)
}

CragIndexContainer.prototype.AppendCrag = function(cragDetails,OnCragSelectedHandler) {
  const cragCoverContainer = new CragCoverContainer(cragDetails);
  this.element.appendChild(cragCoverContainer.element);
  this.cragCoverContainers.push(cragCoverContainer)
  this.AddSelectionHandler(cragCoverContainer,OnCragSelectedHandler)
  cragCoverContainer.LoadImage(this.imageStorage)
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
  this.ShowSelectedCrag()
  if( OnCragSelectedHandler ) OnCragSelectedHandler(this.selectedContainer);
}

CragIndexContainer.prototype.RefreshSelectedContainer = function() {
  if( this.selectedContainer ) this.selectedContainer.Refresh();
}

CragIndexContainer.prototype.Unselect = function() {
  this.cragCoverContainers.forEach( cragCoverContainer => {
    cragCoverContainer.element.classList.remove('selected')
  })
  this.selectedContainer = null;
}

CragIndexContainer.prototype.AddNewCrag = async function(OnCragSelectedHandler) {
  const cragIndexEntry = this.cragIndex.AppendCrag('')
  const cragCoverContainer = new CragCoverContainer(cragIndexEntry)
  this.cragCoverContainers.push(cragCoverContainer)
  this.UpdateImage(cragCoverContainer)
  this.element.appendChild(cragCoverContainer.element)
  this.AddSelectionHandler(cragCoverContainer,OnCragSelectedHandler)
}

CragIndexContainer.prototype.ShowSelectedCrag = async function() {
  if( !this.selectedContainer ) return null
  const crag = await this.selectedContainer.LoadCrag(this.dataStorage)
  if( this.cragNameElement ) this.cragNameElement.innerText = crag.name
  this.topoMediaScroller.Refresh(crag,this.imageStorage,true)
  return crag
}

CragIndexContainer.prototype.OnTopoSelected = function() {
  
}

CragIndexContainer.prototype.OnCragRouteToggled = function() {
  
}

module.exports = CragIndexContainer;
