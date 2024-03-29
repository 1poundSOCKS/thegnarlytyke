const ImageFileCompressor = require('./image-file-compressor.cjs');
const Crag = require('./crag.cjs');

let CragCoverContainer = function(cragDetails,newCrag) {
  this.newCrag = newCrag
  this.id = cragDetails.id
  this.element = document.createElement('div');
  this.element.dataset.id = this.id;
  this.element.classList.add("crag-cover-container")
  this.cragDetails = cragDetails
  this.canvas = document.createElement('canvas');
  this.canvas.classList.add("crag-cover-image");
  this.element.appendChild(this.canvas);
}

CragCoverContainer.prototype.LoadCrag = function(dataStorage) {
  return new Promise( (accept,reject) => {
     //crag already loaded
    if( this.crag ) {
      accept(this.crag)
      return
    }
    // crag added but not previously saved
    if( this.newCrag ) {
      this.crag = new Crag()
      accept(this.crag)
      return
    }
    let cragKey = this.cragDetails.cragKey
    if( !cragKey ) cragKey = `${this.cragDetails.id}.crag`
    this.crag = new Crag()
    this.crag.SafeLoad(cragKey,dataStorage,this.cragDetails.id,this.cragDetails.name)
    .then( () => {
      accept(this.crag)
    })
    .catch( () => reject() )
  })
}

CragCoverContainer.prototype.SaveCrag = function (dataStorage,imageStorage) {
  return new Promise( (accept,reject) => {
    this.SaveImage(imageStorage)
    .then( () => {
      if( !this.crag ) {
        accept()
        return
      }
      this.crag.Save(dataStorage,imageStorage)
      .then( key => {
        this.cragDetails.cragKey = key
        accept()
      })
      .catch( err => reject(err) )
    })
    .catch( (err) => reject(err) )
  })
}

CragCoverContainer.prototype.UpdateImage = async function(imageFile) {
  const compressor = new ImageFileCompressor(this.canvas)
  this.image = await compressor.LoadAndCompress(imageFile)
  this.imageData = compressor.compressedImageData
  this.Refresh()
}

CragCoverContainer.prototype.LoadImage = async function(imageStorage) {
  if( !this.cragDetails.imageFile ) return
  this.image = await imageStorage.LoadImageFromFile(this.cragDetails.imageFile)
  this.Refresh()
  return this.image
}

CragCoverContainer.prototype.SaveImage = async function(imageStorage) {
  if( !this.imageData ) return null
  const saveResponse = await imageStorage.SaveImage(this.cragDetails.id,this.imageData,'crag')
  if( saveResponse.filename ) this.cragDetails.imageFile = saveResponse.filename
  return saveResponse
}

CragCoverContainer.prototype.Refresh = function() {
  if( this.crag ) this.cragDetails.name = this.crag.name
  
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
