import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

const app = express();
const jsonParser = bodyParser.json();

app.use(express.static('public'));

app.post('/upload_image', jsonParser, (req, res) => {
  console.log('Upload image...');
  console.log(`${JSON.stringify(req.body)}`);
  const base64ImageData = req.body.image.split(",")[1];
  const buf = Buffer.from(base64ImageData, 'base64');
  console.log(`image size=${buf.byteLength}`);
  fs.writeFile(`C:/Users/mathe/source/repos/thegnarlytyke/server/upload/topo_${Date.now()}.jpg`, buf,  "binary", err => {
    console.log(err)
  });
  res.send(JSON.stringify({"result": "success"}));
});

app.get('/editor', (req, res) => {
  res.sendFile('C:\\Users\\mathe\\source\\repos\\thegnarlytyke\\server\\public\\editor.html');
});

app.listen(80);
