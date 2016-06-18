var App = {}

App.init = function() {
  App.$canvas = $('#canvas');
  alert(App.$canvas.attr('width'));
}


$(App.init);