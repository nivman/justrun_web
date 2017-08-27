<?php
require "../connection.php";
require ("../vendor/firebase/php-jwt/src/JWT.php");
use \Firebase\JWT\JWT;


function valid_user($token){
    global $db;
    $userInfo = $db->prepare("SELECT token_key FROM users WHERE token = :token LIMIT 1");
    $userInfo->execute([
        'token' => $token
    ]);
    $user_arr = $userInfo->fetchAll(PDO::FETCH_ASSOC);
    if (!empty($user_arr)) {
        $key = $user_arr[0]["token_key"];
        $decode_token = decode_jwt($token,$key);
        $id = $decode_token->id;
        if (!empty($id)){
            return true;
        }
    }else {
        http_response_code(401);
        return false;
    }
    http_response_code(401);
    return false;
}

function create_jwt ($id,$key){
    $token = array(
        "id" => $id
    );

    $jwt = JWT::encode($token, $key);
    return $jwt;
}

function create_key(){
    return $key = password_hash(bin2hex(openssl_random_pseudo_bytes(16)),PASSWORD_DEFAULT);
}

function decode_jwt($jwt,$key){
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        try {
            $decoded = JWT::decode($jwt, $key, array('HS256'));
            return $decoded;
        }
        catch(Exception $e) {
//        throw new Exception("Not Autorized!");
            http_response_code(401);
        }
    }
    return null;
}

function every_protected_page()
{
        $headers = apache_request_headers();
        if (!empty($headers['Authorization'])) {
            $header = explode(" ", $headers['Authorization']);
            	
            if (valid_user($header[1])) {
            
                return true;
            } else {
            
                return false;
            }

        } else {
            return false;
        }
}