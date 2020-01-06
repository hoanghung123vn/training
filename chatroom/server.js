const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
var cache = {};

var send404 = res => {
    res.writeHead(404, { 'Content-Type': "text/plain" });
    res.write('Error 404: Resource not found!');
    res.end();
}

var sendFile = (res, filePath, fileContent) => {
    res.writeHead(200, { 'Content-Type': mime.getType(path.basename(filePath)) });
    res.end(fileContent);
}

var serveStatic = (res, cache, absPath) => {
    if (cache[absPath]) {
        sendFile(res, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, exists => {
            if (exists) {
                fs.readFile(absPath, (err, data) => {
                    if (err) {
                        send404(res);
                    } else {
                        cache[absPath] = data;
                        sendFile(res, absPath, data);
                    }
                });
            } else {
                send404(res);
            }
        })
    }
}

var server = http.createServer((req, res) => {
    var filePath = false;
    if (req.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + req.url;
    }
    var absPath = './' + filePath;
    serveStatic(res, cache, absPath);
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
})
