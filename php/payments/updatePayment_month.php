<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    $fileData = file_get_contents("php://input");
    $data = json_decode($fileData);

    $sqlstring = "UPDATE payments_month SET jun =:jun,feb =:feb,mar =:mar,apr =:apr,may =:may,june =:june,
                                        july =:july,aug =:aug,sept =:sept,oct =:oct,nov =:nov,decm =:decm WHERE id =:id";
    $customers = $db->prepare($sqlstring);
    $customers->execute([
        'id' => $data->id,
        'jun' => $data->months[0],
        'feb' => $data->months[1],
        'mar' => $data->months[2],
        'apr' => $data->months[3],
        'may' => $data->months[4],
        'june' => $data->months[5],
        'july' => $data->months[6],
        'aug' => $data->months[7],
        'sept' => $data->months[8],
        'oct' => $data->months[9],
        'nov' => $data->months[10],
        'decm' => $data->months[11],
    ]);
    $customers = $customers->errorInfo();
    echo json_encode($customers);
}