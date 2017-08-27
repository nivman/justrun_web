<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {

    $start = $_GET['start'];
    $end = $_GET['end'];
    $customers = $db->prepare("SELECT * FROM tickets ORDER BY id DESC limit :start,:end ");
    $customers->bindValue(':start', $start);
    $customers->bindValue(':end', $end);
    $customers->execute();
    $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
    echo ")]}'\n";
    echo json_encode($customers);
}