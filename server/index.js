import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path'
import * as _crag from './crag.js'

const imagesFolder = '../work/images';

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/add_topo', (req, res) => {
  console.log('POST /add_topo');
  AddTopo(req.body.imageData)
  .then( topo => {
    res.send(JSON.stringify(
    {
      result: "success",
      topo: {
        id: topo.id,
        imageFile: topo.imageFile
      }
    }));
  })
  .catch( err => {
    console.error(err.toString());
    res.send(JSON.stringify(
      {
        result: "error",
        details: err.toString()
      }));
    })
});

app.get('/get_image', (req, res) => {
  console.log('GET /get_image');
  const imageFilename = path.resolve(imagesFolder, req.query.filename);
  console.log(`returing image file '${imageFilename}'`);
  res.sendFile(imageFilename);
});

app.get('/editor', (req, res) => {
  console.log('GET /editor');
  res.sendFile(path.resolve('public', 'editor.html'));
});

app.listen(80);

let AddTopo = async (imageData) => {
  if( !imageData ) throw 'image data not supplied';
  let crag = await _crag.LoadCrag();
  let topo = _crag.AddTopo(crag, imageData);
  await _crag.SaveTopoImage(topo, imagesFolder);
  await _crag.SaveCrag(crag);
  return topo;
}
