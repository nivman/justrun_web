<?php
require "../functions/jwt.php";//already have connection.php inside
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    $funcname = "";
    if (!empty($_GET['funcname'])) {
        $funcname = $_GET['funcname'];
        switch ($funcname) {
            case 'getfile':

                $filearr = $db->prepare("SELECT file_location,file_type,file_size,file_name FROM customer_files WHERE id = :id");
                $filearr->execute([
                    'id' => $_GET['id']
                ]);
                $filearr = $filearr->fetchAll(PDO::FETCH_ASSOC);
                $name = $filearr[0]['file_name'];
                $location = $filearr[0]['file_location'];
                $type = $filearr[0]['file_type'];
                $file = $location . $name;

                if (!$file) { // file does not exist
                    die('file not found');
                } else {
                    header('Content-Description: File Transfer');
                    header('Content-Type: application/octet-stream');
                    header('Content-Disposition: attachment; filename='.basename($file));
                    header('Content-Transfer-Encoding: binary');
                    header('Expires: 0');
                    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
                    header('Pragma: public');
                    header('Content-Length: ' . filesize($file));
                    flush();
                    readfile($file);
                    exit;
                }
                break;
        }
    }
}
