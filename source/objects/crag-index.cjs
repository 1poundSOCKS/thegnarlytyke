let uuid = require('uuid');

let CragIndex = function() {
  this.data = null;
}

CragIndex.prototype.Load = function(dataStorage) {
  return new Promise( (accept,reject) => {
    dataStorage.Load('crag-index',false)
    .then( data => {
      this.data = data
      accept(this.data)
    })
    .catch( err => {
      this.data = null
      reject(err)
    })
  })
}

CragIndex.prototype.Save = function(dataStorage) {
  return dataStorage.Save('crag-index', this.data, false);
}

CragIndex.prototype.LoadCragImage = function(imageStorage, crag) {
  if( !crag.imageFile ) return null
  return imageStorage.LoadImageFromFile(crag.imageFile)
}

CragIndex.prototype.AppendCrag = function(cragName,imageLoader) {
  const cragCount = this.data.crags.push({id: uuid.v4(),name:cragName,imageLoader:imageLoader})
  return this.data.crags[cragCount-1]
}

CragIndex.prototype.SaveCragImage = async function(imageStorage, crag) {
  if( crag.imageData ) {
    const response = await imageStorage.SaveImage(crag.id, crag.imageData, "crag")
    crag.imageFile = response.filename;
    delete crag.imageData;
  }
}

module.exports = CragIndex;
