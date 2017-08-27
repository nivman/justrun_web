<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    $errors = array();
    $dataarr = array();


    $fileData = file_get_contents("php://input");
    $data = json_decode($fileData);

    $sqlstring = "INSERT INTO tickets(client_name,type,total) VALUES (:client_name,:type,:total)";
    $customers = $db->prepare($sqlstring);
    $customers->execute([
        'client_name' => $data->client_name,
        'type' => $data->entity->type,
        'total' => $data->entity->total
    ]);
    $last_id = $db->lastInsertId();
    //$customers = $customers->errorInfo();
    echo json_encode($last_id);
}
