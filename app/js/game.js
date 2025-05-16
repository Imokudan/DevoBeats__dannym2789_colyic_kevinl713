/*import {result} from './app.mjs';

var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
function game(){
  canvas.width = window.innerWidth/2;
  canvas.height = window.innerHeight/2;
  drawLanes();
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
*/
fetch('/api/beats')
  .then(response => response.json())
  .then(data => {
    console.log('Beats data:', data);
    // Do something with the data
  })
  .catch(err => {
    console.error('Error fetching beats:', err);
  });
