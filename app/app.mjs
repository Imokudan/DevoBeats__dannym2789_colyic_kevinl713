import express from 'express';
import {spawn} from 'node:child_process';
const app = express();
app.set('view engine', 'pug');
const port = 3000;
let result = [];

app.use('/js', express.static('js'));
app.use('/audioFiles', express.static('audioFiles'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/home.html'))
});

app.get('/game', (req, res) => {
  res.render('game', { title: 'game' });
});

app.get('/api/beats', (req, res) => {
  getBeats().then(data => {
    res.json(data);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function getBeats() {
  return new Promise((resolve, reject) => {
    let song = 'audioFiles/Royalty.mp3';
    let beats = [];
    const pythonProcess = spawn('python3', ['beats.py', song]);
    pythonProcess.stdout.on('data', data => {
      beats.push(data.toString());
    });
    pythonProcess.on('exit', code => {
      const arr = beats[0].replace(/^"|"$/g, '').split('\n').filter(Boolean).map(Number);
      result = arr;
      resolve(arr);
    });
    pythonProcess.on('error', err => {
      reject(err);
    });
  });
}
