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
var result = [];

app.get('/',(req,res) => {
  res.render('home', { title: 'Hey', message: 'Hello there! This is made with pug and express' });
})

//app.all uses both get and post methods
app.all('/game',(req,res) => {
  res.render('game', { title: 'game'});
  getBeats();
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

function getBeats(){
  var song = 'Mortals.mp3';

  //Use HTMLMediaElement currentTime

  const pythonProcess = spawn('python',["beats.py", song]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString());
    result.push(data.toString());
  });
  pythonProcess.on('exit', (code) => {
    console.log(`child process exited with code ${code}`);
    export default result;
  });
}
