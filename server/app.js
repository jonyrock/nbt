var express = require('express');
var app = express();
var pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://corp:qwer@localhost:5432/nbt';

var client = new pg.Client(connectionString);
client.connect();

var QUERY_STEP_SIZE = 50;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.use(express.static(__dirname + '/public'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.get('/frame/:id(\\d+)', function (req, res) {
  var n = +req.params['id'];
  computeGeoms(n, function(data) {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(__dirname + '/public/index.html');
    res.send(JSON.stringify(data))
  });
});

function computeGeoms(n, callback) {
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return callback(undefined);
    }

    var query = client.query(getQuery(n));

    var wasRow = false;
    var res = {
      77: [],
      78: [4, 1, 1]
    }

    query.on('row', function(row) {
      wasRow = true;
      // TODO: process data
      res[77].push(row);
    });

    query.on('end', function(data) {
      done();
      if(!wasRow) {
        res = { end: true };
      }
      callback(res);
    });
  });
}

function getQuery(n) {
  var offset = n * QUERY_STEP_SIZE;
  return `select * from addrobj limit ${QUERY_STEP_SIZE} OFFSET ${offset}`;
}


