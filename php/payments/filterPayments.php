<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    $funcname = "";

    if (!empty($_GET['funcname'])) {
        $funcname = $_GET['funcname'];
        switch ($funcname) {
            case "firstname":
                $customers = $db->prepare("SELECT DISTINCT first_name FROM payments ORDER BY first_name");
                $customers->execute();
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo ")]}'\n";
                echo json_encode($customers);
                break;
            case "lastname":
                $customers = $db->prepare("SELECT DISTINCT last_name FROM payments ORDER BY last_name");
                $customers->execute();
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo ")]}'\n";
                echo json_encode($customers);
                break;
            case "type":
                $customers = $db->prepare("SELECT DISTINCT payment_type FROM payments ORDER BY payment_type");
                $customers->execute();
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo ")]}'\n";
                echo json_encode($customers);
                break;
            case "for":
                $customers = $db->prepare("SELECT DISTINCT payment_for FROM payments ORDER BY payment_for");
                $customers->execute();
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo ")]}'\n";
                echo json_encode($customers);
                break;
            case "receipt_type":
                $customers = $db->prepare("SELECT DISTINCT receipt_type FROM payments ORDER BY receipt_type");
                $customers->execute();
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

        if (!empty((array)$data->dates) && $data->dates->clear == false) {
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

        if (!empty((array)$data->dates && $data->dates->clear == false)) {
            $dates = $data->dates;
            $date_arr = array();
            if (!empty($dates->day) && $dates->day !== null && !empty($data->dates->day)) {
                $day = $dates->day;
                array_push($date_arr, $day);
                $in_day = implode(',', array_fill(0, 1, '?'));

                if ($counter > 0) {
                    $where = $where . 'payment_date IN (' . $in_day . ') AND ';
                    $counter--;
                } else {
                    $where = $where . 'payment_date IN(' . $in_day . ')';
                }
                if (empty($array_to_execute)) {
                    $array_to_execute = $date_arr;
                } else {
                    $array_to_execute = array_merge($array_to_execute, $date_arr);
                }
            } else {
                if (!empty($dates->start) & $dates->start !== null & !empty($data->dates->start)) {
                    $date_start_arr = array();
                    $date_end_arr = array();

                    $start_date = $dates->start;
                    $end_date = $dates->end;
                    array_push($date_start_arr, $start_date);
                    array_push($date_end_arr, $end_date);
                    $in_start = implode(',', array_fill(0, 1, '?'));
                    $in_end = implode(',', array_fill(0, 1, '?'));

                    if ($counter > 0) {
                        $where = $where . 'payment_date BETWEEN (' . $in_start . ') AND (' . $in_end . ') AND ';
                        $counter--;
                    } else {
                        $where = $where . 'payment_date BETWEEN (' . $in_start . ') AND (' . $in_end . ')';
                    }
                    $date_arr_new = array_merge($date_start_arr, $date_end_arr);
                    if (empty($array_to_execute)) {
                        $array_to_execute = $date_arr_new;

                    } else {
                        $array_to_execute = array_merge($array_to_execute, $date_arr_new);
                    }
                } else {
                    if (!empty($dates->month) & $dates->month !== null & !empty($data->dates->month)) {
                        $month = $dates->month;
                        array_push($date_arr, $month);
                        $in_month = implode(',', array_fill(0, 1, '?'));

                        if ($counter > 0) {
                            $where = $where . 'MONTH(payment_date) IN (' . $in_month . ') AND ';
                            $counter--;
                        } else {
                            $where = $where . 'MONTH(payment_date) IN(' . $in_month . ')';
                        }
                        if (empty($array_to_execute)) {
                            $array_to_execute = $date_arr;
                        } else {
                            $array_to_execute = array_merge($array_to_execute, $date_arr);
                        }
                    }
                }
            }
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
            $sql = "SELECT * FROM payments ORDER BY id DESC limit ?,?";
        } else {
            $sql = "SELECT * FROM payments WHERE " . $where . " ORDER BY id DESC limit ?,?";
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
