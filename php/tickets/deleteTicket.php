<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {


    $customers = $db->prepare("DELETE FROM tickets WHERE id = :ticket_id");
    $customers->execute([
        'ticket_id' => $_GET['ticket_id']
    ]);
    $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
    echo ")]}'\n";
    echo json_encode($customers);
}

