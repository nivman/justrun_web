<?php
function isAuth($token,$db){

    $token = str_replace('"', "", $token);
    $check = $db->prepare("SELECT * FROM users WHERE token = :token");
    $check->bindValue(':token', $token);
    $check->execute();

    $check = $check->fetchAll(PDO::FETCH_ASSOC);



    if(count($check)==1)
    {
        return true;
    }else
    {
        return false;
    }
    
}
?>