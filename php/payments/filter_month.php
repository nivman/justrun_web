<?php
require "../functions/jwt.php";
$funcname = "";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {


    if (!empty($_GET['funcname'])) {
        $funcname = $_GET['funcname'];
        $year = $_GET['year'];
        switch ($funcname) {
            case "firstname":
                $customers = $db->prepare("SELECT DISTINCT first_name FROM payments_month WHERE YEAR(payment_date) = :year ORDER BY first_name");
                $customers->execute([
                    'year' => $year
                ]);
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo ")]}'\n";
                echo json_encode($customers);
                break;
            case "lastname":
                $customers = $db->prepare("SELECT DISTINCT last_name FROM payments_month WHERE YEAR(payment_date) = :year ORDER BY last_name");
                $customers->execute([
                    'year' => $year
                ]);
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo ")]}'\n";
                echo json_encode($customers);
                break;
        }
    } else {
        $fileData = file_get_contents("php://input");
        $data = json_decode($fileData);
        $where = "";
        $counter = -1;
        $year = $data->year;
        $in_firstname = array();
        $in_lastname = array();
        $firstnames = array();
        $array_to_execute = array();
        $start = $data->start;
        $end = $data->end;


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
            $sql = "SELECT * FROM payments_month WHERE YEAR(payment_date) =" . $year . " ORDER BY first_name limit ?,?";
        } else {
            $sql = "SELECT * FROM payments_month WHERE " . $where . " AND YEAR(payment_date) =" . $year . " ORDER BY first_name limit ?,?";
        }


        $arraylimit = [$start, $end];
        $customers = $db->prepare($sql);

        if ($counter == -1) {
            $customers->execute($arraylimit);
        } else {
            $customers->execute(array_merge($array_to_execute, $arraylimit));
        }

        $customers = $customers->fetchAll(PDO::FETCH_ASSOC);


        echo json_encode($customers);


    }
}
