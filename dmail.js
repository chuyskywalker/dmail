"use strict"

var argv = require('optimist')
    .usage('"Developer Email" -- SMTP Daemon with basic web functionality for catching and displaying emails.')
    .demand('q').alias('q', 'queue-size').describe('q', 'How many emails to hold in the queue') //.default('q', 15)
    .demand('s').alias('s', 'smtp-listen').describe('s', 'What port the SMTP server should listen on')//.default('s', 2500)
    .demand('h').alias('h', 'http-listen').describe('h', 'What port the HTTP server should listen on')//.default('h', 2501)
    //.demand('i').alias('i', 'http-listen').describe('i', 'What port the SocketIO server should listen on')//.default('i', 2502)
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
    //debug: true,
    requireAuthentication: false,
    enableAuthentication: true
}, function(req){

    var mailparser = new MailParser();
    mailparser.on("end", function(mail_object){
        counter++;
        console.log("Received ("+counter+"): ", mail_object.subject);
        //console.log(mail_object);
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

io.set('log level', 1);

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