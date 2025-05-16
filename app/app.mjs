//temporary code
/*const http = require('http');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});*/

import express from 'express';
import {spawn} from 'node:child_process';
const app = express();
app.set('view engine', 'pug');
const port = 3000;
let result = [];

app.use('/js', express.static('js'));

app.get('/', (req, res) => {
  res.render('home', { title: 'Hey', message: 'Hello there! This is made with pug and express' });
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
    let song = 'Mortals.mp3';
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
