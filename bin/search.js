var JSONStream = require('JSONStream');
var stringify = JSONStream.stringify();
stringify.pipe(process.stdout);

var search = require('../lib/search');
search(process.argv.slice(2).join(' ')).pipe(stringify);
