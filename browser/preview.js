var hyperglue = require('./hyperglue');
var html = require('./html/preview.js');

module.exports = Preview;

function Preview (target) {
    if (!(this instanceof Preview)) return new Preview(target);
    this.target = target;
}

Preview.prototype.push = function (doc) {
    var div = hyperglue(html, {
        '.title' : doc.title,
        '.image' : 'xxx'
    });
    this.target.appendChild(div);
};
