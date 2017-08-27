<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {

    $fileData = file_get_contents("php://input");
    $data = json_decode($fileData);

    $customers = $db->prepare("SELECT total,YEAR(payment_date) as year_old,MONTH(payment_date) as month_old FROM payments WHERE id = :id");
    $customers->execute([
        'id' => $data->entity->payment_id
    ]);
    $data_old = $customers->fetchAll(PDO::FETCH_ASSOC);
    $year_old = $data_old[0]['year_old'];
    $month_old = $data_old[0]['month_old'];
    $total_old = (int)($data_old[0]['total']);
    $user_id = $data->entity->user_id;


    $sqlstring = "UPDATE payments SET payment_date = :payment_date,payment_for = :payment_for,payment_type = :payment_type,receipt_type= :receipt_type,total = :total,is_paid = :is_paid WHERE id = :id";
    $customers = $db->prepare($sqlstring);
    $customers->execute([
        'payment_date' => $data->entity->payment_date,
        'payment_for' => $data->entity->payment_for,
        'payment_type' => $data->entity->payment_type,
        'receipt_type' => $data->entity->receipt_type,
        'total' => $data->entity->total,
        'is_paid' => $data->entity->is_paid,
        'id' => $data->entity->payment_id
    ]);
    $customers = $customers->errorInfo();
    $month = $data->month;
    $total = $data->total;
    $set_string = "";
    $payment_month_old = "";
    $set_string_month_old = "";

    switch ($month_old) {
        case '1':
            $set_string_month_old = 'SET jun = ';
            $payment_month_old = 'jun';
            break;
        case '2':
            $set_string_month_old = 'SET feb = ';
            $payment_month_old = 'feb';
            break;
        case '3':
            $set_string_month_old = 'SET mar = ';
            $payment_month_old = 'mar';
            break;
        case '4':
            $set_string_month_old = 'SET apr = ';
            $payment_month_old = 'apr';
            break;
        case '5':
            $set_string_month_old = 'SET may = ';
            $payment_month_old = 'may';
            break;
        case '6':
            $set_string_month_old = 'SET june = ';
            $payment_month_old = 'june';
            break;
        case '7':
            $set_string_month_old = 'SET july = ';
            $payment_month_old = 'july';
            break;
        case '8':
            $set_string_month_old = 'SET aug = ';
            $payment_month_old = 'aug';
            break;
        case '9':
            $set_string_month_old = 'SET sept = ';
            $payment_month_old = 'sept';
            break;
        case '10':
            $set_string_month_old = 'SET oct = ';
            $payment_month_old = 'oct';
            break;
        case '11':
            $set_string_month_old = 'SET nov = ';
            $payment_month_old = 'nov';
            break;
        case '12':
            $set_string_month_old = 'SET decm = ';
            $payment_month_old = 'decm';
            break;
    }


    switch ($month) {
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

    $sqlstring = "SELECT " . $payment_month_old . " FROM payments_month WHERE user_id = :user_id  AND YEAR(payment_date) = :year_old";
    $customers = $db->prepare($sqlstring);
    $customers->execute([
        'user_id' => $user_id,
        'year_old' => $year_old,
    ]);
    $payment_month_new_total = (int)$customers->fetchColumn(0) - (int)$total_old;

    $sqlstring_month = "UPDATE payments_month " . $set_string_month_old . $payment_month_new_total . " WHERE user_id = :user_id  AND YEAR(payment_date) = :year_old";
    $customers = $db->prepare($sqlstring_month);
    $customers->execute([
        'user_id' => $user_id,
        'year_old' => $year_old,
    ]);


    $sqlstring = "UPDATE payments_month " . $set_string . ":total +" . $month . " WHERE user_id = :user_id  AND YEAR(payment_date) = :year";
    $customers = $db->prepare($sqlstring);
    $customers->execute([
        'total' => $total,
        'user_id' => $user_id,
        'year' => $data->year,
    ]);

}