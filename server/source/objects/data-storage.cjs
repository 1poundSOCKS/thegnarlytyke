let DataStorage = function() {
  this.dataURL = null;
  this.saveDataURL = null;
}

DataStorage.prototype.Init = function(config) {
  this.dataURL = config.data_url;
  this.saveDataURL = config.save_data_url;
}

DataStorage.prototype.Load = async function(object_id) {
  const response = await fetch(`${this.dataURL}${object_id}.json`, {cache: "reload"});
  return response.json();
}

DataStorage.prototype.Save = async function(object_id, data) {
  const requestBody = JSON.stringify(data, null, 2);
  const url = `${this.saveDataURL}?id=${object_id}`;
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    body: requestBody
  });
  return response.json();
}

module.exports = new DataStorage;
