<?php
require "../functions/jwt.php";//already have connection.php inside
require '../vendor/phpmailer/phpmailer/PHPMailerAutoload.php';
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    $fileData = file_get_contents("php://input");
    $data = json_decode($fileData);
    $email = $data->email;
    $name = $data->name;
    $gender = $data->gender;

    $dataarr = $db->prepare("SELECT html FROM emailTemplate WHERE type = :type LIMIT 1");
    $dataarr->execute(['type' => $gender]);
    $html = $dataarr->fetch(PDO::FETCH_ASSOC);
    $mail = new PHPMailer;
    $mail->isHTML(true);
    $mail->CharSet = 'UTF-8';
    $mail->setLanguage('he', '../vendor/phpmailer/phpmailer/language/phpmailer.lang-he.php');
    $mail->isSMTP();                                      // Set mailer to use SMTP
    $mail->Host = 'mail.nimadomain.com';  // Specify main and backup SMTP servers
    $mail->SMTPAuth = true;                               // Enable SMTP authentication
    $mail->Username = 'justrun@nimadomain.com';                 // SMTP username
    $mail->Password = 'MGYmBf-G7';                           // SMTP password
    $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
    $mail->Port = 587;                                    // TCP port to connect to

$mail->setFrom('justrun@justrun.co.il', 'JustRun');
    $mail->addAddress($email);     // Add a recipient
    $welcome = ' שלום '.$name;

    $message = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="HE">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Simples-Minimalistic Responsive Template</title>
   <body>
   <div>'.$welcome.'</div>
   '.$html['html'].'
    </body>
</html>
';
    $mail->Subject = 'ברוכים הבאים לפשוט לרוץ';
    $mail->Body    = $message;

    if(!$mail->send()) {
        echo 'Message could not be sent.';
        echo 'Mailer Error: ' . $mail->ErrorInfo;
        $mail -> clearAllRecipients();
    } else {
        echo 'Message has been sent';
        $mail -> clearAllRecipients();
    }

}
