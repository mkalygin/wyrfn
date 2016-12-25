var fs      = require('fs');
var express = require('express');
var GitHub  = require('github-api');

var DEFAULT_PORT      = 1337;
var PUBLIC_DIR_PATH   = __dirname + '/public';
var DATA_JSON_PATH    = __dirname + '/data.json';
var GITHUB_TOKEN_PATH = __dirname + '/.token';
var GITHUB_TOKEN      = process.env.GITHUB_AUTH_TOKEN ||
                        getGitHubToken(GITHUB_TOKEN_PATH);
var NUM_SINCE_DAYS    = 21;

// Gets GitHub token from special token file.
function getGitHubToken(path) {
  try {
    return fs.readFileSync(path, 'utf8').trim();
  } catch (err) {
    console.error('Please put .token file into the root of the repo or define ' +
                  'GITHUB_AUTH_TOKEN environment variable with GitHub auth token.');
  }
}

// Fetches number of contributions to repos by these users from GitHub API.
function getGitHubData(usersData, next) {
  var gh = new GitHub({ token: GITHUB_TOKEN });

  // Compute one week ago date to request commits from.
  var since = new Date();
  since.setDate(since.getDate() - NUM_SINCE_DAYS);

  // Get names array for easier access.
  var names = usersData.map(u => u.name);

  var userPromises = usersData.map(u => {
    var repoPromises = u.repos.map(r => {
      var rp     = r.split('/');
      var user   = rp[0];
      var repo   = rp[1];
      var ghRepo = gh.getRepo(user, repo);

      return ghRepo.listCommits({
        author: u.name,
        since:  since
      });
    });

    return Promise.all(repoPromises)
      .then(lists => {
        return lists.reduce((score, list) => score + list.data.length, 0);
      })
      .catch(err => {
        next(err);
      });
  });

  return Promise.all(userPromises)
    .then(scores => {
      return scores.map((score, i) => ({
        name:  names[i],
        score: score
      }));
    })
    .catch(err => {
      next(err);
    });
}

var app = express();

app.use(express.static(PUBLIC_DIR_PATH));

// Data provider for client's visualization.
app.get('/data', (req, res, next) => {
  fs.readFile(DATA_JSON_PATH, 'utf8', (err, json) => {
    if (err) next(err);

    // Parse JSON data with users and repos to be scanned from GitHub.
    var usersData = JSON.parse(json);

    // Get contributions data.
    getGitHubData(usersData, next)
      .then(data => {
        res.json(data);
      });
  });
});

// Global error handler.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err.message);
});

app.listen(process.env.PORT || DEFAULT_PORT);
