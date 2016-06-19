var App = {}

var ctx = undefined;

App.N = 0;

App.init = function() {
  App.N = 0;
  ctx = document.getElementById("canvas").getContext("2d");
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(0,0,150,75);
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