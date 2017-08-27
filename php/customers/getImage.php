<?php
require "../functions/jwt.php";//already have connection.php inside
if (every_protected_page() != 1){
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {

    $filearr = $db->prepare("SELECT file_location,file_type,file_size,file_name FROM profile_images WHERE user_id = :user_id");
    $filearr->execute([
        'user_id' => $_GET['user_id']
    ]);
    
    $filearr = $filearr->fetchAll(PDO::FETCH_ASSOC);
    if (count($filearr) > 0) {
        $name = $filearr[0]['file_name'];
        $location = $filearr[0]['file_location'];
        $file = $location .'/'. $name;

        if (file_exists($file)) {
            $data = file_get_contents($file);
            $base64 = 'data:image/jpeg;base64,' . base64_encode($data);
            header("Content-Type: text/plain");
            echo $base64;
        } else {
            header("Content-Type: text/plain");
            $image = file_get_contents("http://ww4.msu.ac.zw/mainsite/wp-content/uploads/2015/05/default.gif");
            $base64 = 'data:image/jpeg;base64,' . base64_encode($image);
            echo $base64;
        }
    }else{
        header("Content-Type: text/plain");
        $image = file_get_contents("http://ww4.msu.ac.zw/mainsite/wp-content/uploads/2015/05/default.gif");
        $base64 = 'data:image/jpeg;base64,' . base64_encode($image);
        echo $base64;
    }
}




