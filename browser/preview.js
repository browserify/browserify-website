var hyperglue = require('./hyperglue');
var html = require('./html/preview.js');

module.exports = Preview;

function Preview (target) {
    if (!(this instanceof Preview)) return new Preview(target);
    var self = this;
    self.target = target;
    self.length = 0;
    
    var iv = setInterval(interval, 5000);
    var ix = 0;
    function interval () {
        var prev = target.querySelector('.preview.active');
        if (prev) prev.className = 'preview';
        
        var div = target.childNodes[ix++ % self.length];
        div.className = 'preview active';
    }
    
    target.addEventListener('mouseover', function () {
        clearInterval(iv);
        iv = null;
    });
    
    target.addEventListener('mouseout', function () {
        if (!iv) iv = setInterval(interval, 5000);
    });
}

Preview.prototype.push = function (doc) {
    this.length ++;
    var div = hyperglue(html, {
        '.title' : doc.title,
        '.image' : 'xxx'
    });
    if (this.length === 1) {
        div.className = 'preview active';
    }
    this.target.appendChild(div);
};
