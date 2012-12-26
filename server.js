var http = require('http');
var glog = require('glog')(process.argv[3]);
var ecstatic = require('ecstatic')(__dirname + '/static');

var server = http.createServer(function (req, res) {
    if (glog.test(req.url)) {
        glog(req, res);
    }
    else if (/^\/[^\.\/]+$/.test(req.url)) {
        req.url = '/';
        ecstatic(req, res);
    }
    else ecstatic(req, res);
});
server.listen(Number(process.argv[2]));
