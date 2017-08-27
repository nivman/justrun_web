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

    $short_goal = $data->entity->short_goal;
    $long_goal = $data->entity->long_goal;
    $date_goal = $data->entity->date_goal;

    if (!isset($short_goal)){
        $short_goal = "";
    }

    if (!isset($long_goal)){
        $long_goal = "";
    }

    if (!isset($date_goal)){
        $date_goal = new DateTime('now');
    }


    $sqlstring = "INSERT INTO goals(user_id,date_goal,short_goal,long_goal) VALUES (:user_id,:date_goal,:short_goal,:long_goal)";
    $customers = $db->prepare($sqlstring);
    $customers->execute([
        'user_id' => $data->user_id,
        'date_goal' => $date_goal,
        'short_goal' => $short_goal,
        'long_goal' => $long_goal
    ]);
    $last_id = $db->lastInsertId();
    echo $last_id;
}
