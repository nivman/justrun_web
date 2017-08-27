<?php
require "../functions/jwt.php";//already have connection.php inside
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    $type = $_GET['type'];

    $customers = $db->prepare("SELECT * FROM emailTemplate WHERE  type = :type LIMIT 1");
    $customers->execute(['type' => $type]);
    $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
    echo ")]}'\n";
    echo json_encode($customers);
}