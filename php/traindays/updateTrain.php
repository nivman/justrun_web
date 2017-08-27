<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
    if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
        return http_response_code(401);
    }
}else {
    $user_id = $_GET['user_id'];
    $day = $_GET['day'];
    $day_value = $_GET['day_value'];

    $customers = $db->prepare("SELECT user_id FROM train_days WHERE user_id = :user_id");
    $customers->execute(['user_id' => $user_id]);

    $id = (int)$customers->fetchColumn(0);

    if ($id == 0) {
        $sqlstring = "INSERT INTO train_days(user_id,sunday,monday,tuesday,wednesday,thursday,friday,saturday) VALUES (:user_id,:sunday,:monday,:tuesday,:wednesday,:thursday,:friday,:saturday)";
        $customers = $db->prepare($sqlstring);
        $customers->execute([
            'user_id' => $user_id,
            'sunday' => 0,
            'monday' => 0,
            'tuesday' => 0,
            'wednesday' => 0,
            'thursday' => 0,
            'friday' => 0,
            'saturday' => 0
        ]);;
    }


    $sqlstring = "UPDATE train_days SET " . $day . " =:day_value WHERE user_id = :user_id";
    $customers = $db->prepare($sqlstring);
    $customers->execute([
        'user_id' => $user_id,
        'day_value' => $day_value,
    ]);
    $customers = $customers->errorInfo();
    echo json_encode($customers);
}
