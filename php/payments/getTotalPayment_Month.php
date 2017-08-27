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

    if ($counter == -1) {
        $sql = "SELECT SUM(jun) AS '0',SUM(feb) AS '1' ,SUM(mar) AS '2',SUM(apr) AS '3',SUM(may) AS '4',SUM(june) AS '5'
            ,SUM(july) AS '6',SUM(aug) AS '7',SUM(sept) AS '8',SUM(oct) AS '9',SUM(nov) AS '10',SUM(decm) AS '11' FROM payments_month Where YEAR(payment_date) =" . $year;
    } else {
        $sql = "SELECT SUM(jun) AS '0',SUM(feb) AS '1' ,SUM(mar) AS '2',SUM(apr) AS '3',SUM(may) AS '4',SUM(june) AS '5'
            ,SUM(july) AS '6',SUM(aug) AS '7',SUM(sept) AS '8',SUM(oct) AS '9',SUM(nov) AS '10',SUM(decm) AS '11' FROM payments_month WHERE " . $where . " AND YEAR(payment_date) =" . $year;
    }

    $customers = $db->prepare($sql);
    $customers->execute($array_to_execute);


    $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($customers);


}