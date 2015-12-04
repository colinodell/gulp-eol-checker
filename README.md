# gulp-eol-enforce

[![status](https://img.shields.io/travis/colinodell/gulp-eol-enforce.svg)](https://travis-ci.org/colinodell/gulp-eol-enforce)
[![npm version](https://img.shields.io/npm/v/gulp-eol-enforce.svg)](https://www.npmjs.com/package/gulp-eol-enforce)
![dependencies](https://img.shields.io/david/colinodell/gulp-eol-enforce.svg)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![downloads](https://img.shields.io/npm/dt/gulp-eol-enforce.svg)](https://www.npmjs.com/package/gulp-eol-enforce)

Checks line endings to ensure they're the proper type.  This plugin will fail if undesired line endings are found.  Particularly useful as a pre-commit hook.

## Usage

```js
eol(desiredNewLine)
```

`desiredNewLine` can be one of the following strings:

 - `"\n"`
 - `"\r\n"`
 - `"\r"`

This parameter defaults to your platform's default line ending (`os.EOL`).

Use this in your Gulpfile.js like so:

```js
var eol = require('gulp-eol-enforce');

gulp.task('eol', function () {
  return gulp.src(['src/**/*.{css,js}'])
    .pipe(eol('\n'));
});
```

Example output:

![](example.png)

## Automatic Correction

This plugin **does not** automatically fix line endings - use [gulp-eol](https://www.npmjs.com/package/gulp-eol) or [gulp-line-ending-corrector](https://www.npmjs.com/package/gulp-line-ending-corrector) instead.
