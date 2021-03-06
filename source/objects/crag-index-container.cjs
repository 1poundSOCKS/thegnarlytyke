const CragIndex = require('./crag-index.cjs');
const CragCoverContainer = require("./crag-cover-container.cjs");
const TopoMediaScroller = require('./topo-media-scroller.cjs')
const CragRouteTable = require('./crag-route-table.cjs')

let CragIndexContainer = function(element,dataStorage,imageStorage) {
  this.element = element
  this.dataStorage = dataStorage
  this.imageStorage = imageStorage
  this.cragCoverContainers = []
  this.cragIndex = new CragIndex()
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

CragIndexContainer.prototype.AppendCrag = function(cragCover,OnCragSelectedHandler) {
  const cragCoverContainer = new CragCoverContainer(cragCover);
  this.element.appendChild(cragCoverContainer.element);
  
  this.cragCoverContainers.push(cragCoverContainer)
  this.AddSelectionHandler(cragCoverContainer,OnCragSelectedHandler)
  cragCoverContainer.LoadImage(this.imageStorage)
  return cragCoverContainer
}

CragIndexContainer.prototype.AddSelectionHandler = function(cragCoverContainer,OnCragSelectedHandler) {
  cragCoverContainer.element.onclick = () => {
    this.Unselect()
    cragCoverContainer.element.classList.add('selected')
    this.selectedContainer = cragCoverContainer;
    OnCragSelectedHandler(this.selectedContainer);
  }
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

CragIndexContainer.prototype.AddNewCrag = async function(imageFile,OnCragSelectedHandler) {
  const cragIndexEntry = this.cragIndex.AppendCrag('')
  const cragCoverContainer = new CragCoverContainer(cragIndexEntry)
  this.cragCoverContainers.push(cragCoverContainer)
  this.element.appendChild(cragCoverContainer.element)
  await cragCoverContainer.UpdateImage(imageFile)
  this.AddSelectionHandler(cragCoverContainer,OnCragSelectedHandler)
}

CragIndexContainer.prototype.UpdateSelectedImage = async function(imageFile) {
  if( this.selectedContainer ) this.selectedContainer.UpdateImage(imageFile)
}

CragIndexContainer.prototype.EditSelectedCrag = async function(topoImagesContainerElement,cragRouteTableElement) {
  const crag = await this.selectedContainer.LoadCrag(this.dataStorage)
  document.getElementById("crag-name").innerText = crag.name
  const topoMediaScroller = new TopoMediaScroller(topoImagesContainerElement, crag, false, this.OnTopoSelected)
  topoMediaScroller.LoadTopoImages(this.imageStorage,true)
  _cragRouteTable = new CragRouteTable(cragRouteTableElement, crag, null, this.OnCragRouteToggled);
}

CragIndexContainer.prototype.OnTopoSelected = function() {
  
}

CragIndexContainer.prototype.OnCragRouteToggled = function() {
  
}

module.exports = CragIndexContainer;
