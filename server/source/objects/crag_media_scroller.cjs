let CragMediaScroller = function(element, imagesURL, crags, OnCragSelectedHandler) {
  this.element = element;
  this.imagesURL = imagesURL;
  this.crags = crags;
  this.OnCragSelectedHandler = OnCragSelectedHandler;
  this.crags.forEach( crag => {
    this.AppendCrag(crag);
  })
}

CragMediaScroller.prototype.AppendCrag = function(crag) {
  let cragElement = document.createElement('div');
  cragElement.classList.add("crag-cover-container")
  cragElement.setAttribute('data-id', crag.id);
  cragElement.onclick = () => this.OnCragSelectedHandler(crag.id);
  let cragHeader = document.createElement('h3');
  cragHeader.classList.add("crag-cover-header");
  cragHeader.innerText = crag.name;
  cragElement.appendChild(cragHeader)
  const cragImage = document.createElement('img');
  if( crag.imageFile ) {
    cragImage.setAttribute('src',`${this.imagesURL}${crag.imageFile}`)
  }
  cragImage.setAttribute('alt',crag.name);
  cragElement.appendChild(cragImage);
  this.element.appendChild(cragElement);
}

module.exports = CragMediaScroller;
