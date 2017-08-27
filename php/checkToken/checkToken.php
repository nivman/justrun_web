<?php
require "../connection.php";
$data = json_decode(file_get_contents("php://input"));
$token = $data-> token;

$check = $db->prepare("SELECT id FROM users WHERE token = :token");
$check->execute([
	'token'=>$token
]);
$check = $check->fetchColumn(0);
if(count($check)==1)
{
	echo json_encode($token);
}else
{
	echo "unAuthorized";
}

