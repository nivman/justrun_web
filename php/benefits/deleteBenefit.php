<?php
require "../functions/jwt.php";//already have connection.php inside

if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {

    $customers = $db->prepare("DELETE FROM benefits WHERE id = :benefit_id");
    $customers->execute([
        'benefit_id' => $_GET['benefit_id']
    ]);
    $customers = $customers->fetchAll(PDO::FETCH_ASSOC);
    echo ")]}'\n";
    echo json_encode($customers);

}
