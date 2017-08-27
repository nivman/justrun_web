<?php
require "../functions/jwt.php";//already have connection.php inside
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
        $filearr = $db->prepare("SELECT file_location,file_name FROM customer_files WHERE id = :id");

        $filearr->execute([
            'id' => $_GET['file_id']
        ]);
        $filearr = $filearr->fetchAll(PDO::FETCH_ASSOC);

        $name = $filearr[0]['file_name'];
        $location = $filearr[0]['file_location'];

        $file = $location . $name;


        if (!file_exists($file)) { // file does not exist
            die('file not found');
        } else {
            $filedel = $db->prepare("DELETE FROM customer_files WHERE  id = :id  LIMIT 1");

            $filedel->execute([
                'id' => $_GET['file_id']
            ]);

            if (unlink($file))
                echo json_encode("File Deleted.");
        }
}
