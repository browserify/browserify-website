var fs = require('fs');
var JSONStream = require('JSONStream');
var through = require('through');
var quotemeta = require('quotemeta');
var testling = require('../data/testling.json');

module.exports = function (query) {
    var parser = JSONStream.parse([ true ]);
    var tr = through(function (row) {
        if (re.test(row.name + ' ' + row.description + ' ' + row.keywords)) {
            this.emit('data', {
                name: row.name,
                description: row.description,
                github: 'todo',
                'testling-ci': false
            });
        }
    });
    parser.pipe(tr);
    
    var re;
    if (/^\//.test(query) && /\/$/.test(query)) {
        try {
            re = new RegExp(query)
        }
        catch (err) {
            process.nextTick(function () {
                tr.emit('error', err);
            });
            return tr;
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
    
    process.nextTick(function () {
        var stream = fs.createReadStream(__dirname + '/../data/npm.json');
        stream.pipe(parser);
    });
    
    return tr;
};
