let ImageStorage = function() {

}

ImageStorage.prototype.SaveImage = async function(ID, imageData) {
  const req = { ID: ID, imageData: imageData };
  const response = await fetch('/save-image', {
    method: 'POST',
    mode: 'same-origin',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'same-origin',
    body: JSON.stringify(req)
  });

  const parsedResponse = await response.json();
  console.log(parsedResponse)
  return parsedResponse.filename;
}

module.exports = ImageStorage;
