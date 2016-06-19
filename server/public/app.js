var App = {}

var ctx = undefined;
var canvas;

App.N = 0;

function x(f) {
  return (f / 100) * canvas.width;
}

function y(f) {
  return (f / 100) * canvas.height;
}

App.init = function() {
  App.N = 0;
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.fillStyle = "#FF0000";
  ctx.fillRect(0, 0, x(50), y(50));
  App.initNextFrameRequest();
  
}

App.initNextFrameRequest = function() {
  $.get('/frame/' + App.N, function(data) {
    if(data.end) {
      // TODO: special effect for this
      return;
    }
    App.onNextFrame(data);
    App.N++;
    App.initNextFrameRequest();
  });
}

App.onNextFrame = function(frameData) {
  function r() {
    return Math.random() * 100;
  }
  // TODO: process data
  for(var cityId in frameData) {
    ctx.beginPath();
    ctx.moveTo(x(r()), y(r()));
    ctx.lineTo(x(r()), y(r()));
    ctx.closePath();
    ctx.strokeStyle = 'green';
    ctx.stroke();
  }
}

App.getRandomPosToCity = function() {
  
}

$(App.init);