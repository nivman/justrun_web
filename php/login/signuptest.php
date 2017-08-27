 <?php
require "../functions/jwt.php";//already have connection.php inside

 $fileData = file_get_contents("php://input");
  	$email = $_POST['email'];
$password = $_POST['password'];

    $token_key = create_key();
    $sqlstring = " INSERT INTO users(email,password,istemp,token_key)
    VALUES (:email,:password,:istemp,:token_key)";
    $users = $db->prepare($sqlstring);
    $users->execute([
                    'email' => $email,
                    'password' => password_hash($password, PASSWORD_DEFAULT),
                    'istemp' => 0,
                    'token_key' => $token_key
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