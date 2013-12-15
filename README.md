# dmail

Developer Email -- An SMTP and webserver for capturing and displaying 
emails during development

Inspired by [MailCatcher](http://mailcatcher.me/), and fueled by some 
weekend-warrior-coding.

![dmail](https://github.com/chuyskywalker/dmail/raw/master/preview.png)

## Usage

After fetching the git repo, jump in and...

```bash
npm install
node dmail.js -q5 -s2500 -h2501`
```

That's it. You'll have the daemon up and running in the foreground. 
You can point your SMTP senders at port 2500 and your browser at 2501 
and watch emails as they come in.

## Notes

MailCatcher is way, way more fully featured.
