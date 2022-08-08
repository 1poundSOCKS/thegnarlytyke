const ImageFileCompressor = require('./image-file-compressor.cjs')

const ImageContainer = function (parentElement,object,imageStorage) {
  this.parentElement = parentElement
  this.object = object
  this.imageStorage = imageStorage
  this.div = document.createElement('div')
  this.div.dataset.id = this.object.id
  this.canvas = document.createElement('canvas')
  this.div.appendChild(this.canvas)
  this.parentElement.appendChild(this.div)
  this.LoadImage()
}

ImageContainer.prototype.GetContext = function() { return this.canvas.getContext('2d') }

ImageContainer.prototype.LoadImage = function() {
  return new Promise( (accept,reject) => {
    if( !this.object.imageFile ) {
      accept(null)
      return
    }
    this.imageStorage.LoadImageFromFile(this.object.imageFile)
    .then( image => {
      this.object.image = image
      accept(image)
    })
    .catch( () => reject() )
  })
}

ImageContainer.prototype.SaveImage = function(type) {
  if( !this.object.imageData ) return
  this.object.imageSave = imageStorage.SaveImage(this.object.id,this.object.imageData,type)
  this.object.imageSave.then( (result) => {
    if( result.filename ) this.object.imageFile = result.filename
  })
  return this.object.imageSave
}

ImageContainer.prototype.Refresh = function() {
  console.log(`${this.object.image.width}, ${this.object.image.height}`)
  this.canvas.setAttribute('width', this.object.image.width)
  this.canvas.setAttribute('height', this.object.image.height)
  let ctx = this.canvas.getContext('2d')
  ctx.drawImage(this.object.image, 0, 0)
}

ImageContainer.prototype.Select = function() {
  this.div.classList.add('selected')
}

ImageContainer.prototype.Unselect = function() {
  this.div.classList.remove('selected')
}

ImageContainer.prototype.UpdateImageFromFile = async function(imageFile) {
  const compressor = new ImageFileCompressor(this.canvas)
  this.object.image = await compressor.LoadAndCompress(imageFile)
  this.object.imageData = compressor.compressedImageData
  this.Refresh()
}

ImageContainer.prototype.OnClick = function(callback) { this.div.onclick = () => callback() }

ImageContainer.prototype.ShiftLeft = function() {
  const previousSibling = this.GetPreviousSibling()
  if( previousSibling == null ) return
  this.InsertBefore(previousSibling)
}

ImageContainer.prototype.ShiftRight = function() {
  const nextSibling = this.GetNextSibling()
  if( nextSibling == null ) return
  this.InsertAfter(nextSibling)
}

ImageContainer.prototype.GetPreviousSibling = function() {
  const previousSiblings = []
  let element = this.div
  while( element.previousSibling ) {
    if( element.previousSibling.dataset.id ) previousSiblings.push(element.previousSibling)
    element = element.previousSibling
  }
  if( previousSiblings.length == 0 ) return null
  return previousSiblings[0]
}

ImageContainer.prototype.GetNextSibling = function() {
  const subsequentSiblings = []
  let element = this.div
  while( element.nextSibling ) {
    if( element.nextSibling.dataset.id ) subsequentSiblings.push(element.nextSibling)
    element = element.nextSibling
  }
  if( subsequentSiblings.length == 0 ) return null
  return subsequentSiblings[0]
}

ImageContainer.prototype.InsertBefore = function(element) {
  this.element.parentElement.insertBefore(this.element,element)
}

ImageContainer.prototype.InsertAfter = function(element) {
  element.parentElement.insertBefore(element,this.element)
}

module.exports = ImageContainer
