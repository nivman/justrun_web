<?php
require  "../functions/jwt.php";

$headers = apache_request_headers();
if (!empty($headers['Authorization'])){
    $auth = $headers['Authorization'];
    $header = explode(" ",$headers['Authorization']);
    valid_user($header[1]);
}

