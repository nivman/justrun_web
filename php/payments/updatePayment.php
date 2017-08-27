<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {

    $fileData = file_get_contents("php://input");
    $data = json_decode($fileData);

    $year_new = $data->year;
    $month_new = $data->month;
    $total_new = (int)$data->total;
    $user_id = $data->user_id;
    $date = $data->date;
    $first_name = $data->first_name;
    $last_name = $data->last_name;

    $customers = $db->prepare("SELECT total,YEAR(payment_date) as year_old,MONTH(payment_date) as month_old FROM payments WHERE id = :id");
    $customers->execute([
        'id' => $data->payment_id
    ]);
    $data_old = $customers->fetchAll(PDO::FETCH_ASSOC);
    $year_old = $data_old[0]['year_old'];
    $month_old = $data_old[0]['month_old'];
    $total_old = (int)($data_old[0]['total']);


    $sqlstring = "UPDATE payments SET payment_date = :payment_date,payment_for = :payment_for,receipt_type= :receipt_type,payment_type = :payment_type,total = :total,is_paid = :is_paid WHERE id = :id";
    $customers = $db->prepare($sqlstring);
    $customers->execute([
        'payment_date' => $date,
        'payment_for' => $data->for_payment,
        'payment_type' => $data->type,
        'receipt_type' => $data->receipt_type,
        'total' => $data->total,
        'is_paid' => $data->is_paid,
        'id' => $data->payment_id
    ]);
    $customers = $customers->errorInfo();


    $payment_month_new = "";
    $set_string_new = "";
    $payment_month_old = "";
    $set_string_month_old = "";

    switch ($month_new) {
        case '1':
            $set_string_new = 'SET jun =';
            $payment_month_new = 'jun';
            break;
        case '2':
            $set_string_new = 'SET feb =';
            $payment_month_new = 'feb';
            break;
        case '3':
            $set_string_new = 'SET mar =';
            $payment_month_new = 'mar';
            break;
        case '4':
            $set_string_new = 'SET apr =';
            $payment_month_new = 'apr';
            break;
        case '5':
            $set_string_new = 'SET may =';
            $payment_month_new = 'may';
            break;
        case '6':
            $set_string_new = 'SET june =';
            $payment_month_new = 'june';
            break;
        case '7':
            $set_string_new = 'SET july =';
            $payment_month_new = 'july';
            break;
        case '8':
            $set_string_new = 'SET aug =';
            $payment_month_new = 'aug';
            break;
        case '9':
            $set_string_new = 'SET sept =';
            $payment_month_new = 'sept';
            break;
        case '10':
            $set_string_new = 'SET oct =';
            $payment_month_new = 'oct';
            break;
        case '11':
            $set_string_new = 'SET nov =';
            $payment_month_new = 'nov';
            break;
        case '12':
            $set_string_new = 'SET decm =';
            $payment_month_new = 'decm';
            break;
    }


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

//If user change the date but only the month
    if ($month_new != $month_old || $year_new != $year_old) {
        //get delta total from old total old - month
        $customers = $db->prepare("SELECT " . $payment_month_old . " FROM payments_month WHERE user_id = :user_id  AND YEAR(payment_date) = :year_old");
        $customers->execute([
            'user_id' => $user_id,
            'year_old' => $year_old,
        ]);
        $payment_month_new_total = (int)$customers->fetchColumn(0) - (int)$total_old;


        //substract the old total from the month before the change
        $sqlstring_month = "UPDATE payments_month " . $set_string_month_old . $payment_month_new_total . " WHERE user_id = :user_id  AND YEAR(payment_date) = :year_old";
        $customers = $db->prepare($sqlstring_month);
        $customers->execute([
            'user_id' => $user_id,
            'year_old' => $year_old,
        ]);

        //find if there is a record for the new year - if has use the id - if doesn't need to insert a new record
        $customers = $db->prepare("SELECT id FROM payments_month WHERE user_id = :user_id  AND YEAR(payment_date) = :year_new");
        $customers->execute([
            'user_id' => $user_id,
            'year_new' => $year_new,
        ]);
        $id_month = $customers->fetchColumn(0);


        //if he doesn't add new record to the new year
        if ($id_month == false) {
            $sqlstring = "INSERT INTO payments_month(user_id,first_name,last_name,jun,feb,mar,apr,may,june,july,aug,sept,oct,nov,decm,payment_date) VALUES(:user_id,:first_name,:last_name,0,0,0,0,0,0,0,0,0,0,0,0,:payment_date)";
            $customers = $db->prepare($sqlstring);
            $customers->execute([
                'user_id' => $user_id,
                'first_name' => $first_name,
                'last_name' => $last_name,
                'payment_date' => $date
            ]);
            $last_id = $db->lastInsertId();
            $customers = $customers->errorInfo();

            $sqlstring = "UPDATE payments_month " . $set_string_new . ":total WHERE id = :id";
            $customers = $db->prepare($sqlstring);
            $customers->execute([
                'total' => $total_new,
                'id' => $last_id
            ]);
        } else {
            $sqlstring = "UPDATE payments_month " . $set_string_new . ":total + " . $payment_month_new . " WHERE id = :id";
            $customers = $db->prepare($sqlstring);
            $customers->execute([
                'total' => $total_new,
                'id' => $id_month
            ]);
        }
    } else {

        $total_delta = (int)$total_new - (int)$total_old;

        $sqlstring = "UPDATE payments_month " . $set_string_new . ":total +" . $payment_month_new . " WHERE user_id = :user_id  AND YEAR(payment_date) = :year_new";
        $customers = $db->prepare($sqlstring);
        $customers->execute([
            'total' => $total_delta,
            'user_id' => $user_id,
            'year_new' => $year_new,
        ]);
        $customers = $customers->errorInfo();
    }
}


