"use strict"

var argv = require('optimist')
    .usage('"Developer Email" -- SMTP Daemon with basic web functionality for catching and displaying emails.')
    .demand('q').alias('q', 'queue-size').describe('q', 'How many emails to hold in the queue')
    .demand('s').alias('s', 'smtp-listen').describe('s', 'What port the SMTP server should listen on')
    .demand('h').alias('h', 'http-listen').describe('h', 'What port the HTTP server should listen on')
    .boolean('d').alias('d', 'debug').describe('d', 'Debug mode (quite verbose)')
    .argv
;

//
// SMTP Mail Server
//
var simplesmtp = require('simplesmtp');
var MailParser = require("mailparser").MailParser;

var mailset = [],
    counter = 0,
    queueMaxSize = argv.q
    ;

simplesmtp.createSimpleServer({
    SMTPBanner:"Devail",
    debug: argv.d,
    requireAuthentication: false,
    enableAuthentication: false
}, function(req){

    var mailparser = new MailParser();
    mailparser.on("end", function(mail_object){
        counter++;
        if (argv.d) {
            console.log("Received ("+counter+"): ", mail_object.subject);
        }
        mail_object.id = counter;
        mailset.unshift(mail_object);
        if (mailset.length > queueMaxSize) {
            mailset.pop();
        }
        if (io) {
            io.sockets.emit('mailset', mailset);
        }
    });
    req.pipe(mailparser);

    req.accept();

}).listen(argv.s);

//
// Web Server
//
var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);


if (!argv.d) {
    io.set('log level', 0);
}

app.use(express.logger());
app.use(express.compress());

app.get('/', function(req, res){
    res.sendfile('./lib/pages/index.html');
});

app.use('/res', express.static('./lib/pages/res'));

server.listen(argv.h);

io.sockets.on('connection', function (socket) {
    // automatically send out the mail set data
    socket.emit('mailset', mailset);
});

console.log("Running");