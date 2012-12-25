var http = require('http');
var JSONStream = require('JSONStream');
var hyperglue = require('./hyperglue');

http.get({ path : '/blog.json?inline=html' }, function (res) {
    var parser = JSONStream.parse([ true ]);
    var articles = document.querySelector('#articles');
    
    parser.on('data', function (doc) {
        var div = createArticle(doc);
        articles.appendChild(div);
    });
    res.pipe(parser);
});

var templates = {
    article : require('./html/article.js')
};

function createArticle (doc) {
    var name = doc.title.replace(/[^A-Za-z0-9]+/g,'_');
    return hyperglue(templates.article, {
        '.title a' : {
            name : '#' + name,
            href : '#' + name,
            _text : doc.title
        },
        '.commit' : doc.commit,
        '.author' : doc.author,
        '.date' : doc.date,
        '.body' : { _html : doc.body }
    });
}
