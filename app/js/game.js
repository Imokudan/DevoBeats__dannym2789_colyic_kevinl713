var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var song = document.getElementById("song");
let beats = [];

fetch('/api/beats')
  .then(response => response.json())
  .then(data => {
    console.log('Beats data:', data);
    beats = data;
  })
  .catch(err => {
    console.error('Error fetching beats:', err);
  });

function game(){
  canvas.width = window.innerWidth/2;
  canvas.height = window.innerHeight/2;
  drawLanes();
  console.log(song.currentTime);
  ctx.beginPath();
  ctx.rect(0,0,canvas.width/4,canvas.height/8);
  ctx.fill();
}

function drawLanes(){
  ctx.strokeStyle = 'black';
  for(i = 1; i < 4; i ++){
    ctx.beginPath();
    ctx.moveTo(i*canvas.width/4,0);
    ctx.lineTo(i*canvas.width/4,canvas.height);
    ctx.stroke();
  }
}

game();
