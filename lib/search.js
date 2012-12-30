var npmSearch = require('npm-package-search');
var mkdirp = require('mkdirp');
var githubFrom = require('github-from-package');

mkdirp.sync(__dirname + '/../data');
var search = npmSearch(__dirname + '/../data/npm.json', {
    interval : 5 * 60 * 1000,
    filter : function (pkg) {
        var res = {
            name : pkg.name,
            description : pkg.description,
            keywords : pkg.keywords
        };
        var github = githubFrom(pkg);
        if (github) res.github = github;
        return res;
    }
});

module.exports = function (query, cb) {
    search(query, cb);
};
