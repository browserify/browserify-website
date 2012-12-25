var JSONStream = require('JSONStream');
var http = require('http');

var articles = require('./article')(document.querySelector('#articles'));
var previews = require('./preview')(document.querySelector('#previews'));

http.get({ path : '/blog.json?inline=html' }, function (res) {
    var parser = JSONStream.parse([ true ]);
    
    parser.on('data', function (doc) {
        articles.push(doc);
        previews.push(doc);
    });
    res.pipe(parser);
});
