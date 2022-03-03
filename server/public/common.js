/*
server load functions
*/
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


let LoadTopoImagesFromCrag = (cragObject, OnTopoLoadCallback) => {
  cragObject.topos.forEach( topo => {
    let topoImageFile = topo.imageFile;
    console.log(`image file: ${topoImageFile}`);
    LoadImage(`./get_image?filename=${topoImageFile}`)
    .then( topoImage => {
      OnTopoLoadCallback(topo, topoImage);
    });
  });
}

/*
table functions
*/
let GetTableRowsWithoutHeader = (tableElement) => Array.from(tableElement.rows).filter( (row, index) => index > 0 );

let DeleteAllTableRowsExceptHeader = (tableElement) => { while( tableElement.rows.length > 1 ) tableElement.deleteRow(1); }

let IsTableCellChecked = (row, cellIndex) => {
  return row.cells[cellIndex].firstChild.checked;
}
