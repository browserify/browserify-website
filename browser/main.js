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

var catchLinks = require('./catch_links');
catchLinks(document, showPage);
articles.on('link', showPage);
previews.on('link', showPage);

var current = null;
function showPage (href) {
    href = href.replace(/^\/+/, '/');
    if (current === href) return;
    
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
    current = href;
    
    if (window.history && window.history.pushState) {
        var mismatched = window.location.pathname !== href;
        if (mismatched && href === '/') {
            window.history.pushState(null, 'browserify', '/');
        }
        else if (mismatched && href === '/articles') {
            window.history.pushState(null, 'browserify articles', 'articles');
        }
        else if (mismatched) {
            articles.get(href, function (article) {
                if (!article) return;
                var title = article.doc && article.doc.title || '';
                var name = article.name || '/';
                window.history.pushState(null, title, name);
            });
        }
    }
    else if (window.location.hash !== '#!' + href) {
        if (window.location.pathname !== '/') {
            window.location.href = '/#!' + href;
        }
        else {
            window.location.hash = '#!' + href;
        }
    }
}

window.addEventListener('hashchange', function () {
    var href = window.location.hash.replace(/^#!\/?/, '/');
    if (current !== href && /^#!/.test(window.location.hash)) {
        showPage(href);
    }
});

window.addEventListener('popstate', popstate);
function popstate () {
    var href = /^#!/.test(window.location.hash)
        ? window.location.hash.replace(/^#!/, '/')
        : window.location.pathname
    ;
    showPage(href);
}

if (window.history && window.history.pushState
&& /^#!/.test(window.location.hash)) {
}
else popstate();

function hide (e) { e.style.display = 'none' }
function show (e) { e.style.display = 'block' }
