<?php
require "../functions/jwt.php";//already have connection.php inside
if (every_protected_page() != 1) {
	if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
		return http_response_code(401);
	}
}else {
	$data = json_decode(file_get_contents("php://input"));
	$event_id = $data->event_id;
	$event = $db->prepare("DELETE FROM calendar WHERE description= :event_id");
	$execute = $event->execute(array(
		":event_id" => $event_id
	));
}