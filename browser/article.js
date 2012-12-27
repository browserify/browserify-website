var EventEmitter = require('events').EventEmitter;
var hyperglue = require('hyperglue');

var html = require('./html/article.js');
var catchLinks = require('./catch_links');

module.exports = Article;

function Article (target) {
    if (!(this instanceof Article)) return new Article(target);
    this.target = target;
    this.articles = [];
    this.name = 'articles';
    this._waiting = [];
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
    div.style.display = name === self.name || self.name === 'articles'
        ? 'block' : 'none'
    ;
    catchLinks(div, function (href) {
        self.emit('link', href);
    });
    
    self.articles.push({ name : name, element : div, doc : doc });
    self.target.appendChild(div);
};

Article.prototype.end = function () {
    this.ready = true;
    var ws = this._waiting.splice(0);
    for (var i = 0; i < ws.length; i++) {
        this.get.apply(this, ws[i]);
    }
};

Article.prototype.get = function (href, cb) {
    if (!this.ready) return this._waiting.push([href,cb]);
    var name = href.replace(/^\//, '');
    for (var i = 0; i < this.articles.length; i++) {
        var article = this.articles[i];
        if (article.name === name) return cb(article);
    }
    cb();
};

Article.prototype.show = function (href) {
    var name = href.replace(/^\//, '');
    this.name = name;
    
    for (var i = 0; i < this.articles.length; i++) {
        var article = this.articles[i];
        var display = name === 'articles' || name === article.name
            ? 'block' : 'none';
        article.element.style.display = display;
    }
};
