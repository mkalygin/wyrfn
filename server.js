var fs      = require('fs');
var express = require('express');

var DEFAULT_PORT    = 1337;
var PUBLIC_DIR_PATH = __dirname + '/public';
var DATA_JSON_PATH  = __dirname + '/data.json';

var app = express();

app.use(express.static(PUBLIC_DIR_PATH));

// Data provider for client's visualization.
app.get('/data', function (req, res, next) {
  fs.readFile(DATA_JSON_PATH, 'utf8', function (err, json) {
    if (err) next(err);

    var usersData = JSON.parse(json);

    res.json([
      {
        username: 'mkalygin',
        repos: [
          { name: 'lol', contributions: 1 },
          { name: 'rofl', contributions: 2 },
          { name: 'wtf', contributions: 3 }
        ]
      },
      {
        username: 'gnykka',
        repos: [
          { name: 'lol', contributions: 3 },
          { name: 'rofl', contributions: 2 },
          { name: 'wtf', contributions: 1 }
        ]
      }
    ]);
  });
});

// Global error handler.
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err.message);
});

app.listen(process.env.PORT || DEFAULT_PORT);
