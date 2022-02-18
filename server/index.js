import express from 'express';
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(8080, () => {
  console.log('Listening on port 8080!');
});
