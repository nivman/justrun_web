<?php
require "../functions/jwt.php";//already have connection.php inside



    $funcname = "";
    if (!empty($_GET['funcname'])) {
        $funcname = $_GET['funcname'];
        switch ($funcname) {
            case 'getcustomerstrx':
                $customers = $db->prepare("SELECT first_name,last_name,id,phone_number,email FROM customers");
                $customers->execute();
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo ")]}'\n";
                echo json_encode($customers);
                break;
            case 'getsession':
                var_dump(apache_request_headers());
                break;
            case 'getcustomerssearchbar':
                $customers = $db->prepare("SELECT first_name,last_name,id FROM customers WHERE active = 1 AND temp_customer = 0");
                $customers->execute();
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo ")]}'\n";
                echo json_encode($customers);
                break;
            case 'birthdays':
                $customers = $db->prepare("SELECT first_name,last_name,birth_date FROM customers WHERE active = 1");
                $customers->execute();
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo ")]}'\n";
                echo json_encode($customers);
                break;
            case 'getallcustomers':
                $customers = $db->prepare("SELECT * FROM customers  WHERE temp_customer = 0 AND active = 1 ORDER BY first_name ASC");
                $customers->execute();
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($customers);
                break;
            case 'getallcustomers2':
                $customers = $db->prepare("SELECT * FROM customers");
                $customers->execute();
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo ")]}'\n";
                echo json_encode($customers);
                break;
            case 'updatecustomer':
                $customers = $db->prepare("UPDATE customers SET age = :age WHERE id =:user_id");
                $customers->execute([
                    'age' => $_GET['age'],
                    'user_id' => $_GET['user_id']
                ]);
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo ")]}'\n";
                echo json_encode($customers);
                break;
            case 'getnotactive':
                $start = $_GET['start'];
                $end = $_GET['end'];
                $customers = $db->prepare("SELECT * FROM customers  WHERE temp_customer = 0 AND active = 0 ORDER BY first_name ASC limit :start,:end ");
                $customers->bindValue(':start', $start);
                $customers->bindValue(':end', $end);
                $customers->execute();
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo ")]}'\n";
                echo json_encode($customers);
                break;
            case 'deletecustomer':
                $customers = $db->prepare("DELETE FROM customers WHERE id = :user_id");
                $customers->execute([
                    'user_id' => $_GET['user']
                ]);
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);

                $customers = $db->prepare("DELETE FROM trx WHERE user_id = :user_id");
                $customers->execute([
                    'user_id' => $_GET['user']
                ]);

                $customers = $db->prepare("DELETE FROM train_days WHERE user_id = :user_id");
                $customers->execute([
                    'user_id' => $_GET['user']
                ]);
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo ")]}'\n";
                echo json_encode($customers);

                break;
            case 'count':
                $customers = $db->query("SELECT count(*) FROM customers");
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo ")]}'\n";
                echo json_encode($customers);
                break;
            case 'search':
                //http://stackoverflow.com/questions/23482104/can-i-use-a-pdo-prepared-statement-to-bind-an-identifier-a-table-or-field-name
                $searchtext = $_GET['searchtext'];
                $allowed = array("first_name", "last_name", "email", "birth_date", "sign_date", "phone_number", "golas", "ref", "program", "trx");
                $key = array_search($_GET['searchby'], $allowed);
                $field = $allowed[$key];
                $sql = "SELECT * FROM customers  WHERE $field LIKE :searchtext ORDER BY first_name ASC";
                $customers = $db->prepare($sql);
                $customers->execute([
                    'searchtext' => '%' . $searchtext . '%'
                ]);
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo ")]}'\n";
                echo json_encode($customers);
                break;
            case 'searchbyprogram':
                $searchtext = $_GET['searchtext'];
                $searchtext_arrr = explode(",", $searchtext);
                $counter = count($searchtext_arrr);
                $in_program = implode(',', array_fill(0, count($searchtext_arrr), '?'));
                $where = "";
                for ($i = 0; $i < $counter; $i++) {
                    if ($counter == 1 || ($counter - $i) == 1) {
                        $where = $where . 'program IN(' . $in_program . ')';
                    }
                }

                $sql = "SELECT * FROM customers  WHERE " . $where . " ORDER BY first_name ASC";
                $customers = $db->prepare($sql);
                $customers->execute($searchtext_arrr);
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo ")]}'\n";
                echo json_encode($customers);
                break;
            case 'getimage':
                header('Content-Type: image');
                $customers = $db->prepare("SELECT image FROM profile_images WHERE user_id = :user_id");
                $customers->execute([
                    'user_id' => $_GET['user_id']
                ]);
                $customers->bindColumn(1, $image, PDO::PARAM_LOB);
                $customers->fetch(PDO::FETCH_BOUND);
                if (is_null($image)) {
                    header('Content-Type: image/gif');
                    $image = file_get_contents("http://ww4.msu.ac.zw/mainsite/wp-content/uploads/2015/05/default.gif");
                }
                echo $image;
                break;
            case 'getfilesname':
                $customers = $db->prepare("SELECT id,file_name,file_type FROM customer_files WHERE user_id = :user_id");
                $customers->execute([
                    'user_id' => $_GET['user_id']
                ]);

                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($customers);
                break;
            case 'getfriends':
                $customers = $db->prepare("SELECT * FROM friends WHERE user_id = :user_id");
                $customers->execute([
                    'user_id' => $_GET['user_id']
                ]);
                $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
                echo ")]}'\n";
                echo json_encode($customers);
                break;
        }

    } else {
        if (isset($_FILES)) {
            $actionname = $_POST['actionname'];
            if ($actionname == 'image') {
                $userid = $_POST['userid'];
                $image = file_get_contents($_FILES['file']['tmp_name']);
                $sqlstring = "INSERT INTO profile_images(user_id,image) VALUES (:user_id,:image)";

                $customers = $db->prepare($sqlstring);
                $customers->execute([
                    'user_id' => $userid,
                    'image' => $image
                ]);

            }
        }
}



