<?php
require "../functions/jwt.php";//already have connection.php inside

$data = json_decode(file_get_contents("php://input"));

$username = $data->username;



$userInfo = $db->prepare("SELECT email FROM users WHERE email = :email");
$userInfo->execute([
	'email'=>$username
]);
$userInfo = $userInfo->fetchAll();


if(count($userInfo)==1){
$random_password =  bin2hex(openssl_random_pseudo_bytes(4));

$password = password_hash($random_password, PASSWORD_DEFAULT);


   $sql = "UPDATE users SET password = :password, temppassword = :temppassword,istemp = 1 WHERE  email = :user_name";
   $stmt = $db->prepare($sql);
   $stmt->execute( ['user_name' => $username,'password' => $password,'temppassword'=>  $password]);
$headers = "From: JustRun";
$title="Enter New Password ";
$msg = "  הסיסמה הזמנית שלך היא: ".$random_password ."\n\n כדי להיכנס חזרה למערכת יש להזין את הסיסמא הזמנית ובחלון שיפתח להכניס סיסמא קבועה";
mail('eladshw@gmail.com',$title,$msg,$headers);
}
else
{
echo "nomail";
}

