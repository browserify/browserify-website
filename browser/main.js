var JSONStream = require('JSONStream');
var http = require('http');

var divs = {
    splash : document.querySelector('#splash'),
    articles : document.querySelector('#articles'),
    articleBox : document.querySelector('#article-box'),
    previews : document.querySelector('#previews'),
    previewBox : document.querySelector('#preview-box'),
    search : document.querySelector('#search')
};

var articles = require('./article')(divs.articles);
var previews = require('./preview')(divs.previews);
var search = require('./search')(divs.search);

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

var singlePage = require('single-page');
var showPage = singlePage(function (href, page) {
    hide(divs.articleBox);
    hide(divs.search);
    hide(divs.splash);
    show(divs.previewBox);
    
    if (href === '/') {
        show(divs.splash);
    }
    else if (href === '/search') {
        hide(divs.previewBox);
        show(divs.search);
        search.focus();
    }
    else {
        show(divs.articleBox);
        articles.show(href);
    }
    process.nextTick(function () {
        window.scrollTo(page.scrollX, page.scrollY);
    });
    
    function hide (e) { e.style.display = 'none' }
    function show (e) { e.style.display = 'block' }
});

var catchLinks = require('catch-links');
catchLinks(document, showPage);
articles.on('link', showPage);
previews.on('link', showPage);
