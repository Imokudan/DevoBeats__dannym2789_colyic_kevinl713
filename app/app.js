//temporary code
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!\n');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});

/*
const express = require('express');
const app = express();
const port = 3000

app.get('/',(req,res) => {
  res.send('Hello World!');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function getBeats(){
  var song = 'Mortals.mp3';

  const spawn = require("child_process").spawn;
  const pythonProcess = spawn('python',["beats.py", song]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(data.toString());
  });
}

getBeats();
*/
