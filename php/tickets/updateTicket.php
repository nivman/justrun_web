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

    $actionname = $data->actionname;
    switch ($actionname) {
        case 'add':
            $sqlstring = "UPDATE tickets SET total = total + 1 WHERE id = :ticket_id";
            $customers = $db->prepare($sqlstring);
            $customers->execute([
                'ticket_id' => $data->ticket_id
            ]);
            $customers = $customers->errorInfo();
            echo json_encode($customers);
            break;

        case 'subtract':
            $sqlstring = "UPDATE tickets SET total = total - 1 WHERE id = :ticket_id";
            $customers = $db->prepare($sqlstring);
            $customers->execute([
                'ticket_id' => $data->ticket_id
            ]);
            $customers = $customers->errorInfo();
            echo json_encode($customers);
            break;
        case 'update':
            $sqlstring = "UPDATE tickets SET total = :total  WHERE id = :ticket_id";
            $customers = $db->prepare($sqlstring);
            $customers->execute([
                'ticket_id' => $data->ticket_id,
                'total' => $data->total
            ]);
            $customers = $customers->errorInfo();
            echo json_encode($customers);
            break;
    }
}
