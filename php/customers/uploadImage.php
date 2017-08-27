<?php
require "../functions/jwt.php";//already have connection.php inside
if (every_protected_page() != 1){
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    $uploadfile = $_POST['filename'];
    $uploadfilename = $_FILES['file']['tmp_name'];
    $type = $_FILES['file']['type'];
    $file_size = $_FILES['file']['size'];
    $user_id = $_POST['userid'];

    $customers = $db->prepare("SELECT id FROM profile_images WHERE user_id = :user_id");
    $customers->execute([
        'user_id' => $user_id
    ]);
    $customers = $customers->fetchAll(PDO::FETCH_ASSOC);

    if (count($customers) > 0) {
        $sqlstring = "UPDATE profile_images SET file_location = :file_location,file_type = :file_type,file_name = :file_name,file_size = :file_size WHERE user_id = :user_id";
        $customers = $db->prepare($sqlstring);
        $customers->execute([
            'file_location' => Image_DIR,
            'file_type' => $type,
            'file_size' => $file_size,4,
            'file_name' => $uploadfile,
            'user_id' => $user_id

        ]);
        move_uploaded_file($uploadfilename, Image_DIR . '/' . $uploadfile);
    } else {
        if (move_uploaded_file($uploadfilename, Image_DIR . '/' . $uploadfile)) {
            $sqlstring = "INSERT INTO profile_images(user_id,file_location,file_type,file_size,file_name) VALUES (:user_id,:file_location,:file_type,:file_size,:file_name)";

            $customers = $db->prepare($sqlstring);
            $customers->execute([
                'user_id' => $user_id,
                'file_location' => Image_DIR,
                'file_type' => $type,
                'file_size' => $file_size,
                'file_name' => $uploadfile

            ]);
            $last_id = $db->lastInsertId();
            echo $last_id;
        } else {
            echo "Error Upload";
        }
    }
}
