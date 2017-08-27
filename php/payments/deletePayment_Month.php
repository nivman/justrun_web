<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {

    $customers = $db->prepare("DELETE FROM payments_month WHERE id = :payment_id");
    $customers->execute([
        'payment_id' => $_GET['id']
    ]);
    $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
    json_encode($customers);
}





