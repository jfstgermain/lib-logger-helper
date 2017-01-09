# Using this module in other modules

> Your project `gulpfile.js` should initially look like this:

```js
const gulp          = require('gulp');
const gulpBootstrap = require("lib-gulp-bootstrap");

gulpBootstrap.bindBaseTasks(gulp);

```