var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var song = document.getElementById("song");
let beats = [];

function getBeats(){
  fetch('/api/beats')
    .then(response => response.json())
    .then(data => {
      console.log('Beats data:', data);
      beats = data;
    })
    .catch(err => {
      console.error('Error fetching beats:', err);
    });
}

function game(){
  getBeats();
  canvas.width = window.innerWidth/2;
  canvas.height = window.innerHeight/2;
  drawLanes();
  drawRects();
  animate();
}

function drawLanes(){
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.rect(0,canvas.height-100,canvas.width,canvas.height/8);
  ctx.fill();
  for(i = 1; i < 4; i ++){
    ctx.beginPath();
    ctx.moveTo(i*canvas.width/4,0);
    ctx.lineTo(i*canvas.width/4,canvas.height);
    ctx.stroke();
  }
}

function drawRects(){
  for(i = 0; i < beats.length; i++){
    if(song.currentTime-beats[i]<= 3 && song.currentTime-beats[i]>-1){
      console.log(beats[i]);
      ctx.beginPath();
      ctx.rect(0,canvas.height*(1-(beats[i]-song.currentTime)),canvas.width/4,canvas.height/8);
      ctx.fill();
    }
  }
}

function animate(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLanes();
  drawRects();
  requestAnimationFrame(animate);
}

game();
