const CragIndex = require('./crag-index.cjs');
const CragCoverContainer = require("./crag-cover-container.cjs");

let CragIndexContainer = function(element,dataStorage,imageStorage) {
  this.element = element
  this.dataStorage = dataStorage
  this.imageStorage = imageStorage
  this.cragCoverContainers = []
}

CragIndexContainer.prototype.Load = async function(OnCragSelectedHandler) {
  this.cragIndex = new CragIndex()
  await this.cragIndex.Load(this.dataStorage,this.imageStorage)
  this.cragIndex.data.crags.forEach( cragIndexEntry => {
    this.AppendCrag(cragIndexEntry,OnCragSelectedHandler);
  })
}

CragIndexContainer.prototype.AppendCrag = function(crag,OnCragSelectedHandler) {
  const cragCoverContainer = new CragCoverContainer(crag, this.imageStorage.imagesPath);
  this.element.appendChild(cragCoverContainer.element);
  this.cragCoverContainers.push(cragCoverContainer)
  cragCoverContainer.element.onclick = () => {
    this.RemoveSelectedStyle()
    cragCoverContainer.element.classList.add('selected')
    this.selectedContainer = cragCoverContainer;
    OnCragSelectedHandler(this.selectedContainer);
  }
}

CragIndexContainer.prototype.RefreshSelectedContainer = function() {
  if( this.selectedContainer ) this.selectedContainer.Refresh();
}

CragIndexContainer.prototype.RemoveSelectedStyle = function() {
  this.cragCoverContainers.forEach( cragCoverContainer => {
    cragCoverContainer.element.classList.remove('selected')
  })
  this.selectedContainer = null;
}

module.exports = CragIndexContainer;
