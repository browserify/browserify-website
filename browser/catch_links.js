module.exports = function (root, cb) {
    var links = root.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var href = link.getAttribute('href');
        if (/^\/[^.\/]+$/.test(href) || link.host === window.location.host) {
            link.addEventListener('click', onclick(href));
        }
    }
    
    function onclick (href) {
        return function (ev) {
            if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) {
                return true;
            }
            ev.preventDefault();
            cb(href);
            return false;
        };
    }
};
