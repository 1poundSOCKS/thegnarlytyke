let uuid = require('uuid');

let CragIndex = function() {
  this.data = null;
}

CragIndex.prototype.Load = async function(dataStorage, imageStorage) {
  this.data = await dataStorage.Load('crag-index');
  this.data.crags.forEach( crag => delete crag.imageLoader )
  if( imageStorage ) this.data.crags.forEach( crag => this.LoadCragImage(imageStorage, crag) )
  return this.data;
}

CragIndex.prototype.Save = async function(dataStorage, imageStorage) {
  const cragsBeforeImageSaves = this.data.crags.map( crag => {
    const cragData = {id:crag.id,name:crag.name}
    if( crag.imageData ) cragData.imageSaveResponse = imageStorage.Save(crag.id,crag.imageData,'crag')
    else if( crag.imageFile ) cragData.imageFile = crag.imageFile
    return cragData
  })

  const imageSaveResponses = cragsBeforeImageSaves.map( crag => crag.imageSaveResponse )
  await Promise.all(imageSaveResponses)

  const cragsAfterImageSaves = cragsBeforeImageSaves.map( crag => {
    const cragData = {id:crag.id,name:crag.name}
    if( crag.imageSaveResponse ) cragData.imageFile = crag.imageSaveResponse.filename
    else cragData.imageFile = crag.imageFile;
    return cragData
  })

  dataStorage.Save('crag-index', {crags:cragsAfterImageSaves});
}

CragIndex.prototype.LoadForUserEdit = async function(dataStorage, imageStorage) {
  this.data = await dataStorage.LoadForUserEdit('crag-index');
  this.data.crags.forEach( crag => delete crag.imageLoader )
  if( imageStorage ) this.data.crags.forEach( crag => this.LoadCragImage(imageStorage, crag) )
  return this.data;
}

CragIndex.prototype.LoadCragImage = async function(imageStorage, crag) {
  if( !crag.imageFile ) return
  crag.imageLoader = imageStorage.LoadImageFromFile(crag.imageFile);
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
