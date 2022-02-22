let LoadImage = (url) => new Promise( (resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = (err) => reject(err);
  img.src = url;
});

let LoadTopoImages = (crag) => new Promise( (resolve, reject) => {
  let loaders = crag.topos.map(topo => LoadImage(topo.imageFile));
  Promise.all(loaders)
  .then(images => {
    crag.topos.forEach( (topo, index) => {
      topo.image = images[index];
    });
    resolve(crag);
  })
  .catch(err => reject(err));
});

let LoadCrag = (url) => new Promise( (resolve, reject) => {
  fetch(url)
  .then(response => response.json())
  .then(data => {
    LoadTopoImages(data).then(crag => {
      resolve(crag);
    });
  })
  .catch(err => reject(err));
});
