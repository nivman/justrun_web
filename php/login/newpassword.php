<?php
require "../functions/jwt.php";//already have connection.php inside


$data     = json_decode(file_get_contents("php://input"));
$username = $data->username;
$password = $data->password;

$userInfo = $db->prepare("SELECT id FROM users WHERE username = ?");
$userInfo->bindValue(1, $username);
$userInfo->execute();
if ($userInfo->rowCount() == 0) {
    echo "usernameTaken";
} else {
    $temppassword = "";
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
     $sql = "UPDATE users SET password = :password, temppassword = :temppassword,istemp = 0 WHERE username = :username";
    $stmt = $db->prepare($sql);
$stmt->execute(["username" => $username, "password" => $password_hash, "temppassword"=> $temppassword ]);
    $stmt = $stmt->errorInfo();
}
