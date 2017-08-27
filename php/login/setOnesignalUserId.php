<?php
require "../functions/jwt.php";//already have connection.php inside

$data= json_decode(file_get_contents("php://input"));
$OneSignalAppId = $data->OneSignalAppId;
$username= $data->username;

	$q= "UPDATE  users SET OneSignalAppId =:OneSignalAppId WHERE username = :username";


		$query =$db->prepare($q);
		$execute = $query->execute(array(
			":OneSignalAppId" =>$OneSignalAppId,
			":username"=>$username
		
		));












echo "APPID_FROM_PHP  ".$OneSignalAppId ;