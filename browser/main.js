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
    
    parser.on('end', function () {
        articles.end();
    });
    
    res.pipe(parser);
});

var cloneCode = document.querySelector('#clone .code');
cloneCode.textContent = cloneCode.textContent
    .replace(/\$REMOTE/, 'http://' + window.location.host + '/blog.git')
;

var singlePage = require('./single_page');
var showPage = singlePage(function (href) {
    if (href === '/') {
        show(divs.splash);
        hide(divs.articleBox);
    }
    else {
        hide(divs.splash);
        show(divs.articleBox);
        articles.show(href);
    }
    window.scrollTo(0);
    
    function hide (e) { e.style.display = 'none' }
    function show (e) { e.style.display = 'block' }
});

var catchLinks = require('./catch_links');
catchLinks(document, showPage);
articles.on('link', showPage);
previews.on('link', showPage);
