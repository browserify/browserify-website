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

var cloneCode = document.querySelector('#clone .code');
cloneCode.textContent = cloneCode.textContent
    .replace(/\$REMOTE/, 'http://' + window.location.host + '/blog.git')
;

var catchLinks = require('./catch_links');
catchLinks(document, showPage);
articles.on('link', showPage);
previews.on('link', showPage);

function showPage (href_) {
    var href = href_.replace(/^\/#!/, '/');
    if (href === '/') {
        show(divs.splash);
        hide(divs.articleBox);
    }
    else {
        hide(divs.splash);
        show(divs.articleBox);
        articles.show(href);
    }
    
    if (window.history && window.history.pushState) {
        var mismatched = window.location.pathname !== href;
        
        if (mismatched && href === '/articles') {
            window.history.pushState(null, 'browserify articles', 'articles');
        }
        else if (mismatched) {
            var article = articles.get(href) || {};
            var title = article.doc && article.doc.title || '';
            var name = article.name || '';
            window.history.pushState(null, title, name);
        }
    }
    else {
        window.location.hash = '#!' + href;
    }
}
showPage(/^#!/.test(window.location.hash)
    ? window.location.hash
    : window.location.pathname
);

function hide (e) { e.style.display = 'none' }
function show (e) { e.style.display = 'block' }
