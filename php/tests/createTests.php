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

    $sqlstring = "INSERT INTO tests(user_id,test_date,distance,time) VALUES (:user_id,:test_date,:distance,:time)";
    $customers = $db->prepare($sqlstring);
    $customers->execute([
        'user_id' => $data->user_id,
        'test_date' => $data->entity->test_date,
        'distance' => $data->entity->distance,
        'time' => $data->entity->time
    ]);
    $last_id = $db->lastInsertId();
    echo $last_id;

}