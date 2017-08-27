<?php
require "../functions/jwt.php";//already have connection.php inside

$data     = json_decode(file_get_contents("php://input"));
$username = $data->username;
$password = $data->password;
$not  = file_get_contents('sign_up.html');

$userInfo = $db->prepare("SELECT user_name FROM users WHERE user_name=?");
$userInfo->bindValue(1, $username);
$userInfo->execute();
if ($userInfo->rowCount() > 0) {
    echo json_encode($not);
} else {
    $key = create_key();
    $q       = "INSERT INTO users (user_name, password,token_key) VALUES(:user_name,:password,:token_key)";
    $query   = $db->prepare($q);
    $query->execute([
        'user_name' => $username,
        'password' => password_hash($password, PASSWORD_DEFAULT),
        'token_key' => $key
    ]);

    $last_id = $db->lastInsertId();
    $token =  create_jwt($last_id,$key);

    $q2       = "UPDATE users SET token = :token WHERE id = :id";
    $query   = $db->prepare($q2);
    $query->execute([
        'token'=>$token,
        'id'=>$last_id
    ]);
    $res_arr = array('page'=>'home.dashboard','token'=>$token);
    echo json_encode($res_arr);
}