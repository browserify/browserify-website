var http = require('http');
var JSONStream = require('JSONStream');
var through = require('through');

http.get({ path : '/blog.json?inline=html' }, function (res) {
    var parser = JSONStream.parse([ true ]);
    var articles = document.querySelector('#articles');
    
    parser.pipe(through(function (doc) {
        var div = createArticle(doc);
        articles.appendChild(div);
    }));
    res.pipe(parser);
});

function createArticle (doc) {
    var outer = document.createElement('div');
    outer.className = 'article';
    
    var title = document.createElement('div');
    title.className = 'title';
    
    var anchor = document.createElement('a');
    var name = doc.title.replace(/[^A-Za-z0-9]+/g,'_');
    
    anchor.className = 'anchor';
    anchor.setAttribute('name', name);
    anchor.setAttribute('href', '#' + name);
    anchor.textContent = doc.title;
    
    title.appendChild(anchor);
    outer.appendChild(title);
    
    var div = document.createElement('div');
    div.className = 'inner';
    outer.appendChild(div);
    
    var commit = document.createElement('div');
    commit.className = 'commit';
    commit.textContent = doc.commit;
    div.appendChild(commit);
    
    var author = document.createElement('div');
    author.className = 'author';
    author.textContent = doc.author;
    div.appendChild(author);
    
    var date = document.createElement('div');
    date.className = 'date';
    date.textContent = doc.date;
    div.appendChild(date);
    
    var body = document.createElement('div');
    body.className = 'body';
    div.appendChild(body);
    
    body.innerHTML = doc.body;
    
    return outer;
}
