const ImageFileCompressor = require('./image-file-compressor.cjs');
const CragStorage = require('./crag-storage.cjs');
const Crag = require('./crag.cjs');

let CragCoverContainer = function(cragIndexEntry, imageURL) {
  this.cragIndexEntry = cragIndexEntry;
  this.imageURL = imageURL;

  this.element = document.createElement('div');
  this.element.classList.add("crag-cover-container")
  this.element.setAttribute('data-id', this.cragIndexEntry.id);

  if( this.cragIndexEntry.imageLoader ) {
    this.canvas = document.createElement('canvas');
    this.canvas.classList.add("crag-cover-image");
    this.element.appendChild(this.canvas);
    this.cragIndexEntry.imageLoader.then( image => {
      this.image = image;
      this.Refresh();
     })
  }
  else {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 666;
    this.canvas.height = 500;
    this.canvas.classList.add("crag-cover-image");
    this.element.appendChild(this.canvas);
   }
}

CragCoverContainer.prototype.LoadCrag = async function(config) {
  try {
    const cragStorage = new CragStorage('client', config);
    this.crag = new Crag(await cragStorage.Load(this.cragIndexEntry.id));
  }
  catch ( err ) {
    this.crag = new Crag({id:this.cragIndexEntry.id});
  }

  return this.crag
}

CragCoverContainer.prototype.LoadImageFromFile = async function(file) {
  const ifc = new ImageFileCompressor(this.canvas);
  this.cragIndexEntry.imageLoader = await ifc.LoadAndCompress(file);
  this.image = await this.crag.imageLoader;
  this.Refresh();
}

CragCoverContainer.prototype.LoadImage = (url) => new Promise( (resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = (err) => reject(err);
  img.src = url;
});

CragCoverContainer.prototype.UpdateImage = function(image, data) {
  console.table(this.cragIndexEntry)
  this.image = image
  this.cragIndexEntry.imageData = data
  this.Refresh()
}

CragCoverContainer.prototype.Refresh = function() {
  const ctx = this.canvas.getContext("2d");

  if( this.image ) {
    this.canvas.width = this.image.width;
    this.canvas.height = this.image.height;
    ctx.drawImage(this.image,0, 0);  
  }
  else {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  const fontSize = 3;
  ctx.font = `bold ${fontSize}rem six caps`;
  const metrics = ctx.measureText(this.cragIndexEntry.name);
  let widthOfText = metrics.width;
  const xPosOfText = ctx.canvas.width /  2 - widthOfText / 2;
  ctx.fillStyle = 'rgba(225,225,225,0.6)';
  ctx.fillRect(0,0,ctx.canvas.width,60);
  ctx.fillStyle = "rgb(30,30,30)";
  ctx.fillText(this.cragIndexEntry.name, xPosOfText, 50);
}

CragCoverContainer.prototype.CopyImageToCanvas = function(destCanvas) {
  destCanvas.width = this.canvas.width
  destCanvas.height = this.canvas.height
  var ctx = destCanvas.getContext('2d')
  ctx.drawImage(this.image,0,0)
}

module.exports = CragCoverContainer;
