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

 - MailCatcher is way more fully featured. You probably want that unless
   you're interested in this from a learning perspective.
 - Attachments "work" in the sense that they come across the wire into
   the HTML page, but, uh, they don't render or anything. So there's that.
 - Rendering HTML emails "leaks" content into the page. IE: style elements
   just kinda show up. It's just `$jquery().html(content)` going on, so it's
   not quite the same level of robustness as what Gmail/MSN/Yahoo/etc.
   perform on HTML emails.
 - This is WILDLY insecure. XSS from HTML emails galore, no auth around it,
   etc, etc. It's really, truly only something you'd have on a dev machine.
   Maybe even that's pushing it ;)
