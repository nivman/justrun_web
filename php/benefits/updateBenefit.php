<?php
require "../functions/jwt.php";//already have connection.php inside

if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    $fileData = file_get_contents("php://input");
    $data = json_decode($fileData);


    $sqlstring = "UPDATE benefits SET expire_date = :expire_date,used_date = :used_date,benefit_name = :benefit_name,total = :total,client_name = :client_name WHERE id = :benefit_id";
    $customers = $db->prepare($sqlstring);
    $customers->execute([
        'expire_date' => $data->entity->expire_date,
        'used_date' => $data->entity->used_date,
        'benefit_name' => $data->entity->benefit_name,
        'total' => $data->entity->total,
        'client_name' => $data->entity->client_name,
        'benefit_id' => $data->entity->id
    ]);
    $customers = $customers->errorInfo();
    echo json_encode($customers);
}
