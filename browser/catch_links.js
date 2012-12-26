module.exports = function (root, cb) {
    var links = root.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
        var href = links[i].getAttribute('href');
        if (/^\/[^.\/]+$/.test(href)) {
            links[i].addEventListener('click', onclick(href));
        }
    }
    
    function onclick (href) {
        return function (ev) {
            ev.preventDefault();
            cb(href);
            return false;
        };
    }
};
