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
  let cragElement = document.createElement('div');
  cragElement.classList.add("crag-cover-container")
  cragElement.setAttribute('data-id', crag.id);

  let cragHeader = document.createElement('h3');
  cragHeader.classList.add("crag-cover-header");
  cragHeader.innerText = crag.name;
  cragElement.appendChild(cragHeader)

  if( crag.imageLoader ) {
    const cragCanvas = document.createElement('canvas');
    cragElement.appendChild(cragCanvas);
    crag.imageLoader.then( image => {
      cragCanvas.width = image.width;
      cragCanvas.height = image.height;
      const ctx = cragCanvas.getContext("2d");
      ctx.drawImage(image,0, 0);
    })
    cragElement.onclick = () => {
      this.selectedHeader = cragHeader;
      this.selectedCanvas = cragCanvas;
      this.selectedCrag = crag;
      this.OnCragSelectedHandler();
    }
  }
  else if( crag.imageFile ) {
    const cragImage = document.createElement('img');
    cragImage.setAttribute('src',`${this.imagesURL}${crag.imageFile}`)
    cragImage.setAttribute('alt',crag.name);
    cragElement.appendChild(cragImage);
  }
  else {
    const cragCanvas = document.createElement('canvas');
    cragElement.appendChild(cragCanvas);
    cragElement.onclick = () => {
      this.selectedHeader = cragHeader;
      this.selectedCanvas = cragCanvas;
      this.selectedCrag = crag;
      this.OnCragSelectedHandler();
    }
   }

   this.element.appendChild(cragElement);
}

CragMediaScroller.prototype.RefreshSelectedContainer = function() {
  if( !this.selectedHeader || !this.selectedCrag ) return;
  this.selectedHeader.innerText = this.selectedCrag.name;
}

module.exports = CragMediaScroller;
