const CragIndex = require('./crag-index.cjs');
const CragCoverContainer = require("./crag-cover-container.cjs");

let CragIndexContainer = function(parentElement,dataStorage,imageStorage) {
  this.element = document.createElement('div')
  this.element.classList.add('crag-covers-container')
  parentElement.appendChild(this.element)
  this.dataStorage = dataStorage
  this.imageStorage = imageStorage
  this.cragCoverContainers = []
  this.cragIndex = new CragIndex()
  this.topoMediaScroller = null
  this.AddFileUpload()
}

CragIndexContainer.prototype.Load = async function(OnCragSelectedHandler) {
  await this.cragIndex.Load(this.dataStorage,this.imageStorage)
  this.cragIndex.data.crags.forEach( cragCover => {
    this.AppendCrag(cragCover,OnCragSelectedHandler);
  })
}

CragIndexContainer.prototype.Save = async function() {
  const imageSaves = this.cragCoverContainers
  .map( container => container.SaveImage(this.imageStorage))
  .filter( saveResponse => saveResponse )
  await Promise.all(imageSaves)
  this.cragIndex.Save(this.dataStorage,this.imageStorage)
}

CragIndexContainer.prototype.AddFileUpload = function() {
  const container = document.createElement('div')
  container.setAttribute('style','display:none')
  this.fileUpload = document.createElement('input')
  this.fileUpload.setAttribute('type','file')
  container.appendChild(this.fileUpload)
  this.element.appendChild(container)
}

CragIndexContainer.prototype.UpdateImage = function(cragCovercontainer) {
  if( !this.fileUpload ) return
  this.fileUpload.onchange = () => {
    console.log(this.fileUpload.files[0])
    cragCovercontainer.UpdateImage(this.fileUpload.files[0])
  }
  this.fileUpload.click()
}

CragIndexContainer.prototype.UpdateSelectedImage = function() {
  if( !this.selectedContainer ) return
  this.UpdateImage(this.selectedContainer)
}

CragIndexContainer.prototype.AppendCrag = function(cragCover,OnCragSelectedHandler) {
  const cragCoverContainer = new CragCoverContainer(cragCover);
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

CragIndexContainer.prototype.SelectContainer = async function(cragCoverContainer,OnCragSelectedHandler) {
  this.Unselect()
  cragCoverContainer.element.classList.add('selected')
  this.selectedContainer = cragCoverContainer;
  await this.ShowSelectedCrag()
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
  if( !this.topoMediaScroller ) return
  const crag = await this.selectedContainer.LoadCrag(this.dataStorage)
  this.topoMediaScroller.LoadTopoImages(crag,this.imageStorage,true)
}

CragIndexContainer.prototype.EditSelectedCrag = async function() {
  const crag = await this.selectedContainer.LoadCrag(this.dataStorage)
  document.getElementById("crag-name").innerText = crag.name
  this.topoMediaScroller.LoadTopoImages(crag,this.imageStorage,true)
}

CragIndexContainer.prototype.OnTopoSelected = function() {
  
}

CragIndexContainer.prototype.OnCragRouteToggled = function() {
  
}

module.exports = CragIndexContainer;
