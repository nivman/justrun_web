<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    $customers = $db->prepare("SELECT * FROM tests WHERE user_id = :user_id ORDER BY id DESC");
    $customers->execute(['user_id' => $_GET['user_id']]);
    $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
    echo ")]}'\n";
    echo json_encode($customers);
}