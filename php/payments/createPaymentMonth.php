<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    $errors = array();
    $dataarr = array();


    $fileData = file_get_contents("php://input");
    $data = json_decode($fileData);

    $user_id = $data->user_id;
    $year = $data->year;

    $customers = $db->prepare("SELECT id FROM payments_month WHERE user_id =:user_id  AND YEAR(payment_date) = :year");
    $customers->execute([
        'user_id' => $user_id,
        'year' => $year
    ]);
    $payments = $customers->fetch(PDO::FETCH_ASSOC);
    $payment_id = $payments['id'];

    $first_name = $data->first_name;
    $last_name = $data->last_name;


    if (!isset($first_name)){
        $first_name = "";
    }

    if (!isset($last_name)){
        $last_name = "";
    }


    if (count($payment_id) == 1) {
        $sqlstring = "UPDATE payments_month SET jun =jun + :jun,feb =feb + :feb,mar =mar + :mar,apr =apr + :apr,may =may + :may,june =june + :june,
                                            july =july + :july,aug =aug + :aug,sept =sept + :sept,oct =oct + :oct,nov =nov + :nov,decm =decm + :decm WHERE id = $payment_id";
        $customers = $db->prepare($sqlstring);
        $customers->execute([
            'jun' => $data->months[0],
            'feb' => $data->months[1],
            'mar' => $data->months[2],
            'apr' => $data->months[3],
            'may' => $data->months[4],
            'june' => $data->months[5],
            'july' => $data->months[6],
            'aug' => $data->months[7],
            'sept' => $data->months[8],
            'oct' => $data->months[9],
            'nov' => $data->months[10],
            'decm' => $data->months[11],
        ]);
        $customers = $customers->errorInfo();
        echo json_encode($customers);
    } else {
        $sqlstring = "INSERT INTO payments_month(user_id,first_name,last_name,jun,feb,mar,apr,may,june,july,aug,sept,oct,nov,decm,payment_date) 
VALUES (:user_id,:first_name,:last_name,:jun,:feb,:mar,:apr,:may,:june,:july,:aug,:sept,:oct,:nov,:decm,:payment_date)";
        $customers = $db->prepare($sqlstring);
        $customers->execute([
            'user_id' => $data->user_id,
            'first_name' => $first_name,
            'last_name' => $last_name,
            'jun' => $data->months[0],
            'feb' => $data->months[1],
            'mar' => $data->months[2],
            'apr' => $data->months[3],
            'may' => $data->months[4],
            'june' => $data->months[5],
            'july' => $data->months[6],
            'aug' => $data->months[7],
            'sept' => $data->months[8],
            'oct' => $data->months[9],
            'nov' => $data->months[10],
            'decm' => $data->months[11],
            'payment_date' => $data->payment_date
        ]);
        $last_id = $db->lastInsertId();
        $customers = $customers->errorInfo();
        echo $last_id;

    }
}



