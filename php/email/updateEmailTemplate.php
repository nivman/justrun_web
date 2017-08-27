<?php
require "../functions/jwt.php";//already have connection.php inside
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {

    $fileData = file_get_contents("php://input");
    $data = json_decode($fileData);


    $sqlstring = "UPDATE emailTemplate SET html = :html WHERE id = :id";
    $customers = $db->prepare($sqlstring);
    $customers->execute([
        'html' => $data->html,
        'id' => $data->id
    ]);
    $customers = $customers->errorInfo();
    echo json_encode($customers);
}
