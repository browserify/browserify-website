var EventEmitter = require('events').EventEmitter;
var hyperglue = require('hyperglue');

var html = require('./html/article.js');
var catchLinks = require('catch-links');

module.exports = Article;

function Article (target) {
    if (!(this instanceof Article)) return new Article(target);
    this.target = target;
    this.articles = [];
    this.name = 'articles';
}

Article.prototype = new EventEmitter;

Article.prototype.push = function (doc) {
    var self = this;
    var name = doc.title.replace(/[^A-Za-z0-9]+/g, '_');
    
    var div = hyperglue(html, {
        '.title a' : {
            name : name,
            href : '/' + name,
            _text : doc.title
        },
        '.commit' : doc.commit,
        '.author' : doc.author,
        '.date' : doc.date,
        '.body' : { _html : doc.body }
    });
    if (self.name === 'articles') {
        div.style.display = 'block';
        div.className = 'article summary';
    }
    else {
        div.style.display = name === self.name ? 'block' : 'none';
    }
    catchLinks(div, function (href) {
        self.emit('link', href);
    });
    
    self.articles.push({ name : name, element : div, doc : doc });
    self.target.appendChild(div);
};

Article.prototype.show = function (href) {
    var name = href.replace(/^\//, '');
    this.name = name;
    
    for (var i = 0; i < this.articles.length; i++) {
        var article = this.articles[i];
        if (name === 'articles') {
            article.element.style.display = 'block';
            article.element.className = 'article summary';
        }
        else {
            var d = name === article.name ? 'block' : 'none';
            article.element.style.display = d;
            article.element.className = 'article';
        }
    }
};
