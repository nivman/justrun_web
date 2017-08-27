 <?php
require "../functions/jwt.php";//already have connection.php inside

 $fileData = file_get_contents("php://input");
    $data = json_decode($fileData);
    $token_key = create_key();
    $sqlstring = " INSERT INTO users(user_name,email,password,istemp,token_key,role_id)
    VALUES (:user_name,:email,:password,:istemp,:token_key,:role_id)";
    $users = $db->prepare($sqlstring);
    $users->execute([
                    'user_name' => "test",
                    'email' => $data->data->email,
                    'password' => password_hash($data->data->password, PASSWORD_DEFAULT),
                    'istemp' => 0,
                    'token_key' => $token_key,
                    'role_id' => "1"
    ]);
     //$users = $users->errorInfo();
    $last_id = $db->lastInsertId();
    $token =  create_jwt($last_id,$token_key);
    
    $sqlupdatestring  = "UPDATE users SET token = :token WHERE id = :id";
    $query   = $db->prepare($sqlupdatestring);
    $query->execute([
                'token'=>$token,
                'id'=>$last_id
    ]);
    $res_arr = array('user_id'=>$last_id);
    echo json_encode($res_arr);