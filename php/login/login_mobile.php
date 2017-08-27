<?php
require "../functions/jwt.php";//already have connection.php inside
$not  = file_get_contents('sign_in.html');

$password = $_POST["password"];
$username = $_POST["username"];





$userInfo = $db->prepare("SELECT password,istemp,temppassword,token FROM users WHERE username = :username");
    $userInfo->execute([
        'username' => $username
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
                    echo json_encode($not);
                }
            } else {
                echo json_encode($not);
            }
        }
    } else {
        echo json_encode($not);
   }

