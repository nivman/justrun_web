<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {


    $customers = $db->prepare("SELECT * FROM payments WHERE user_id = :user_id AND YEAR(payment_date) = :year");
    $customers->execute([
        'user_id' => $_GET['user_id'],
        'year' => $_GET['year']
    ]);
    $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
    $counter = count($customers);


    if ($counter == 1) {
        $customers = $db->prepare("DELETE FROM payments WHERE id = :payment_id");
        $customers->execute([
            'payment_id' => $_GET['id']
        ]);
        $customers = $customers->fetchAll(PDO::FETCH_ASSOC);

        $customers = $db->prepare("DELETE FROM payments_month WHERE user_id = :user_id  AND YEAR(payment_date) = :year");
        $customers->execute([
            'user_id' => $_GET['user_id'],
            'year' => $_GET['year']
        ]);
        $customers = $customers->fetchAll(PDO::FETCH_ASSOC);


    } else {
        $customers = $db->prepare("DELETE FROM payments WHERE id = :payment_id");
        $customers->execute([
            'payment_id' => $_GET['id']
        ]);
        $customers = $customers->fetchAll(PDO::FETCH_ASSOC);


        $total = $_GET['total'];
        switch ($_GET['month']) {
            case '1':
                $set_string = 'SET jun =';
                $month = 'jun';
                break;
            case '2':
                $set_string = 'SET feb =';
                $month = 'feb';
                break;
            case '3':
                $set_string = 'SET mar =';
                $month = 'mar';
                break;
            case '4':
                $set_string = 'SET apr =';
                $month = 'apr';
                break;
            case '5':
                $set_string = 'SET may =';
                $month = 'may';
                break;
            case '6':
                $set_string = 'SET june =';
                $month = 'june';
                break;
            case '7':
                $set_string = 'SET july =';
                $month = 'july';
                break;
            case '8':
                $set_string = 'SET aug =';
                $month = 'aug';
                break;
            case '9':
                $set_string = 'SET sept =';
                $month = 'sept';
                break;
            case '10':
                $set_string = 'SET oct =';
                $month = 'oct';
                break;
            case '11':
                $set_string = 'SET nov =';
                $month = 'nov';
                break;
            case '12':
                $set_string = 'SET decm =';
                $month = 'decm';
                break;
        }

        $sqlstring = "UPDATE payments_month " . $set_string . "(" . $month . " - :total) WHERE user_id = :user_id  AND YEAR(payment_date) = :year";
        $customers = $db->prepare($sqlstring);
        $customers->execute([
            'total' => $total,
            'user_id' => $_GET['user_id'],
            'year' => $_GET['year']
        ]);
        $customers = $customers->errorInfo();
    }
}



