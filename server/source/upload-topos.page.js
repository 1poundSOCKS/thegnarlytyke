let _cragID = null;
let _topoImageFiles = [];
let _currentTopo = null;
window.onload = function() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  _cragID = urlParams.get('id');
  let topoCanvas = document.getElementById('topo-canvas');
  topoCanvas.width = 500;
  topoCanvas.height = 500;
  let downloadTopoCanvas = document.getElementById('download-topo-canvas');
  downloadTopoCanvas.width = 500;
  downloadTopoCanvas.height = 500;
  UpdateCurrentTopo(null);
  document.getElementById('topo-image-files').onchange = OnSelectImageFiles;
  document.getElementById('upload').onclick = Upload;
  document.getElementById('download').onclick = Download;
}
window.onresize = () => {
}
let OnSelectImageFiles = () => {
  let topoImageFiles = document.getElementById('topo-image-files');
  _topoImageFiles = Array.from(topoImageFiles.files).map( file => {
    return { file: file }
  });
  UpdateTopoTable(_topoImageFiles);
  LoadCurrentTopoImageFile();
}
let LoadCurrentTopoImageFile = () => {
  if( _currentTopo && _currentTopo.image ) {
    DrawTopoImage(_currentTopo.image);
  }
  else if( _currentTopo ) {
    LoadTopoImageFile(_currentTopo.file).then( result => {
      console.log(`file '${result.file.name} loaded, content length=${result.contents.length}`);
      _currentTopo.contents = result.contents;
      LoadImage(result.contents).then( topoImage => {
        console.log(`image loaded`);
        _currentTopo.image = topoImage;
        DrawTopoImage(topoImage);
      });
    });
  }
}
let DrawTopoImage = (topoImage) => {
  let topoCanvas = document.getElementById('topo-canvas');
  topoCanvas.height = 500;
  topoCanvas.width = topoImage.width * topoCanvas.height / topoImage.height;
  const ctx = topoCanvas.getContext("2d");
  ctx.drawImage(topoImage, 0, 0, topoCanvas.width, topoCanvas.height);
}
let LoadTopoImageFiles = (files) => {
  files.forEach( file => {
    LoadTopoImageFile(file).then( result => {
      console.log(`file '${result.file.name} loaded, content length=${result.contents.length}`);
      LoadImage(result.contents).then( topoImage => {
        console.log(`image loaded`);
        let topoCanvas = document.getElementById('topo-canvas');
        topoCanvas.height = 500;
        topoCanvas.width = topoImage.width * topoCanvas.height / topoImage.height;
        const ctx = topoCanvas.getContext("2d");
        ctx.drawImage(topoImage, 0, 0, topoCanvas.width, topoCanvas.height);
      });
    });
  });
}
let LoadTopoImageFile = file => new Promise( resolve => {
  console.log(file);
  let fileReader = new FileReader();
  fileReader.onload = () => resolve({file: file, contents: fileReader.result});
  fileReader.readAsDataURL(file);
});
let UpdateTopoTable = (topos) => {
  console.log(`update topo table with ${topos.length} files`);
  let table = document.getElementById('topo-table');
  while( table.rows.length > 1 ) table.deleteRow(1);
  topos.forEach( (topo, index) => {
    let row = table.insertRow(index + 1);
    let cell1 = row.insertCell(0);
    cell1.innerHTML = topo.file.name;
    row.onclick = (event) => {
      let selectedTopos = topos.filter( topo => topo.file.name == event.currentTarget.cells[0].innerHTML );
      if( selectedTopos.length == 1 ) {
        console.log(selectedTopos[0].file.name);
        UpdateCurrentTopo(selectedTopos[0]);
        LoadCurrentTopoImageFile();
      }
    }
    let cell2 = row.insertCell(1);
    cell2.innerHTML = topo.id ? topo.id : '';
  });
  let topoCanvas = document.getElementById('topo-canvas');
  topoCanvas.width = 500;
  topoCanvas.height = 500;
}
let UpdateTopoRow = (topo) => {
  let table = document.getElementById('topo-table');
  Array.from(table.rows).forEach( row => {
    if( row.cells[0].innerHTML == topo.file.name ) row.cells[1].innerHTML = topo.topo.id;
  });
}
let Upload = async () => {
  const canvas = document.getElementById("topo-canvas");
  const topoImageURL = canvas.toDataURL('image/jpeg', 0.5);
  const req = { cragID: _cragID, imageData: topoImageURL };
  const response = await fetch('/add_topo', {
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
  const resData = await response.json();
  _currentTopo.uploaded = true;
  _currentTopo.topo = resData.topo;
  UpdateCurrentTopo(_currentTopo);
  UpdateTopoRow(_currentTopo);
  return resData;
}
let UpdateCurrentTopo = topo => {
  _currentTopo = topo;
  let currentTopoUploaded = (_currentTopo && _currentTopo.uploaded);
  if( currentTopoUploaded )
    console.log(`current topo UPLOADED`);
  document.getElementById("upload").disabled = currentTopoUploaded;
  document.getElementById("download").disabled = !(_currentTopo && _currentTopo.topo && _currentTopo.topo.imageFile);
  document.getElementById('topoID').value = _currentTopo && _currentTopo.topo ? _currentTopo.topo.id : '';
  document.getElementById('topoFilename').value = _currentTopo && _currentTopo.topo ? _currentTopo.topo.imageFile : '';
}
let Download = async () => {
  const imageFilename = document.getElementById('topoFilename').value;
  const image = await LoadImage(`/get_image?filename=${imageFilename}`);
  const canvas = document.getElementById("download-topo-canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);
}
