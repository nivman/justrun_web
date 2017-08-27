<?php
require "functions/jwt.php";//already have connection.php inside

$filearr = $db->prepare("SELECT file_location,file_type,file_size,file_name FROM customer_files WHERE id = :id");

$filearr->execute([
    'id' => $_GET['id']
]);
$filearr = $filearr->fetchAll(PDO::FETCH_ASSOC);

$name = $filearr[0]['file_name'];
$location = $filearr[0]['file_location'];
$type = $filearr[0]['file_type'];
$url = "http://" . $_SERVER['HTTP_HOST'] . "/" . Files_DIR . "/" . basename($name);
echo json_encode($url);






