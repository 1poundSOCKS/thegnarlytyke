let uuid = require('uuid');
// let CragDetails = require('./crag-details.cjs')

let CragIndex = function() {
  this.data = null;
}

CragIndex.prototype.Load = async function(dataStorage, imageStorage) {
  this.data = await dataStorage.Load('crag-index');
  if( imageStorage ) this.data.crags.forEach( crag => this.LoadCragImage(imageStorage, crag) )
  return this.data;
}

CragIndex.prototype.LoadCragImage = async function(imageStorage, crag) {
  crag.imageLoader = imageStorage.LoadImageFromFile(crag.imageFile);
}

CragIndex.prototype.AppendCrag = function() {
  const cragCount = this.data.crags.push({id: uuid.v4(),name:"NEW CRAG"})
  return this.data.crags[cragCount-1]
}

CragIndex.prototype.Save = async function(dataStorage, imageStorage) {
  const imageSaves = [];
  this.data.crags.forEach( crag => {
    imageSaves.push(this.SaveCragImage(imageStorage, crag))
  })

  await Promise.all(imageSaves);
  await dataStorage.Save('crag-index', this.data);

  // this.data.crags.forEach( crag => this.SaveCragDetails(dataStorage, crag) )
}

CragIndex.prototype.SaveCragImage = async function(imageStorage, crag) {
  if( crag.imageData ) {
    const filename = await imageStorage.SaveImageWithAPI(crag.id, crag.imageData, "crag")
    crag.imageFile = filename;
    delete crag.imageData;
  }
}

// CragIndex.prototype.SaveCragDetails = async function(dataStorage, crag) {
//   const objectID = `${crag.id}.crag`;
//   try {
    // const cragDetails = new CragDetails();
    // const cragData = await cragDetails.Load(dataStorage, objectID);
    // console.log(`crag details exist: ${objectID}`);
//   }
//   catch(err) {
//     console.log(`crag details don't exist: ${objectID}`)
//     console.log(err);
    // dataStorage.Save(objectID, {id: crag.id, name: crag.name});
//   }
// }

module.exports = CragIndex;
