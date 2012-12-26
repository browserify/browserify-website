var hyperglue = require('./hyperglue');
var html = require('./html/article.js');

module.exports = Article;

function Article (target) {
    if (!(this instanceof Article)) return new Article(target);
    this.target = target;
    this.articles = {};
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
    div.style.display = name === this.name || this.name === 'articles'
        ? 'block' : 'none'
    ;
    
    this.articles[name] = div;
    this.target.appendChild(div);
};

Article.prototype.show = function (name) {
    this.name = name;
    
    for (var key in articles) {
        articles[key].style.display
        = name === 'articles' || name === key
            ? 'block' : 'none';
    }
};
