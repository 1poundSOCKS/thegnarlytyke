let LoadImage = (url) => new Promise( (resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = (err) => reject(err);
  img.src = url;
});

let LoadTopoImages = (crag, location) => new Promise( (resolve, reject) => {
  let loaders = crag.topos.map(topo => LoadImage(location + topo.imageFile));
  Promise.all(loaders)
  .then(images => {
    crag.topos.forEach( (topo, index) => {
      topo.image = images[index];
    });
    resolve(crag);
  })
  .catch(err => reject(err));
});

let LoadCrag = (url, imagesLocation) => new Promise( (resolve, reject) => {
  fetch(url)
  .then(response => response.json())
  .then(data => {
    LoadTopoImages(data, imagesLocation).then(crag => {
      resolve(crag);
    });
  })
  .catch(err => reject(err));
});
