<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {


    $fileData = file_get_contents("php://input");
    $data = json_decode($fileData);


    $sunday = $data->entity->sunday;
    $monday = $data->entity->monday;
    $tuesday = $data->entity->tuesday;
    $wednesday = $data->entity->wednesday;
    $thursday = $data->entity->thursday;
    $friday = $data->entity->friday;
    $saturday = $data->entity->saturday;
    $user_id = $data->user_id;

    $sunday = ($sunday ? 1 : 0);
    $monday = ($monday ? 1 : 0);
    $tuesday = ($tuesday ? 1 : 0);
    $wednesday = ($wednesday ? 1 : 0);
    $thursday = ($thursday ? 1 : 0);
    $friday = ($friday ? 1 : 0);
    $saturday = ($saturday ? 1 : 0);


    $sqlstring = "INSERT INTO train_days(user_id,sunday,monday,tuesday,wednesday,thursday,friday,saturday) VALUES (:user_id,:sunday,:monday,:tuesday,:wednesday,:thursday,:friday,:saturday)";
    $customers = $db->prepare($sqlstring);
    $customers->execute([
        'user_id' => $user_id,
        'sunday' => $sunday,
        'monday' => $monday,
        'tuesday' => $tuesday,
        'wednesday' => $wednesday,
        'thursday' => $thursday,
        'friday' => $friday,
        'saturday' => $saturday
    ]);
    $customers = $customers->errorInfo();
    echo json_encode($customers);
}
