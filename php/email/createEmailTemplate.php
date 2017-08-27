<?php
require "../functions/jwt.php";//already have connection.php inside
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    $errors = array();
    $dataarr = array();


    $fileData = file_get_contents("php://input");
    $data = json_decode($fileData);

    $sqlstring = "INSERT INTO emailTemplate(email_json) VALUES (:email_json)";
    $customers = $db->prepare($sqlstring);
    $customers->execute([
        'email_json' => $data->email_json
    ]);
    $customers = $customers->errorInfo();
    echo json_encode($customers);
}