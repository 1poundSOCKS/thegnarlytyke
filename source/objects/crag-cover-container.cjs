const ImageFileCompressor = require('./image-file-compressor.cjs');
const Crag = require('./crag.cjs');

let CragCoverContainer = function(cragDetails) {
  this.id = cragDetails.id
  this.element = document.createElement('div');
  this.element.dataset.id = this.id;
  this.element.classList.add("crag-cover-container")
  this.cragDetails = cragDetails
  this.canvas = document.createElement('canvas');
  this.canvas.classList.add("crag-cover-image");
  this.element.appendChild(this.canvas);
}

CragCoverContainer.prototype.Load = function(dataStorage) {
  return new Promise( (accept,reject) => {
    if( this.crag ) {
      accept(this.crag)
      return
    }
    this.crag = new Crag()
    this.crag.SafeLoad(this.cragDetails.id,dataStorage)
    .then( () => {
      accept(this.crag)
    })
    .catch( () => reject() )
  })
}

CragCoverContainer.prototype.Save = async function (dataStorage,imageStorage) {
  const imageSaveResponse = await this.SaveImage(imageStorage)
  if( imageSaveResponse == null ) return null
  return this.crag.Save(dataStorage)
}

CragCoverContainer.prototype.UpdateImage = async function(imageFile) {
  const compressor = new ImageFileCompressor(this.canvas)
  this.image = await compressor.LoadAndCompress(imageFile)
  this.imageData = compressor.compressedImageData
  this.Refresh()
}

CragCoverContainer.prototype.LoadImage = function(imageStorage) {
  if( !this.cragDetails.imageFile ) return
  imageStorage.LoadImageFromFile(this.cragDetails.imageFile)
  .then( image => {
    this.image = image
    this.Refresh()
  })
}

CragCoverContainer.prototype.SaveImage = async function(imageStorage) {
  if( !this.imageData ) return null
  const saveResponse = await imageStorage.SaveImage(this.cragDetails.id,this.imageData,'crag')
  if( saveResponse.filename ) this.cragDetails.imageFile = saveResponse.filename
  return saveResponse
}

CragCoverContainer.prototype.Refresh = function() {
  const ctx = this.canvas.getContext("2d");

  const image = this.image

  if( image ) {
    this.canvas.width = image.width;
    this.canvas.height = image.height;
    ctx.drawImage(image,0, 0);  
  }
  else {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  const fontSize = 3;
  ctx.font = `bold ${fontSize}rem six caps`;
  const metrics = ctx.measureText(this.cragDetails.name);
  let widthOfText = metrics.width;
  const xPosOfText = ctx.canvas.width /  2 - widthOfText / 2;
  ctx.fillStyle = 'rgba(225,225,225,0.6)';
  ctx.fillRect(0,0,ctx.canvas.width,60);
  ctx.fillStyle = "rgb(30,30,30)";
  ctx.fillText(this.cragDetails.name, xPosOfText, 50);
}

CragCoverContainer.prototype.CopyImageToCanvas = function(destCanvas) {
  destCanvas.width = this.canvas.width
  destCanvas.height = this.canvas.height
  var ctx = destCanvas.getContext('2d')
  ctx.drawImage(this.image,0,0)
}

CragCoverContainer.prototype.ShiftLeft = function() {
  const previousCrag = this.GetPreviousSibling()
  if( previousCrag == null ) return
  this.InsertBefore(previousCrag)
}

CragCoverContainer.prototype.ShiftRight = function() {
  const nextCrag = this.GetNextSibling()
  if( nextCrag == null ) return
  this.InsertAfter(nextCrag)
}

CragCoverContainer.prototype.GetPreviousSibling = function() {
  const previousCrags = []
  let element = this.element
  while( element.previousSibling ) {
    if( element.previousSibling.dataset.id ) previousCrags.push(element.previousSibling)
    element = element.previousSibling
  }
  if( previousCrags.length == 0 ) return null
  return previousCrags[0]
}

CragCoverContainer.prototype.GetNextSibling = function() {
  const subsequentCrags = []
  let element = this.element
  while( element.nextSibling ) {
    if( element.nextSibling.dataset.id ) subsequentCrags.push(element.nextSibling)
    element = element.nextSibling
  }
  if( subsequentCrags.length == 0 ) return null
  return subsequentCrags[0]
}

CragCoverContainer.prototype.InsertBefore = function(element) {
  this.element.parentElement.insertBefore(this.element,element)
}

CragCoverContainer.prototype.InsertAfter = function(element) {
  element.parentElement.insertBefore(element,this.element)
}

module.exports = CragCoverContainer;
