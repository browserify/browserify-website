var packages = require('../data/pkg.json');
var quotemeta = require('quotemeta');

module.exports = function (query, cb) {
    var re;
    if (/^\//.test(query) && /\/$/.test(query)) {
        try {
            re = new RegExp(query)
        }
        catch (err) {
            return cb(err);
        }
    }
    else {
        re = {};
        var words = query.split(/\s+/).map(function (word) {
            return new RegExp(quotemeta(word));
        });
        re.test = function (s) {
            for (var i = 0; i < words.length; i++) {
                if (!words[i].test(s)) return false;
            }
            return true;
        };
    }
    
    cb(null, packages.filter(function (pkg) {
        return re.test(pkg.name + ' ' + pkg.description + ' ' + pkg.keywords);
    }));
};
