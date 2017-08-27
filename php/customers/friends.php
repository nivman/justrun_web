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

    $actionname = $data->actionname;

    if (isset($_POST)) {
        $fileData = file_get_contents("php://input");
        $data = json_decode($fileData);

        $actionname = $data->actionname;
        switch ($actionname) {
            case 'insertfriends':
                $sqlstring = "INSERT INTO friends(user_id,friend_name,used,friend_date) VALUES (:user_id,:friend_name,:used,:friend_date)";
                $customers = $db->prepare($sqlstring);
                $customers->execute([
                    'user_id' => $data->user_id,
                    'friend_name' => $data->friend_name,
                    'used' => $data->used,
                    'friend_date' => $data->friend_date
                ]);
                $last_id = $db->lastInsertId();
                echo $last_id;
                break;

            case 'updatefriends':
                $sqlstring = "UPDATE friends SET used = :used WHERE id = :id";
                $customers = $db->prepare($sqlstring);
                $customers->execute([
                    'id' => $data->id,
                    'used' => $data->used
                ]);
                $customers = $customers->errorInfo();
                echo json_encode($customers);
                break;
            case 'deletefriends':
                $sqlstring = ("DELETE FROM friends WHERE id =:id LIMIT 1");
                $customers = $db->prepare($sqlstring);
                $customers->execute([
                    'id' => $data->id
                ]);
                $customers = $customers->errorInfo();
                echo json_encode($customers);
                break;
        }
    }
}