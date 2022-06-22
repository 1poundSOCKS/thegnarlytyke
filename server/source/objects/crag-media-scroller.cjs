const CragCoverContainer = require("./crag-cover-container.cjs");

let CragMediaScroller = function(element, imagesURL, crags, OnCragSelectedHandler) {
  this.element = element;
  this.imagesURL = imagesURL;
  this.crags = crags;
  this.OnCragSelectedHandler = OnCragSelectedHandler;
  this.crags.forEach( crag => {
    this.AppendCrag(crag);
  })
  this.selectedCanvas = null;
  this.selectedCrag = null;
}

CragMediaScroller.prototype.AppendCrag = function(crag) {
  const cragCover = new CragCoverContainer(crag, this.imagesURL);
  
  cragCover.element.onclick = () => {
    this.selectedHeader = cragCover.header;
    this.selectedCanvas = cragCover.canvas;
    this.selectedCrag = cragCover.crag;
    this.OnCragSelectedHandler();
  }

  this.element.appendChild(cragCover.element);
}

CragMediaScroller.prototype.RefreshSelectedContainer = function() {
  if( !this.selectedHeader || !this.selectedCrag ) return;
  this.selectedHeader.innerText = this.selectedCrag.name;
}

module.exports = CragMediaScroller;
