<?php
// Simple contact form handler for Coruja Janota
// Place this file in the same folder as index.html (e.g., /web/contact.php).

header('Content-Type: text/html; charset=utf-8');

// Basic anti-CSRF/anti-spam (honeypot)
if (!empty($_POST['website'])) {
  http_response_code(400);
  echo "Spam detected.";
  exit;
}

// Required fields
$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$org     = trim($_POST['org'] ?? '');
$subject = trim($_POST['subject'] ?? 'Website contact');
$message = trim($_POST['message'] ?? '');
$consent = isset($_POST['consent']);

// Validate
if (!$name || !$email || !$message || !$consent) {
  http_response_code(400);
  echo "Please fill in the required fields.";
  exit;
}

// Very basic email validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo "Invalid email address.";
  exit;
}

// Construct email
$to      = "office@corujajanota.eu";
$from    = "office@corujajanota.eu"; // keep From aligned with your domain for SPF/DKIM
$replyTo = $email;
$ip      = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

$body = "New message from Coruja Janota website\n\n"
      . "Name: $name\n"
      . "Email: $email\n"
      . "Organisation: $org\n"
      . "Subject: $subject\n"
      . "Message:\n$message\n\n"
      . "Sender IP: $ip\n";

$headers  = "From: Coruja Janota <".$from.">\r\n";
$headers .= "Reply-To: ".$replyTo."\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Send
$ok = @mail($to, "Website contact: ".$subject, $body, $headers);

if ($ok) {
  echo "<!DOCTYPE html><html><head><meta charset='utf-8'><meta http-equiv='refresh' content='3;url=index.html'><title>Obrigado</title></head><body><p>Mensagem enviada com sucesso. Obrigado!</p><p>Vai ser redirecionado(a) à página inicial.</p></body></html>";
} else {
  http_response_code(500);
  echo "We couldn't send your message (mail server error). Please write to office@corujajanota.eu.";
}
?>