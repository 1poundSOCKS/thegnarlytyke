import express from 'express';
import bodyParser from 'body-parser';
import path from 'path'
import * as _crag from './crag.js'
import Config from './source/config.cjs';

const app = express();
app.use(express.static('public'));
app.use(express.static('node_modules/@fortawesome'));
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
  console.log('GET /ping');
  res.send({});
});

app.get('/edit', (req, res) => {
  res.sendFile(path.resolve('./public', 'edit.html'));
});

app.post('/add_topo', (req, res) => {
  console.log('POST /add_topo');
  AddTopo(req.body.cragID, req.body.imageData)
  .then( topo => {
    res.send({result: "success", topo: {id: topo.id, imageFile: topo.imageFile}});
  })
  .catch( err => {
    console.error(err.toString());
    res.send({result: "error", details: err.toString()});
  })
});

app.get('/get_image', (req, res) => {
  console.log('GET /get_image');
  const imageFilename = _crag.GetFullImageFilename(req.query.filename);
  console.log(`returing image file '${imageFilename}'`);
  res.sendFile(imageFilename);
});

app.get('/get_crag', (req, res) => {
  console.log('GET /get_crag');
  _crag.GetCrag()
  .then( crag => {
    res.send(crag);
  });
});

app.post('/save_crag', (req, res) => {
  console.log('GET /save_crag');
  // _crag.SaveCrag(req.body)
  SaveCrag(req.body)
  .then( () => {
    res.send({result: 'success'});
  })
  .catch( err => {
    console.error(err.toString());
    res.send({result: "error", details: err.toString()});
  });
});

app.get('/add_topos', (req, res) => {
  console.log('GET /editor');
  res.sendFile(path.resolve('./private', 'add_topos.html'));
});

app.get('/delete_topo', (req, res) => {
  console.log('GET /delete_topo');
  _crag.DeleteTopo(req.query.topo_id)
  .then( ()=> {
    res.send({result: 'success'});
  })
  .catch( err => {
    console.error(err.toString());
    res.send({result: "error", details: err.toString()});
  })
});

app.listen(80);

let AddTopo = async (cragID, imageData) => {
  if( !cragID ) throw 'crag ID not specified';
  if( !imageData ) throw 'image data not supplied';
  await LoadConfig();
  console.log(`environment: ${Config.environment}`);
  // const topo = _crag.AddTopo(cragID, imageData);
  // return topo;
  return {};
}

let LoadConfig = async () => {
  let configData = await _crag.ReadJSONFileIntoObject('public/config.json');
  console.table(`config: ${configData}`);
  Config.Load(configData);
  console.log(`environment loaded: ${Config.environment}`);
}

let SaveCrag = async (cragData) => {
  if( !cragData ) throw 'crag data not supplied';
  console.log(cragData);
  let cragObject = JSON.parse(cragData);
  let cragID = cragObject.id;
  console.log(`crag ID: ${cragID}`);
  await LoadConfig();
  console.log(`environment: ${Config.environment}`);
  const cragFilename = `public/env/${Config.environment}/data/${cragID}.crag.json`;
  console.log(`crag filename: ${cragFilename}`);
  return WriteObjectToFile(cragObject, cragFilename);
}
