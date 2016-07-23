#!/bin/env node
var http, director, bot, router, server, port, db, express, app;


express = require('express');
app = express();
http = require('http');
director    = require('director');
bot         = require('./groupme_bots.js');

router = new director.http.Router({
  '/'    : {
    get: ping
  },
  '/init' : {
    get:  bot.init,
    post: bot.init
  },
  '/commands' : {
    get: bot.commands
  },
  '/bot/:botRoom' : {
    get: ping,
    post: bot.respond
  },
});

server = http.createServer(function (req, res) {
  req.chunks = [];

  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });

  router.dispatch(req, res, function(err) {
    res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
  });
});

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1");

http.createServer(app).listen(app.get('port') ,app.get('ip'), function () {
    console.log("✔ Express server listening at %s:%d ", app.get('ip'),app.get('port'));
    server();
});

// server.listen(port, ip);

function ping() {
  this.res.writeHead(200);
  this.res.end("I am a robot.");
}
