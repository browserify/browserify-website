var hyperglue = require('./hyperglue');
var html = require('./html/article.js');

module.exports = Article;

function Article (target) {
    if (!(this instanceof Article)) return new Article(target);
    this.target = target;
}

Article.prototype.push = function (doc) {
    var name = doc.title.replace(/[^A-Za-z0-9]+/g, '_');
    var div = hyperglue(html, {
        '.title a' : {
            name : name,
            href : '#' + name,
            _text : doc.title
        },
        '.commit' : doc.commit,
        '.author' : doc.author,
        '.date' : doc.date,
        '.body' : { _html : doc.body }
    });
    this.target.appendChild(div);
};
