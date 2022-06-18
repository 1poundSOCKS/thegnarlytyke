let CragDetails = new function() {
  this.data = null;
}

CragDetails.prototype.Load = async function(dataStorage, id) {
  const objectID = `${id}.crag`;
  return dataStorage.Load(objectID);
}

CragDetails.prototype.Save = async function(dataStorage) {
  const objectID = `${this.data.id}.crag`;
  return dataStorage.Save(objectID, this.data);
}

module.exports = CragDetails;
