var gutil = require( 'gulp-util' );
var path = require('path');
var os = require('os');
var through = require('through2');

module.exports = function (desiredLineEnding) {

    if (desiredLineEnding == null) {
        desiredLineEnding = os.EOL;
    }

    var regexp;
    switch (desiredLineEnding) {
        case "\n":
            // Carriage return characters should not be present
            regexp = new RegExp("\r");
            break;
        case "\r\n":
            // Look for any carriage returns without a line feed, or any line feeds without a preceding carriage return
            regexp = new RegExp("(\r(?!\n)|[^\r]\n)");
            break;
        case "\r":
            // Line feed characters should not be present
            regexp = new RegExp("\n");
            break;
        default:
            this.emit('error', new gutil.PluginError('gulp-eol-enforce', 'Invalid line ending type'));
    }

    var transform = through.obj(function(file, encoding, callback) {
        var filename;

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError('gulp-eol-enforce', 'gulp-eol-enforce does not support streams'));
            return callback(null, file);
        }

        if (typeof file === 'string') {
            filename = file;
        } else if (typeof file.path === 'string') {
            filename = path.relative(file.cwd, file.path);
        } else {
            filename = '';
        }

        if (file.isBuffer()) {
            var str = file.contents.toString();

            if (regexp.test(str)) {
                this.badFiles.push(filename);
            }
        }

        return callback(null, file);
    });

    transform.badFiles = [];

    transform.on('finish', function() {
        if (this.badFiles.length > 0) {
            gutil.log(gutil.colors.cyan('Invalid line endings detected in:'));
            for (var i = 0; i < this.badFiles.length; i++) {
                gutil.log(' - ' + gutil.colors.magenta(this.badFiles[i]));
            }

            this.emit('error', new gutil.PluginError('gulp-eol-enforce', {
                message: 'Invalid line endings detected',
                showStack: false
            }));
        }
    });

    return transform;
};
