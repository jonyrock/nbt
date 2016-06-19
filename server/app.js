var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(__dirname + '/public'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/frame/:id(\\d+)', function (req, res) {
  var n = +req.params['id'];
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(__dirname + '/public/index.html');

  res.send(
    JSON.stringify(computeGeoms(n))
  );
});


function computeGeoms(n) {
  return {
    77: [1, 2, 3],
    78: [4, 1, 1]
  }
}


