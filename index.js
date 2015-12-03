var path = require('path');
var PluginError = require('gulp-util').PluginError;
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
            this.emit('error', new PluginError('gulp-eol-checker', 'Invalid line ending type'));
    }

    function TransformStream (file, encoding, callback) {
        var filename;

        if (file.isStream()) {
            this.emit('error', new PluginError('gulp-eol-checker', 'gulp-eol-checker does not support streams'));
            return callback(null, file);
        }

        if (typeof file === 'string') {
            filename = file;
        } else if (typeof file.path === 'string') {
            filename = path.basename(file.path);
        } else {
            filename = '';
        }

        if (file.isBuffer()) {
            var str = file.contents.toString();

            if (regexp.test(str)) {
                this.emit('error', new PluginError('gulp-eol-checker', 'File ' + filename + ' contains invalid line endings'));
            }
        }

        return callback(null, file);
    }

    return through.obj(TransformStream);
};
