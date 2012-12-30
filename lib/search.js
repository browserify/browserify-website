var npmSearch = require('npm-package-search');
var mkdirp = require('mkdirp');
var githubFrom = require('github-from-package');
var testlingRepos = require('./testling_repos');

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
    search(query, function (err, results) {
        if (err) return cb(err);
        cb(null, results.map(function (pkg) {
            var m = /\bgithub.com\/([^\/]+\/[^\/]+)$/.exec(pkg.github);
            if (m && testlingRepos[m[1]]) {
                pkg.testling = m[1];
            }
            return pkg;
        }));
    });
};
