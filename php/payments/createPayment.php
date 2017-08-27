<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    $fileData = file_get_contents("php://input");
    $data = json_decode($fileData);

    $errors = array();
    $dataarr = array();

    $first_name = $data->first_name;
    $last_name = $data->last_name;


    if (!isset($first_name)){
        $first_name = "";
    }

    if (!isset($last_name)){
        $last_name = "";
    }


    try {
        $sqlstring = "INSERT INTO payments(first_name,total,last_name,payment_type,payment_for,payment_date,is_paid,user_id,receipt_type) 
	VALUES (:first_name,:total,:last_name,:payment_type,:payment_for,:payment_date,:is_paid,:user_id,:receipt_type)";
        $customers = $db->prepare($sqlstring);
        $customers->execute([
            'first_name' => $first_name,
            'total' => $data->entity->total,
            'last_name' => $last_name,
            'payment_type' => $data->entity->payment_type,
            'payment_for' => $data->entity->payment_for,
            'receipt_type' => $data->entity->receipt_type,
            'payment_date' => $data->entity->payment_date,
            'is_paid' => $data->entity->is_paid,
            'user_id' => $data->user_id
        ]);
        $last_id = $db->lastInsertId();
        $customers = $customers->errorInfo();
        echo $last_id;
    }
    catch(PDOException $e)
    {
        error_log($e->getMessage(), 0);
    }
}

