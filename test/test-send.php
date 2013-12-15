<?php

require(__DIR__.'/Swift-5.0.3/lib/swift_required.php');

$message = Swift_Message::newInstance()

  // Give the message a subject
  ->setSubject('Test Emailer : ' . uniqid())

  // Set the From address with an associative array
  ->setFrom(array('john@doe.com' => 'John Doe'))

  // Set the To addresses with an associative array
  ->setTo(array('receiver@domain.org', 'other@domain.org' => 'A name'))

  // Give it a body
  ->setBody('Here is the message itself
  Now this body is bit more complex

  -- etc

.
')

  // And optionally an alternative body
  ->addPart('<p><b>Here is the bold</b><i> and now italic</i></p>
  <p>this message has more realer html</p>', 'text/html')
//
  // Optionally add any attachments
  ->attach(Swift_Attachment::fromPath(__DIR__.'/test-send.js'))
  ;

$transport = Swift_SmtpTransport::newInstance('127.0.0.1', 2500);

$mailer = Swift_Mailer::newInstance($transport);

$result = $mailer->send($message);

var_dump($result);