<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    $year = $_GET['year'];
    $customers = $db->prepare("SELECT * FROM payments_month WHERE YEAR(payment_date) = :year   ");
    $customers->bindValue(':year', $year);
    $customers->execute();
    $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
    echo ")]}'\n";
    echo json_encode($customers);
}