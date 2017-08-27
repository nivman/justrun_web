<?php
require "../functions/jwt.php";//already have connection.php inside
require ("../vendor/phpmailer/phpmailer/PHPMailerAutoload.php");


$funcname = "";

if(!empty($_GET['actionname'])) {
    $funcname = $_GET['actionname'];
    switch ($funcname) {
        case 'getimage':
            $customers = $db->prepare("SELECT image FROM profile_images WHERE user_id = :user_id");
            $customers->execute([
                'user_id'=>$_GET['user_id']
            ]);
            $customers->bindColumn(1, $image, PDO::PARAM_LOB);
            $customers->fetch(PDO::FETCH_BOUND);
            header("Content-Type: image");
            if (is_null($image)){
                $image = file_get_contents("http://ww4.msu.ac.zw/mainsite/wp-content/uploads/2015/05/default.gif");
            }
            echo $image ;
            break;
        case 'payments':
            $start = $_GET['start'];
            $end = $_GET['end'];
            $customers = $db->prepare("SELECT COUNT('client_first_name') FROM payments ORDER BY id ASC limit :start,:end ");
            $customers->bindValue(':start', $start);
            $customers->bindValue(':end', $end);
            $customers->execute();
            $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
            echo ")]}'\n";
            echo json_encode($customers);

            break;
        case 'email':
            $customers = $db->prepare("SELECT emailtemplate FROM config");
            $customers->execute();
            $customers->bindColumn(1, $email, PDO::PARAM_LOB);
            $customers->fetch(PDO::FETCH_BOUND);
            header("Content-Type: image");

            $mail = new PHPMailer;
//            $mail->isHTML(true);
            $mail->CharSet = 'UTF-8';
//            $mail->setLanguage('he', '../vendor/phpmailer/phpmailer/language/phpmailer.lang-he.php');
            $mail->isSMTP();                                      // Set mailer to use SMTP
            $mail->Host = 'mail.nimadomain.com';  // Specify main and backup SMTP servers
            $mail->SMTPAuth = true;                               // Enable SMTP authentication
            $mail->Username = 'justrun@nimadomain.com';                 // SMTP username
            $mail->Password = 'MGYmBf-G7';                           // SMTP password
            $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
            $mail->Port = 587;                                    // TCP port to connect to

            $mail->setFrom('justrun@justrun.co.il', 'JustRun');
            $mail->addAddress('nivman1980@gmail.com');

            $mail->Subject = 'תזכורת שיעור TRX';
            $mail->Body    = $email;

            if(!$mail->send()) {
                echo 'Message could not be sent.';
                echo 'Mailer Error: ' . $mail->ErrorInfo;
                $mail -> clearAllRecipients();
            } else {
                echo 'Message has been sent';
                $mail -> clearAllRecipients();
            }

            break;
        case 'reminder':
            $date =  date('Y-m-d', strtotime('+2 days'));
            $daysarrheb = array("Sunday"=>"ראשון", "Monday"=>"שני", "Tuesday"=>"שלישי","Wednesday"=>"רביעי", "Thursday"=>"חמישי", "Friday"=>"שישי", "Saturday"=>"שבת");
            $day = $daysarrheb[date('l', strtotime('+2 days'))];


            $dataarr = $db->prepare("SELECT events.event_id,events.event_time,trx.user_id,customers.email,customers.first_name,customers.last_name 
                                    FROM events 
                                    LEFT JOIN trx ON events.event_id = trx.event_id 
                                    LEFT JOIN customers ON customers.id = trx.user_id
                                    WHERE events.event_date =:date
                                    ");
            $dataarr->execute([
                'date' => $date
            ]);
            $dataarr = $dataarr->fetchAll(PDO::FETCH_ASSOC);
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


            foreach ($dataarr as $value) {
                $email = $value["email"];
                $event_id = $value["event_id"];
                $user_id = $value["user_id"];
                $time = $value["event_time"];
                $name = $value["first_name"] ." " .$value["last_name"];
                $newDate = date("d-m-Y", strtotime($date));

                $mail->addAddress($email);     // Add a recipient
                $url_approved = "http://176.32.230.53/nimadomain.com/php/trx/trxemailverification.php/?event_id=" . $event_id ."&userid=".$user_id."&approved=true";
                $url_canceled = "http://176.32.230.53/nimadomain.com/php/trx/trxemailverification.php/?event_id=" . $event_id ."&userid=".$user_id."&approved=false";
                $strmsg = ",שלום";
                $nametext = $name;
                $youraresign ="TRX הנך רשום לאימון";
                $indaytext =" ביום ". $day;
                $indatetext = " ". "בתאריך"  ." ". $newDate;
                $intimetext = " ". "בשעה"  ." ".$time;
                $pleaseapprvoedtext = "נא אשר השתתפות/אי השתתפות ";

                $new_time = $time;





                $message = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body>
<div name="trx-main" id="trx-main-containr" style="

    margin: 0 auto;
width:500px;
min-width:350px;
height:500px;
 background : -moz-linear-gradient(50% 0% -90deg,rgba(251, 252, 252, 1) 8.71%,rgba(204, 204, 204, 1) 100%);
  background : -webkit-linear-gradient(-90deg, rgba(251, 252, 252, 1) 8.71%, rgba(204, 204, 204, 1) 100%);
  background : -webkit-gradient(linear,50% 0% ,50% 100% ,color-stop(0.0871,rgba(251, 252, 252, 1) ),color-stop(1,rgba(204, 204, 204, 1) ));
  background : -o-linear-gradient(-90deg, rgba(251, 252, 252, 1) 8.71%, rgba(204, 204, 204, 1) 100%);
  background : -ms-linear-gradient(-90deg, rgba(251, 252, 252, 1) 8.71%, rgba(204, 204, 204, 1) 100%);
  background : linear-gradient(180deg, rgba(251, 252, 252, 1) 8.71%, rgba(204, 204, 204, 1) 100%);
  border-style : Solid;
  border-color : #CCCCCC;

  border-width : 2px;
   border-radius : 10px;
  -moz-border-radius : 10px;
  -webkit-border-radius : 10px;

    border-radius: 10px;
	
	
	">
<div id="trx-main-header" style="  background : -moz-linear-gradient(50% 100% 90deg,rgba(0, 159, 227, 1) 0%,rgba(13, 166, 230, 1) 4.09%,rgba(34, 178, 234, 1) 12.81%,rgba(49, 187, 237, 1) 22.56%,rgba(57, 191, 238, 1) 34.07%,rgba(60, 193, 239, 1) 51.69%,rgba(55, 190, 238, 1) 63.14%,rgba(40, 182, 235, 1) 77.11%,rgba(15, 168, 230, 1) 92.33%,rgba(0, 159, 227, 1) 100%);
  background : -webkit-linear-gradient(90deg, rgba(0, 159, 227, 1) 0%, rgba(13, 166, 230, 1) 4.09%, rgba(34, 178, 234, 1) 12.81%, rgba(49, 187, 237, 1) 22.56%, rgba(57, 191, 238, 1) 34.07%, rgba(60, 193, 239, 1) 51.69%, rgba(55, 190, 238, 1) 63.14%, rgba(40, 182, 235, 1) 77.11%, rgba(15, 168, 230, 1) 92.33%, rgba(0, 159, 227, 1) 100%);
  background : -webkit-gradient(linear,50% 100% ,50% 0% ,color-stop(0,rgba(0, 159, 227, 1) ),color-stop(0.0409,rgba(13, 166, 230, 1) ),color-stop(0.1281,rgba(34, 178, 234, 1) ),color-stop(0.2256,rgba(49, 187, 237, 1) ),color-stop(0.3407,rgba(57, 191, 238, 1) ),color-stop(0.5169,rgba(60, 193, 239, 1) ),color-stop(0.6314,rgba(55, 190, 238, 1) ),color-stop(0.7711,rgba(40, 182, 235, 1) ),color-stop(0.9233,rgba(15, 168, 230, 1) ),color-stop(1,rgba(0, 159, 227, 1) ));
  background : -o-linear-gradient(90deg, rgba(0, 159, 227, 1) 0%, rgba(13, 166, 230, 1) 4.09%, rgba(34, 178, 234, 1) 12.81%, rgba(49, 187, 237, 1) 22.56%, rgba(57, 191, 238, 1) 34.07%, rgba(60, 193, 239, 1) 51.69%, rgba(55, 190, 238, 1) 63.14%, rgba(40, 182, 235, 1) 77.11%, rgba(15, 168, 230, 1) 92.33%, rgba(0, 159, 227, 1) 100%);
  background : -ms-linear-gradient(90deg, rgba(0, 159, 227, 1) 0%, rgba(13, 166, 230, 1) 4.09%, rgba(34, 178, 234, 1) 12.81%, rgba(49, 187, 237, 1) 22.56%, rgba(57, 191, 238, 1) 34.07%, rgba(60, 193, 239, 1) 51.69%, rgba(55, 190, 238, 1) 63.14%, rgba(40, 182, 235, 1) 77.11%, rgba(15, 168, 230, 1) 92.33%, rgba(0, 159, 227, 1) 100%);
 
  background : linear-gradient(0deg, rgba(0, 159, 227, 1) 0%, rgba(13, 166, 230, 1) 4.09%, rgba(34, 178, 234, 1) 12.81%, rgba(49, 187, 237, 1) 22.56%, rgba(57, 191, 238, 1) 34.07%, rgba(60, 193, 239, 1) 51.69%, rgba(55, 190, 238, 1) 63.14%, rgba(40, 182, 235, 1) 77.11%, rgba(15, 168, 230, 1) 92.33%, rgba(0, 159, 227, 1) 100%);
border-top-left-radius: 7px;
    border-top-right-radius: 7px;
    width: 100%;
	 height : 60px;
    text-align: center;

"
>
<div class="trx-title" style="
 font-weight : bold;
  font-size : 30px;
  letter-spacing : 1.11px;
  color : #FFFFFF;
 padding-top:5px;
  text-shadow : 7.82px 5.22px 5.22px rgba(0, 56, 81, 0.47);
      width: 100%;
  
    text-align: center;"

>
שלום לך <label >'.$strmsg.'</label></div>
</div>
<div class="trx-inner-body" style=" 
     float: left;
    width: 100%;
    text-align: center;">
<div style="margin-bottom:20px;
 font-weight : bold;
  font-size : 20px;
  line-height : 32.49px;
 
  color : #808080;
  color : rgb(128, 128, 128);"> '.$youraresign.'</div>
<div style="margin-bottom:7px;
 font-weight : bold;
  font-size : 20px;
  line-height : 32.49px;
 
  color : #808080;
  color : rgb(128, 128, 128);"

> '.$indaytext.'</div>
<div  style="margin-bottom:7px;
 font-weight : bold;
  font-size : 20px;
  line-height : 32.49px;
 
  color : #808080;
  color : rgb(128, 128, 128);"> '.$indatetext.'</div>
<div  style="margin-bottom:7px;
  font-size : 20px;
  line-height : 32.49px;
 font-weight : bold;
  color : #808080;
  color : rgb(128, 128, 128);"> '.$new_time.' </div>
<div  style="margin-bottom:10px;
  font-size : 20px;
  line-height : 32.49px;
  font-weight : bold;
  color : #808080;
  color : rgb(128, 128, 128);"> '.$pleaseapprvoedtext.'</div>
<div  style="margin-bottom:10px;
  font-size : 20px;
  line-height : 32.49px;
  font-weight : bold;
  color : #808080;
  color : rgb(128, 128, 128);">,יום טוב  </div>
<div style="   font-weight : bold;
  font-size : 20px;
  line-height : 32.49px;
  color : #3FA9F5;
  font-weight : bold;
  color : rgb(63, 169, 245);"> פשוט לרוץ </div>
</div>
<div id="trx-main-body" style="    border-top: 320px solid white;
padding-bottom: 14px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;"></div>
	<div style="height:20px;"></div>
<div id="trx-main-footer" style="">
<button style="background : -moz-linear-gradient(50% 0% -90deg,rgba(0, 159, 227, 1) 0%,rgba(13, 166, 230, 1) 4.09%,rgba(34, 178, 234, 1) 12.81%,rgba(49, 187, 237, 1) 22.56%,rgba(57, 191, 238, 1) 34.07%,rgba(60, 193, 239, 1) 51.69%,rgba(55, 190, 238, 1) 63.14%,rgba(40, 182, 235, 1) 77.11%,rgba(15, 168, 230, 1) 92.33%,rgba(0, 159, 227, 1) 100%);
  background : -webkit-linear-gradient(-90deg, rgba(0, 159, 227, 1) 0%, rgba(13, 166, 230, 1) 4.09%, rgba(34, 178, 234, 1) 12.81%, rgba(49, 187, 237, 1) 22.56%, rgba(57, 191, 238, 1) 34.07%, rgba(60, 193, 239, 1) 51.69%, rgba(55, 190, 238, 1) 63.14%, rgba(40, 182, 235, 1) 77.11%, rgba(15, 168, 230, 1) 92.33%, rgba(0, 159, 227, 1) 100%);
  background : -webkit-gradient(linear,50% 0% ,50% 100% ,color-stop(0,rgba(0, 159, 227, 1) ),color-stop(0.0409,rgba(13, 166, 230, 1) ),color-stop(0.1281,rgba(34, 178, 234, 1) ),color-stop(0.2256,rgba(49, 187, 237, 1) ),color-stop(0.3407,rgba(57, 191, 238, 1) ),color-stop(0.5169,rgba(60, 193, 239, 1) ),color-stop(0.6314,rgba(55, 190, 238, 1) ),color-stop(0.7711,rgba(40, 182, 235, 1) ),color-stop(0.9233,rgba(15, 168, 230, 1) ),color-stop(1,rgba(0, 159, 227, 1) ));
  background : -o-linear-gradient(-90deg, rgba(0, 159, 227, 1) 0%, rgba(13, 166, 230, 1) 4.09%, rgba(34, 178, 234, 1) 12.81%, rgba(49, 187, 237, 1) 22.56%, rgba(57, 191, 238, 1) 34.07%, rgba(60, 193, 239, 1) 51.69%, rgba(55, 190, 238, 1) 63.14%, rgba(40, 182, 235, 1) 77.11%, rgba(15, 168, 230, 1) 92.33%, rgba(0, 159, 227, 1) 100%);
  background : -ms-linear-gradient(-90deg, rgba(0, 159, 227, 1) 0%, rgba(13, 166, 230, 1) 4.09%, rgba(34, 178, 234, 1) 12.81%, rgba(49, 187, 237, 1) 22.56%, rgba(57, 191, 238, 1) 34.07%, rgba(60, 193, 239, 1) 51.69%, rgba(55, 190, 238, 1) 63.14%, rgba(40, 182, 235, 1) 77.11%, rgba(15, 168, 230, 1) 92.33%, rgba(0, 159, 227, 1) 100%);
  background : linear-gradient(180deg, rgba(0, 159, 227, 1) 0%, rgba(13, 166, 230, 1) 4.09%, rgba(34, 178, 234, 1) 12.81%, rgba(49, 187, 237, 1) 22.56%, rgba(57, 191, 238, 1) 34.07%, rgba(60, 193, 239, 1) 51.69%, rgba(55, 190, 238, 1) 63.14%, rgba(40, 182, 235, 1) 77.11%, rgba(15, 168, 230, 1) 92.33%, rgba(0, 159, 227, 1) 100%);
   width : 45%;
  height : 58px;
  border-radius : 11px 12px 12px 11px  / 12px;
  -moz-border-radius : 11px 12px 12px 11px  / 12px;
  -webkit-border-radius : 11px 12px 12px 11px  / 12px;   font-weight : bold;
  font-size : 30px;
  color : #FFFFFF;
    margin-left: 10px;
    margin-right: 17px;
  color : rgb(255, 255, 255);     border: none;             " id="trx-approval-button"><a style="color: white !important;" href='.$url_approved.'>אישור</button>
<button style="     border: none; background : -moz-linear-gradient(50% 100% 90deg,rgba(164, 0, 0, 1) 0%,rgba(255, 0, 0, 1) 100%);
  background : -webkit-linear-gradient(90deg, rgba(164, 0, 0, 1) 0%, rgba(255, 0, 0, 1) 100%);
  background : -webkit-gradient(linear,50% 100% ,50% 0% ,color-stop(0,rgba(164, 0, 0, 1) ),color-stop(1,rgba(255, 0, 0, 1) ));
  background : -o-linear-gradient(90deg, rgba(164, 0, 0, 1) 0%, rgba(255, 0, 0, 1) 100%);
  background : -ms-linear-gradient(90deg, rgba(164, 0, 0, 1) 0%, rgba(255, 0, 0, 1) 100%);
  background : linear-gradient(0deg, rgba(164, 0, 0, 1) 0%, rgba(255, 0, 0, 1) 100%);
  width : 45%;
  height : 58px;
  border-radius : 13px 12px 12px 13px  / 12px;
  -moz-border-radius : 13px 12px 12px 13px  / 12px;
  -webkit-border-radius : 13px 12px 12px 13px  / 12px;  font-weight : bold;
  font-size : 30px;
  color : #FFFFFF;
  color : rgb(255, 255, 255); " id="trx-cancel-button"><a style="color: white !important;" href='.$url_canceled.'>ביטול</button>


</div>
</div>



</body>
</html>
';




                $mail->Subject = 'תזכורת שיעור TRX';
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
            break;
    }

}else{
    if(isset($_FILES)){
        $userid = 98;
        $file = $_FILES['file']['name'];
        $type = $_FILES['file']['type'];
        $tmpName = $_FILES['file']['tmp_name'];
        $file_size = $_FILES['file']['size'];

        $fp      = fopen($tmpName, 'r');
        $content = fread($fp, filesize($tmpName));
        $content = addslashes($content);
        fclose($fp);

        $sqlstring =" INSERT INTO customer_files(user_id,file,file_type,file_size,file_name)
  VALUES (:user_id,:file,:file_type,:file_size,:file_name)";

        $customers = $db->prepare($sqlstring);
        $customers->execute([
            'user_id'=>$userid,
            'file'=>$content,
            'file_type'=>$type,
            'file_size'=>$file_size,
            'file_name'=>$file
        ]);
        $customers = $customers->errorInfo();
        echo json_encode($customers);
    }




}






