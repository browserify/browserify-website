var npmSearch = require('npm-package-search');
var mkdirp = require('mkdirp');

mkdirp.sync(__dirname + '/../data');
var search = npmSearch(__dirname + '/../data/npm.json', {
    interval : 5 * 60 * 1000
});

module.exports = function (query, cb) {
    search(query, cb);
};
