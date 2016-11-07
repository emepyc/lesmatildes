var express = require("express");
var serveStatic = require('serve-static');
var path = require("path");

var app = express();

app
    .use(serveStatic(__dirname + "/../app"))
    // Enable HTML5Mode
    .all('/*', function(req, res) {
        // Just send the index.html for other files to support HTML5Mode
        res.sendFile(path.normalize(__dirname + '/../app/index.html'));
    })
    .listen(8000);

console.log("Connected to 127.0.0.1:8000");
