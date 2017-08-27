<?php
require "../functions/jwt.php";//already have connection.php inside
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    if (!empty($_FILES["file"])) {
                $myFile = $_FILES["file"];
                $type = $myFile['type'];
                $file_size = $myFile['size'];
                $user_id = $_POST["userid"];

                if ($myFile["error"] !== UPLOAD_ERR_OK) {
                    echo "<p>An error occurred.</p>";
                    exit;
                }
//                $name = preg_replace("/[^A-Z0-9._-]/i", "_", $myFile["name"]);
                  $name = $myFile["name"];

                $i = 0;
                $parts = pathinfo($name);
                while (file_exists(UPLOAD_DIR . $name)) {
                    $i++;
                    $name = $parts["filename"] . "-" . $i . "." . $parts["extension"];
                }
                $name = $user_id . '-' . $name;
        
                $success = move_uploaded_file($myFile["tmp_name"],
                    UPLOAD_DIR . $name);
                if (!$success) {
                    echo "<p>Unable to save file.</p>";
                    exit;
                } else {
                    $sqlstring = " INSERT INTO customer_files(user_id,file_location,file_type,file_size,file_name)
  VALUES (:user_id,:file_location,:file_type,:file_size,:file_name)";

                    $customers = $db->prepare($sqlstring);
                    $customers->execute([
                        'user_id' => $user_id,
                        'file_location' => UPLOAD_DIR,
                        'file_type' => $type,
                        'file_size' => $file_size,
                        'file_name' => $name

                    ]);
                    $last_id = $db->lastInsertId();
                    echo $last_id;
                }
                chmod(UPLOAD_DIR . $name, 0644);
    }
}