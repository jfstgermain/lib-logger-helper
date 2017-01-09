# Using this module in other modules

Your project `gulpfile.js` should initially look like this:

```js
const gulp          = require('gulp');
const gulpBootstrap = require("lib-gulp-bootstrap");

gulpBootstrap.bindBaseTasks(gulp);

```

For the moment, the source directory is expected to be `/src`.  The transpiled code (including tests) will be outputted to `/dist`. If need be, this could be configurable eventually.

Make sure the `main` entry in `package.json` points to the execution entry point of the app eg:
`"main": "dist/lib/index.js"`.  See the `dev` task description below.

- Gulp tasks provided by the module - 
1. `gulp lint`: runs the typescript linter