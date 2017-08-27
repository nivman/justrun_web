<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {

    $actionname = $_GET['actionname'];

    switch ($actionname) {
        case 'all':
            $start = $_GET['start'];
            $end = $_GET['end'];
            $customers = $db->prepare("SELECT * FROM payments ORDER BY id DESC LIMIT :start,:end ");
            $customers->bindValue(':start', $start);
            $customers->bindValue(':end', $end);
            $customers->execute();
            $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
            echo ")]}'\n";
            echo json_encode($customers);
            break;
        case 'byuser':
            $start = $_GET['start'];
            $end = $_GET['end'];
            $user_id = $_GET['user_id'];
            $customers = $db->prepare("SELECT * FROM payments WHERE user_id =:user_id ORDER BY id DESC  LIMIT :start,:end");
            $customers->bindValue(':user_id', $user_id);
            $customers->bindValue(':start', $start);
            $customers->bindValue(':end', $end);
            $customers->execute();
            $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
            echo ")]}'\n";
            echo json_encode($customers);
            break;
        case 'byuserid':
            $user_id = $_GET['user_id'];
            $year = $_GET['year'];
            $customers = $db->prepare("SELECT * FROM payments WHERE user_id =:user_id AND YEAR(payment_date) =:year ORDER BY id DESC");
            $customers->bindValue(':user_id', $user_id);
            $customers->bindValue(':year', $year);
            $customers->execute();
            $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
            echo ")]}'\n";
            echo json_encode($customers);
            break;
        case 'totalbyuser':
            $user_id = $_GET['user_id'];
            $customers = $db->prepare("SELECT SUM(total) FROM payments WHERE user_id =:user_id");
            $customers->bindValue(':user_id', $user_id);
            $customers->execute();
            $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
            echo ")]}'\n";
            echo json_encode($customers);
            break;
        case 'byid':
            $id = $_GET['id'];
            $customers = $db->prepare("SELECT * FROM payments WHERE id = :id  ORDER BY id DESC LIMIT 1");
            $customers->bindValue(':id', $id);
            $customers->execute();
            $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
            echo ")]}'\n";
            echo json_encode($customers);
            break;
    }

}
