function game(){
  var canvas = document.getElementById("game");
  var ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth/2;
  canvas.height = window.innerHeight/2;

}

function drawLanes(){
  ctx.fillStyle = "green";
  ctx.fillRect(0,0,canvas.width/4,canvas.height);
  ctx.fillStyle = "red";
  ctx.fillRect(0,0,canvas.width/4,canvas.height);
  ctx.fillStyle = "yellow";
  ctx.fillRect(0,0,canvas.width/4,canvas.height);
  ctx.fillStyle = "blue";
  ctx.fillRect(0,0,canvas.width/4,canvas.height);
}

game();
