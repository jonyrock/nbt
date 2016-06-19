var App = {}

var ctx = undefined;
var canvas;

App.N = 0;

var REGIONS = {
  77: { color: '#1f77b4', center:[50, 50] },
  78: { color: '#ff7f0e', center:[20, 20] },
  54: { color: '#2ca02c', center:[80, 20] },
  66: { color: '#d62728', center:[20, 80] },
  52: { color: '#9467bd', center:[80, 80] }
}

function x(f) {
  return (f / 100) * canvas.width;
}

function y(f) {
  return (f / 100) * canvas.height;
}

App.init = function() {
  App.N = 1;
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  App.initNextFrameRequest();
}

App.initNextFrameRequest = function() {
  $.get('/data/' + App.N + '.json', function(data) {
    if(data.end) {
      // TODO: special effect for this
      return;
    }
    App.onNextFrame(data);
    App.N++;
    setTimeout(App.initNextFrameRequest, 1000 / 20);
  });
}

App.onNextFrame = function(frameData) {
  _.each(frameData, function(v, k) {
    for(var i = 0; i < v.street; i++) {
      App.drawStreet(+k, v);
    }
    for(var i = 0; i < v.building; i++) {
      App.drawBuilding(+k, v);
    }
  });
}

App.drawStreet = function(cityId) {
  function r() {
    return Math.random() * 14 - 7;
  }
  ctx.beginPath();
  var pa = [REGIONS[cityId].center[0] + r(), REGIONS[cityId].center[1] + r()];
  var pb = [REGIONS[cityId].center[0], REGIONS[cityId].center[1]];
  ctx.moveTo(x(pa[0]), y(pa[1]));
  ctx.lineTo(x(pb[0]), y(pb[1]));
  ctx.closePath();
  ctx.strokeStyle = REGIONS[cityId].color
  ctx.stroke();
}

App.drawBuilding = function(cityId) {
  function r() {
    return Math.random() * 20 - 10;
  }
  // TODO: use size
  ctx.beginPath();
  var pa = [REGIONS[cityId].center[0] + r(), REGIONS[cityId].center[1] + r()];
  var pb = [pa[0] + 1, pa[1] + 1];
  ctx.moveTo(x(pa[0]), y(pa[1]));
  ctx.lineTo(x(pb[0]), y(pb[1]));
  ctx.closePath();
  ctx.strokeStyle = REGIONS[cityId].color
  ctx.stroke();
}

App.getRandomPosToCity = function() {
  
}

$(App.init);