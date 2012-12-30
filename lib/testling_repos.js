var request = require('request');
var repos = {};

module.exports = repos;

update();
setInterval(update, 60 * 1000);

function update () {
    var opts = {
        uri: 'http://ci.testling.com/commits.json',
        json : true
    };
    request(opts, function (err, res, body) {
        if (err) return;
        body.forEach(function (row) {
            var key = row.key.replace(/\.git$/, '');
            repos[key] = true;
        });
    });
}
