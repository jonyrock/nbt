var express = require('express');
var app = express();
var pg = require('pg');
var _ = require('lodash');

var fs = require('fs');

var connectionString = process.env.DATABASE_URL || 'postgres://corp:qwer@localhost:5432/nbt';

var client = new pg.Client(connectionString);
client.connect();

var QUERY_STEP_SIZE = 50;

var REGIONS = [77, 78, 50, 47, 54, 66, 52];

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
    var res = {}
    
    _.each(REGIONS, r => {
      res[r] = [];
    })
    
    query.on('row', function(row) {
      wasRow = true;
      res[+row.regioncode].push(row.size);
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

var REGIONS_SQL = "('" + REGIONS.join("','") + "')";

function getQuery(n) {
  return `
    SELECT a.regioncode, COUNT(b.aoid) as size
    FROM public.addrobj AS a
    LEFT JOIN public.addrobj AS b
    ON b.parentguid = a.aoid
    WHERE a.aolevel = '7' and a.regioncode in ${REGIONS_SQL}
    GROUP BY(a.aoid, a.regioncode)
    LIMIT ${QUERY_STEP_SIZE}
    OFFSET ${n * QUERY_STEP_SIZE}  
  `;
}

function precalcFromDB() {
  
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return callback(undefined);
    }

    var query = client.query(`
      SELECT a.regioncode, a.aolevel
      FROM public.addrobj as a
      WHERE (a.aolevel = '6' or a.aolevel = '7') 
            and a.regioncode in ${REGIONS_SQL}
      order by a.aoid
    `);

    var res = {}
    var rowCount = 0;
    
    function dropFile() {
      var num = Math.ceil(rowCount / QUERY_STEP_SIZE);
      fs.writeFile(
        __dirname + 'public/data/' + num + ".json", 
        JSON.stringify(res), 
        function(err) {
          if(err) {
            return console.log(err);
          }
          console.log("The file was saved! " + __dirname + '/data/' + num + ".json");
        }
      );
      res = {};
      _.each(REGIONS, r => {
        if(r == 50 || r == 47) {
          return;
        }
        res[r] = {
          street: 0,
          building: 0
        }
      });
    }

    query.on('row', function(row) {
      if((rowCount % QUERY_STEP_SIZE) == 0) {
        dropFile();
      }
      rowCount++;
      var code = +row.regioncode;
      if(code == 50) {
        code = 77;
      }
      if(code == 47) {
        code = 78;
      }
      if(res[code] === undefined) {
        console.log("WHAT ASDASD:::::: " + code);
      }
      if(row.aolevel === '6') {
        res[code].building++;
      }
      if(row.aolevel === '7') {
        res[code].street++;
      }
    });

    query.on('end', function(data) {
      dropFile();
      done();
    });
  });

}

//precalcFromDB();


