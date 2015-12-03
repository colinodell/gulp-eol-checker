var gulpEolChecker = require('../');
var sinon = require('sinon');
var File = require('gulp-util').File;
var Buffer = require('buffer').Buffer;
require('mocha');

describe('gulp-eol-enforce', function() {
    var sampleContent = {
        'windows': 'Hello\r\nWorld!',
        'linux': 'Hello\nWorld!',
        'mac': 'Hello\rWorld!',
        'mixed': 'Hello\rWorld\n!\r\n'
    };

    testFiles(gulpEolChecker('\n'), sampleContent.windows, false);
    testFiles(gulpEolChecker('\n'), sampleContent.linux, true);
    testFiles(gulpEolChecker('\n'), sampleContent.mac, false);
    testFiles(gulpEolChecker('\n'), sampleContent.mixed, false);

    testFiles(gulpEolChecker('\r'), sampleContent.windows, false);
    testFiles(gulpEolChecker('\r'), sampleContent.linux, false);
    testFiles(gulpEolChecker('\r'), sampleContent.mac, true);
    testFiles(gulpEolChecker('\r'), sampleContent.mixed, false);

    testFiles(gulpEolChecker('\r\n'), sampleContent.windows, true);
    testFiles(gulpEolChecker('\r\n'), sampleContent.linux, false);
    testFiles(gulpEolChecker('\r\n'), sampleContent.mac, false);
    testFiles(gulpEolChecker('\r\n'), sampleContent.mixed, false);

    function testFiles(stream, content, shouldBeValid) {
        it('should test the line endings', function (done) {
            var spy = sinon.spy();
            stream.on('error', spy);

            stream.on('data', function() {
                if (!shouldBeValid) {
                    sinon.assert.calledOnce(spy);
                } else {
                    sinon.assert.notCalled(spy);
                }

                return done();
            });

            var file = new File({
                cwd: '/tmp/test/',
                base: '/tmp/test',
                path: '/tmp/test/foo.txt',
                contents: new Buffer(content)
            });
            file.index = 0;
            stream.write(file);

            stream.end();
        });
    }
});
