import express from 'express';
import bodyParser from 'body-parser';
import path from 'path'
import * as _crag from './crag.js'

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
  const imageFilename = _crag.GetFullImageFilename(req.query.filename);
  console.log(`returing image file '${imageFilename}'`);
  res.sendFile(imageFilename);
});

app.get('/get_crag', (req, res) => {
  console.log('GET /get_crag');
  _crag.GetCrag()
  .then( crag => {
    // console.log(crag);
    let cragString = JSON.stringify(crag);
    // console.log(cragString);
    res.send(cragString);
  });
  // .then( crag => {
  //   res.send(JSON.stringify(crag));
  // })
  // .catch( err => {
  //   res.send(err);
  // });
});

app.get('/editor', (req, res) => {
  console.log('GET /editor');
  res.sendFile(path.resolve('public', 'editor.html'));
});

app.listen(80);

let AddTopo = async (imageData) => {
  if( !imageData ) throw 'image data not supplied';
  const topo = _crag.AddTopo(imageData);
  return topo;
}
