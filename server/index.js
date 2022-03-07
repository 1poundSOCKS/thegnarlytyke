import express from 'express';
import bodyParser from 'body-parser';
import path from 'path'
import * as _crag from './crag.js'

const app = express();
app.use(express.static('private'));
app.use(bodyParser.json());

app.post('/add_topo', (req, res) => {
  console.log('POST /add_topo');
  AddTopo(req.body.imageData)
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
  _crag.SaveCrag(req.body)
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

let AddTopo = async (imageData) => {
  if( !imageData ) throw 'image data not supplied';
  const topo = _crag.AddTopo(imageData);
  return topo;
}
