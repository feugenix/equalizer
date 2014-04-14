var bee = require('beeline'),
    fs = require('fs');

var router = bee.route({
    '/node_modules/`path...`': bee.staticDir(
        './node_modules',
        {
            '.js': 'application/javascript'
        }
    ),
    '/sounds/`(.*)$`': bee.staticDir(
        './sounds',
        {
            '.wav': 'audio/wav'
        }
    ),
    '/js/`(.*)$`': bee.staticDir(
        './js',
        {
            '.js': 'application/javascript'
        }
    ),
    '/ /audio.html': function(req, res) {

        fs.readFile('audio.html', { encoding: 'utf-8' }, function(err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });

    }
});

require('http')
    .createServer(router)
        .listen(8001);

console.log('localhost:8001');
