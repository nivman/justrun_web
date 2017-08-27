<?php
require "../functions/jwt.php";//already have connection.php inside
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    $data = json_decode(file_get_contents("php://input"));
    $repeatevent = $data->repeatevent;
    $userInfo = $db->query("SELECT  * FROM calendar WHERE repeatevent ='$repeatevent'");
    $userInfo = $userInfo->fetchAll();
    echo json_encode($userInfo);
}