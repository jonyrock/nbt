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
  // TODO: process data
  console.log(frameData);
}


$(App.init);