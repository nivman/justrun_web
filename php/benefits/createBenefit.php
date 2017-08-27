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

    $sqlstring = "INSERT INTO benefits(user_id,expire_date,used_date,benefit_name,total,client_name) VALUES (:user_id,:expire_date,:used_date,:benefit_name,:total,:client_name)";
    $customers = $db->prepare($sqlstring);
    $customers->execute([
        'user_id' => $data->user_id,
        'expire_date' => $data->entity->expire_date,
        'used_date' => $data->entity->used_date,
        'benefit_name' => $data->entity->benefit_name,
        'total' => $data->entity->total,
        'client_name' => $data->client_name
    ]);
    $customers = $customers->errorInfo();
    echo json_encode($customers);
}