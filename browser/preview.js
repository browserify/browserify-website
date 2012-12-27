var EventEmitter = require('events').EventEmitter;
var hyperglue = require('hyperglue');

var catchLinks = require('./catch_links');
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
        self.show(ix++ % self.length);
    }
    
    target.addEventListener('mouseover', function () {
        clearInterval(iv);
        iv = null;
    });
    
    target.addEventListener('mouseout', function () {
        if (!iv) iv = setInterval(interval, 5000);
    });
}

Preview.prototype = new EventEmitter;

Preview.prototype.push = function (doc) {
    var self = this;
    var index = self.length ++;
    var div = hyperglue(html, {
        '.title a' : {
            href : '/' + doc.title.replace(/[^A-Za-z0-9]+/g, '_'),
            _text : doc.title
        },
        '.index' : '[' + index + ']'
    });
    if (self.length === 1) {
        div.className = 'preview active';
    }
    catchLinks(div, function (href) {
        self.emit('link', href);
    });
    
    var left = div.querySelector('.arrow.left');
    left.addEventListener('click', function () {
        self.show((index - 1 + self.length) % self.length);
    });
    var right = div.querySelector('.arrow.right');
    right.addEventListener('click', function () {
        self.show((index + 1) % self.length);
    });
    
    self.target.appendChild(div);
};

Preview.prototype.show = function (ix) {
    var prev = this.target.querySelector('.preview.active');
    if (prev) prev.className = 'preview';
     
    var div = this.target.childNodes[ix++ % this.length];
    div.className = 'preview active';
};
