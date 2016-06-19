var App = {}

var ctx = undefined;
var canvas;

App.N = 0;

var REGIONS = {
  77: { color: '#1f77b400' },
  78: { color: '#ff7f0e00' },
  54: { color: '#2ca02c' },
  66: { color: '#d62728' },
  52: { color: '#9467bd' }
}

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
  _.each(frameData, function(v, k) {
    App.drawStreet(k, v);
  });
}

App.drawStreet = function(cityId, size) {
  function r() {
    return Math.random() * 100;
  }
  // TODO: use size
  ctx.beginPath();
  ctx.moveTo(x(r()), y(r()));
  ctx.lineTo(x(r()), y(r()));
  ctx.closePath();
  ctx.strokeStyle = REGIONS[cityId].color
  ctx.stroke();
}

App.getRandomPosToCity = function() {
  
}

$(App.init);