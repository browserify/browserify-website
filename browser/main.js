var JSONStream = require('JSONStream');
var http = require('http');

var divs = {
    splash : document.querySelector('#splash'),
    articles : document.querySelector('#articles'),
    articleBox : document.querySelector('#article-box'),
    previews : document.querySelector('#previews')
};

var articles = require('./article')(divs.articles);
var previews = require('./preview')(divs.previews);

http.get({ path : '/blog.json?inline=html' }, function (res) {
    var parser = JSONStream.parse([ true ]);
    
    parser.on('data', function (doc) {
        articles.push(doc);
        previews.push(doc);
    });
    res.pipe(parser);
});

var cloneCode = document.querySelector('#clone-me .code');
cloneCode.textContent = cloneCode.textContent
    .replace(/\$REMOTE/, 'http://' + window.location.host + '/blog.git')
;

var pathname = window.location.pathname;
if (pathname === '/') {
    show(divs.splash);
    hide(divs.articleBox);
}
else {
    hide(divs.splash);
    show(divs.articleBox);
    articles.show(pathname.replace(/^\//,''));
}

function hide (e) { e.style.display = 'none' }
function show (e) { e.style.display = 'block' }
