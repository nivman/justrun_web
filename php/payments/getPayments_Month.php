<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    $year = $_GET['year'];
    $actionname = $_GET['actionname'];
    switch ($actionname) {
        case 'all':
            $start = $_GET['start'];
            $end = $_GET['end'];
            $customers = $db->prepare("SELECT * FROM payments_month WHERE YEAR(payment_date) = :year ORDER BY first_name  LIMIT :start,:end  ");
            $customers->bindValue(':start', $start);
            $customers->bindValue(':end', $end);
            $customers->bindValue(':year', $year);
            $customers->execute();
            $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
            echo ")]}'\n";
            echo json_encode($customers);
            break;
        case 'byid':
            $user_id = $_GET['user_id'];
            $year = $_GET['year'];
            $customers = $db->prepare("SELECT * FROM payments_month WHERE user_id = :user_id AND YEAR(payment_date) = :year ORDER BY first_name LIMIT 1");
            $customers->bindValue(':user_id', $user_id);
            $customers->bindValue(':year', $year);
            $customers->execute();
            $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
            echo ")]}'\n";
            echo json_encode($customers);
            break;
    }
}