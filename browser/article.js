var hyperglue = require('./hyperglue');
var html = require('./html/article.js');

module.exports = Article;

function Article (target) {
    if (!(this instanceof Article)) return new Article(target);
    this.target = target;
    this.articles = [];
    this.name = 'articles';
}

Article.prototype.push = function (doc) {
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
    div.style.display
    = name === this.name || this.name === 'articles'
        ? 'block' : 'none'
    ;
    
    this.articles.push({ name : name, element : div });
    this.target.appendChild(div);
};

Article.prototype.show = function (name) {
    this.name = name;
    
    for (var i = 0; i < this.articles.length; i++) {
        var article = this.articles[i];
        var display = name === 'articles' || name === article.name
            ? 'block' : 'none';
        article.element.style.display = display;
    }
};
