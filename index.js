var NWBuilder = require('node-webkit-builder');
var through = require('through2');
var gutil = require('gulp-util');

var PluginError = gutil.PluginError;
var PLUGIN_NAME = 'gulp-webkit-builder';


var builder = function(options) {

    var options = options || {};

    var files = [];

    var stream = through.obj(function(file, encoding, next) {

        files.push(file.path);

        next();

    }, function(cb) {

        var self = this;

        options.files = files;

        var nw = new NWBuilder(options);

        nw.on('log', gutil.log);

        nw.build().then(function() {
                gutil.log('all done!');
                cb();
            }).catch(function(err) {
            self.emit('error', new PluginError(PLUGIN_NAME, 'Error occured while building app!'));
            return cb();
        });

    });

    return stream;
};

module.exports = builder;
