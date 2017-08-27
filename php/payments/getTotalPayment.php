<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {

    $fileData = file_get_contents("php://input");
    $data = json_decode($fileData);
    $where = "";
    $counter = -1;
    $year = $data->year;
    $in_firstname = array();
    $in_lastname = array();
    $firstnames = array();
    $array_to_execute = array();


//count how may 'AND' we need for sql query
    if (!empty($data->first_name)) {
        $counter++;
    }
    if (!empty($data->last_name)) {
        $counter++;
    }

    if (!empty($data->payment_type)) {
        $counter++;
    }

    if (!empty($data->payment_for)) {
        $counter++;
    }

    if (!empty($data->receipt_type)) {
        $counter++;
    }


    if (!empty($data->ispaid)) {
        $counter++;
    }

//END - count how may 'AND' we need for sql query

    if (!empty($data->first_name)) {
        $first_name = $data->first_name;
        foreach ($first_name as $value) {
            array_push($firstnames, $value->first_name);
        }
        $in_firstname = implode(',', array_fill(0, count($firstnames), '?'));

        if ($counter > 0) {
            $where = $where . 'first_name IN(' . $in_firstname . ') AND ';
            $counter--;
        } else {
            $where = $where . 'first_name IN(' . $in_firstname . ')';
        }
        $array_to_execute = $firstnames;
    }

    if (!empty($data->last_name)) {
        $last_name = $data->last_name;
        $lastnames = array();
        foreach ($last_name as $value) {
            array_push($lastnames, $value->last_name);
        }
        $in_lastname = implode(',', array_fill(0, count($lastnames), '?'));

        if ($counter > 0) {
            $where = $where . 'last_name IN(' . $in_lastname . ') AND ';
            $counter--;
        } else {
            $where = $where . 'last_name IN(' . $in_lastname . ')';
        }

        if (empty($array_to_execute)) {
            $array_to_execute = $lastnames;
        } else {
            $array_to_execute = array_merge($array_to_execute, $lastnames);
        }
    }
    if (!empty($data->payment_type)) {
        $payment_type = $data->payment_type;
        $types = array();
        foreach ($payment_type as $value) {
            array_push($types, $value->payment_type);
        }
        $in_payment_type = implode(',', array_fill(0, count($types), '?'));

        if ($counter > 0) {
            $where = $where . 'payment_type IN(' . $in_payment_type . ') AND ';
            $counter--;
        } else {
            $where = $where . 'payment_type IN(' . $in_payment_type . ')';
        }

        if (empty($array_to_execute)) {
            $array_to_execute = $types;
        } else {
            $array_to_execute = array_merge($array_to_execute, $types);
        }
    }

    if (!empty($data->payment_for)) {
        $payment_for = $data->payment_for;
        $for = array();
        foreach ($payment_for as $value) {
            array_push($for, $value->payment_for);
        }
        $in_for = implode(',', array_fill(0, count($for), '?'));

        if ($counter > 0) {
            $where = $where . 'payment_for IN(' . $in_for . ') AND ';
            $counter--;
        } else {
            $where = $where . 'payment_for IN(' . $in_for . ')';
        }

        if (empty($array_to_execute)) {
            $array_to_execute = $for;
        } else {
            $array_to_execute = array_merge($array_to_execute, $for);
        }
    }


    if (!empty($data->receipt_type)) {
        $payment_receipt_type = $data->receipt_type;
        $for = array();
        foreach ($payment_receipt_type as $value) {
            array_push($for, $value->receipt_type);
        }
        $in_for = implode(',', array_fill(0, count($for), '?'));

        if ($counter > 0) {
            $where = $where . 'receipt_type IN(' . $in_for . ') AND ';
            $counter--;
        } else {
            $where = $where . 'receipt_type IN(' . $in_for . ')';
        }

        if (empty($array_to_execute)) {
            $array_to_execute = $for;
        } else {
            $array_to_execute = array_merge($array_to_execute, $for);
        }
    }

    if (!empty($data->ispaid)) {
        $is_paid = $data->ispaid;
        $paid = array();
        foreach ($is_paid as $value) {
            array_push($paid, $value->option);
        }
        $in_paid = implode(',', array_fill(0, count($paid), '?'));

        if ($counter > 0) {
            $where = $where . 'is_paid IN(' . $in_paid . ') AND ';
            $counter--;
        } else {
            $where = $where . 'is_paid IN(' . $in_paid . ')';
        }

        if (empty($array_to_execute)) {
            $array_to_execute = $paid;
        } else {
            $array_to_execute = array_merge($array_to_execute, $paid);
        }
    }

    if ($counter == -1) {
        $sql = "SELECT SUM(total) AS total FROM payments";
    } else {
        //$sql = "SELECT SUM(total) AS total FROM payments WHERE " . $where . " AND YEAR(payment_date) = " . $year;
        $sql = "SELECT SUM(total) AS total FROM payments WHERE " . $where;
    }
    
    $customers = $db->prepare($sql);
    $customers->execute($array_to_execute);

    $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($customers);

}
