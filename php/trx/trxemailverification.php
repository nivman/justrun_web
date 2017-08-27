<?php
require "../functions/jwt.php";
    if (!empty($_GET)) {
        $event_id = $_GET['event_id'];
        $user_id = $_GET['userid'];
        $isApproved = $_GET['approved'];
        if ($isApproved == 'true') {
            $sqlstring = "UPDATE trx SET approved_customer = 1,cancel_customer = 0  WHERE event_id = :event_id AND user_id = :user_id";
            echo("אישור התקבל! נתראה בשיעור!");
        } else {
            $sqlstring = "UPDATE trx SET cancel_customer = 1, approved_customer = 0  WHERE event_id = :event_id AND user_id = :user_id";
            echo("ביטול התקבל! נשמח לראות אותך בשנית!");
            }
        $dataarr = $db->prepare($sqlstring);
        $dataarr->execute([
            'user_id' => $user_id,
            'event_id' => $event_id
        ]);
        $dataarr = $dataarr->errorInfo();
}
