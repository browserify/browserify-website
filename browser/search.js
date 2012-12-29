module.exports = Search;

var http = require('http');
var JSONStream = require('JSONStream');
var through = require('through');

var hyperglue = require('hyperglue');
var html = {
    result : require('./html/result')
};

function Search (target) {
    if (!(this instanceof Search)) return new Search(target);
    var elements = this.elements = {
        form: target.querySelector('form'),
        query: target.querySelector('.query'),
        results: target.querySelector('.results'),
        featured: target.querySelector('.results .featured'),
        testling: target.querySelector('.results .testling'),
        npm: target.querySelector('.results .npm')
    };
    
    this.elements.form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        
        elements.testling.innerHTML = '';
        elements.npm.innerHTML = '';
        show(elements.results);
        
        var q = encodeURIComponent(elements.query.value);
        http.get({ path : '/search.json?query=' + q }, function (res) {
            if (!/^2../.test(res.statusCode)) {
                var err = '';
                res.on('data', function (buf) { err += buf });
                res.on('end', function () { onerror(err) });
                return;
            }
            res.on('error', onerror);
            
            var parser = JSONStream.parse([ true ]);
            parser.pipe(through(write, end));
            res.pipe(parser);
        });
    });
    
    function onerror (err) {
        console.log('error: ' + err);
    }
    
    function write (pkg) {
        var div = hyperglue(html.result, {
            '.name a' : {
              href : 'https://npmjs.org/package/' + pkg.name,
              _text : pkg.name,
            },
            '.description' : pkg.description
        });
        var hasBadge = Math.random() * 5 <= 1;
        if (hasBadge) {
            hyperglue(div, {
                '.badge img' : {
                    src : 'http://ci.testling.com/substack/ever.png'
                },
                '.badge a' : {
                    href : 'http://ci.testling.com/substack/ever'
                }
            });
            show(div.querySelector('.github'));
        }
        
        if (hasBadge && Math.random() * 3 <= 1) {
            elements.featured.appendChild(div);
            show(div.querySelector('.featured'));
        }
        else if (hasBadge) {
            elements.testling.appendChild(div);
        }
        else {
            if (Math.random() > 0.5) {
                show(div.querySelector('.github'));
            }
            elements.npm.appendChild(div);
        }
    }
    
    function end () {
    }
}

Search.prototype.focus = function () {
    this.elements.query.focus();
};

function hide (e) { e.style.display = 'none' }
function show (e) {
    e.style.display = e.tagName === 'div'
        ? 'block' : 'inline'
    ;
}
