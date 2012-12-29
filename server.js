var http = require('http');
var glog = require('glog')(process.argv[3]);
var ecstatic = require('ecstatic')(__dirname + '/static');

var search = require('./lib/search');
var qs = require('querystring');

var server = http.createServer(function (req, res) {
    if (glog.test(req.url)) return glog(req, res);
    
    if (req.url.split('?')[0] === '/search.json') {
        var params = qs.parse(req.url.split('?')[1]);
        
        search(params.query, function (err, results) {
            if (err) {
                res.statusCode = 400;
                res.end(err);
            }
            else {
                res.setHeader('content-type', 'application/json');
                res.end(JSON.stringify(results));
            }
        });
        return;
    }
    
    if (/^\/[^\.\/]+$/.test(req.url)) {
        req.url = '/';
    }
    ecstatic(req, res);
});
server.listen(Number(process.argv[2]));
