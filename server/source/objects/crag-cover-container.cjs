let CragCoverContainer = function(crag, imageURL) {
  this.crag = crag;
  this.imageURL = imageURL;

  this.element = document.createElement('div');
  this.element.classList.add("crag-cover-container")
  this.element.setAttribute('data-id', crag.id);

  this.header = document.createElement('h3');
  this.header.classList.add("crag-cover-header");
  this.header.innerText = crag.name;
  this.element.appendChild(this.header)

  if( crag.imageLoader ) {
    this.canvas = document.createElement('canvas');
    this.element.appendChild(this.canvas);
    crag.imageLoader.then( image => {
      this.canvas.width = image.width;
      this.canvas.height = image.height;
      const ctx = this.canvas.getContext("2d");
      ctx.drawImage(image,0, 0);
    })
  }
  else if( crag.imageFile ) {
    this.image = document.createElement('img');
    this.image.setAttribute('src',`${this.imageURL}${crag.imageFile}`)
    this.image.setAttribute('alt',crag.name);
    this.element.appendChild(this.image);
  }
  else {
    this.canvas = document.createElement('canvas');
    this.element.appendChild(this.canvas);
   }
}

module.exports = CragCoverContainer;