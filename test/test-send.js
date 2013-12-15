
var nodemailer = require("nodemailer");
var fs = require('fs');

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    host: '127.0.0.1',
    port: 2500
});

Array.prototype.randomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
};

var froms = [
    "Fred Foo ✔ <foo@blurdybloop.com>",
    "joe@hippityhop.com",
    "billyg@ms.net"
];

var tos = [
    "Fred Foo ✔ <foo@blurdybloop.com>",
    "<corporate@quoo.com>, joe@hippityhop.com",
    "joe@hippityhop.com",
    "billyg@ms.net, Balmer <b@ms.net>"
];

var subjects = [
    'Your TPS report is overdue',
    'I\'m gonna need you to work this weekend, mk?',
    'Lorem Ipsum. Dollar amet, franc-n-sense',
    'Hello ✔ special marks!'
];

var texts = [
    "Hello world ✔",
    " ✔ Item one\n ✔ Item two\n ✔ Item 3\n"
];

var htmls = [
    fs.readFileSync(__dirname+'/index.html', "utf8"),
    "<b>Hello world ✔</b>",
    "<p>✔ Item one<p>✔ Item two<p>✔ Item 3\n"
];

// setup e-mail data with unicode symbols
var mailOptions = {
    from: froms.randomElement(), // sender address
    to: tos.randomElement(), // list of receivers
    subject: subjects.randomElement(), // Subject line
    text: texts.randomElement(), // plaintext body
    html: htmls.randomElement() // html body
};

// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }
    smtpTransport.close(); // shut down the connection pool, no more messages
});
