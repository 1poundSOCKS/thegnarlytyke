let uuid = require('uuid');

let CragIndex = function() {
  this.data = null;
}

CragIndex.prototype.Load = async function(dataStorage) {
  this.data = await dataStorage.Load('crag-index');
  return this.data;
}

CragIndex.prototype.Save = async function(dataStorage) {
  dataStorage.Save('crag-index', this.data);
}

CragIndex.prototype.LoadForUserEdit = async function(dataStorage) {
  this.data = await dataStorage.LoadForUserEdit('crag-index');
  return this.data;
}

CragIndex.prototype.LoadCragImage = async function(imageStorage, crag) {
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
