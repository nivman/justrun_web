<?php
require "../functions/jwt.php";//already have connection.php inside
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    $errors = array();
    $dataarr = array();
    $fileData = file_get_contents("php://input");
    $data = json_decode($fileData);

    if (!empty($_GET['actionname'])) {
        switch ($_GET['actionname']) {
            case 'createtemp':
                $first_name = $_GET['first_name'];
                if (!empty($_GET['last_name'])) {
                    $last_name = $_GET['last_name'];
                } else {
                    $last_name = "";
                }
                $phone_number = $_GET['phone_number'];

                $customers = $db->prepare("SELECT id FROM customers WHERE phone_number = :phone_number");
                $customers->execute([
                    'phone_number' => $phone_number
                ]);

                $id = (int)$customers->fetchColumn(0);
                if ($id == 0) {
                    $sqlstring = " INSERT INTO customers(email,first_name,last_name,birth_date,sign_date,phone_number,trx,image,program,ref,temp_customer,gender,active,address,facebook)
  VALUES (:email,:first_name,:last_name,:birth_date,:sign_date,:phone_number,:trx,:image,:program,:ref,:temp_customer,:gender,:active,:address,:facebook)";

                    $customers = $db->prepare($sqlstring);
                    $customers->execute([
                        'email' => 'temp@temp.com',
                        'first_name' => $first_name,
                        'last_name' => $last_name,
                        'birth_date' => '1970-01-01',
                        'sign_date' => '1970-01-01',
                        'phone_number' => $phone_number,
                        'trx' => 1,
                        'image' => 0,
                        'program' => 'temp',
                        'ref' => 'temp',
                        'temp_customer' => 1,
                        'gender' => 'זכר',
                        'active' => 1,
                        'address' => "",
                        'facebook' => ""
                    ]);
                    $last_id = $db->lastInsertId();
                    $customers = $customers->errorInfo();
                    echo $last_id;

                } else {
                    echo $id;
                }
                break;
        }

    } else {

        $actionname = $data->actionname;
        $trx = $data->entity->trx;
        if ($trx) {
            $trx = 1;
        } else {
            $trx = 0;
        }

        $active = $data->entity->active;
        if ($active) {
            $active = 1;
        } else {
            $active = 0;
        }

        $facebook = $data->entity->facebook;
        if ($facebook) {
            $facebook = 1;
        } else {
            $facebook = 0;
        }
        
            switch ($actionname) {
                case 'update':
                 if (!isset($data->entity->comment)){
        $comment = "";
        }else{
            $comment = $data->entity->comment;
        }
                    $sqlstring = "
     UPDATE customers     
    SET email = :email, first_name = :first_name, 
        last_name = :last_name, birth_date = :birth_date,
        sign_date =:sign_date, phone_number=:phone_number,
        trx = :trx,image=:image, program=:program,ref=:ref,gender=:gender,active=:active,location=:location,comment=:comment,address =:address,facebook =:facebook
    WHERE id = :id";
                    $customers = $db->prepare($sqlstring);
                    $customers->execute([
                        'id' => $data->entity->id,
                        'email' => $data->entity->email,
                        'first_name' => $data->entity->first_name,
                        'last_name' => $data->entity->last_name,
                        'birth_date' => $data->entity->birth_date,
                        'sign_date' => $data->entity->sign_date,
                        'phone_number' => $data->entity->phone_number,
                        'ref' => $data->entity->ref,
                        'program' => $data->entity->program,
                        'trx' => $trx,
                        'image' => 0,
                        'gender' => $data->entity->gender,
                        'active' => $active,
                        'location' => $data->entity->location,
                        'comment' => $comment,
                        'address' => $data->entity->address,
                        'facebook' => $data->entity->facebook
                    ]);
                    $customers = $customers->errorInfo();
                    echo json_encode($customers);
                    break;

                case 'create':
                    $sqlstring = " INSERT INTO customers(email,first_name,last_name,birth_date,sign_date,phone_number,trx,image,program,ref,gender,active,location,address,facebook)
  VALUES (:email,:first_name,:last_name,:birth_date,:sign_date,:phone_number,:trx,:image,:program,:ref,:gender,:active,:location,:address,:facebook)";

                    $customers = $db->prepare($sqlstring);
                    $customers->execute([
                        'email' => $data->entity->email,
                        'first_name' => $data->entity->first_name,
                        'last_name' => $data->entity->last_name,
                        'birth_date' => $data->entity->birth_date,
                        'sign_date' => $data->entity->sign_date,
                        'phone_number' => $data->entity->phone_number,
                        'ref' => $data->entity->ref,
                        'program' => $data->entity->program,
                        'trx' => $trx,
                        'image' => 0,
                        'gender' => $data->entity->gender,
                        'active' => $active,
                        'location' => $data->entity->location,
                        'address' => $data->entity->address,
                        'facebook' => $facebook
                    ]);
//
                    $last_id = $db->lastInsertId();
                    $customers = $db->errorInfo();
                    echo  $last_id;
//                    echo json_encode($customers);
                    break;

            }
    }
}