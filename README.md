# Overview

This is a static page with dynamic rating of GitHub contributors.
Some of [the most active GitHub users](https://gist.github.com/paulmillr/2657075/)
are chosen + author of this repo. Their activity on particular repos is measured
on weekly basis and put in a table.

The page is designed to motivate its author to work more on
pet projects and be as productive as one of the best programmers in the world.
After all, what's your rating fucking noob? Go and get shit done!

# Usage

- Put `.token` file into the root of the repo or define GITHUB_AUTH_TOKEN
environment variable.
- Edit `data.json` in order to setup contributors and repos to measure.
- Run `npm start` and open `http://localhost:1337` in your browser.

# Development

```
npm install
npm start
```
