<?php
require "../functions/jwt.php";//already have connection.php inside
$not  = file_get_contents('sign_in.html');
    $data = json_decode(file_get_contents("php://input"));
    $password = $data->password;
    $username = $data->username;


$userInfo = $db->prepare("SELECT password,istemp,temppassword,token FROM users WHERE email = :email");
    $userInfo->execute([
        'email' => $username
    ]);
    $user_arr = $userInfo->fetchAll(PDO::FETCH_ASSOC);
    if (!empty($user_arr)) {
        $hash = $user_arr[0]["password"];
        $istemp = $user_arr[0]["istemp"];
        $temppassword = $user_arr[0]["temppassword"];
        if ($istemp == 1) {
            if (password_verify($password, $temppassword)) {
                echo "temppassword";
            }
        } else {
            if (!empty($hash)) {
                if (password_verify($password, $hash)) {
                    $token = $user_arr[0]["token"];
                    $response_arr = array('token'=>$token,'state'=>'home.dashboard');
                    echo json_encode($response_arr);
                } else {
                    echo ($not);
                }
            } else {
                echo ($not);
            }
        }
    } else {
        echo ($not);
   }

