<?php
require "../functions/jwt.php";//already have connection.php inside
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    $data = json_decode(file_get_contents("php://input"));

    $startDate = $data->startDate;
    $endDate = $data->endDate;


    $userInfo = $db->prepare("SELECT  * FROM calendar WHERE start BETWEEN :start_date AND :end_date");
    $userInfo->execute([
        'start_date' => $startDate,
        'end_date' => $endDate
    ]);
    $userInfo->bindValue(':start_date', $startDate);
    $userInfo->bindValue(':end_date', $endDate);
    $userInfo = $userInfo->fetchAll();
    echo json_encode($userInfo);

}