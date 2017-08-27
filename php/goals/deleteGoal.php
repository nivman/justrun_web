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

    $sqlstring = ("DELETE FROM goals WHERE id =:id LIMIT 1");
    $customers = $db->prepare($sqlstring);
    $customers->execute([
        'id' => $data->id
    ]);
    $customers = $customers->errorInfo();
}
         