<?php
require "../functions/jwt.php";//already have connection.php inside
if (every_protected_page() != 1) {
	if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
		return http_response_code(401);
	}
}else {
	$data = json_decode(file_get_contents("php://input"));
	$funcname = "";

	if (!empty($_GET['funcname'])) {

		$funcname = $_GET['funcname'];
		switch ($funcname) {
			case 'removeSingleEvent':

				$title = $data->title;
				$start = $data->start;

				$q = "UPDATE calendar SET reminder=:reminder,mailtoreminder=:mailtoreminder WHERE title = :title AND start =:start";
				$query = $db->prepare($q);
				$execute = $query->execute(array(
					":title" => $title,
					":start" => $start,
					":reminder" => 0,
					":mailtoreminder" => "NULL"
				));
				echo "done-removeSingleEvent";
				break;
			case 'removeMultiEvent':
				$repeatevent = $data->guid;
				$q = "UPDATE calendar SET reminder=:reminder,mailtoreminder=:mailtoreminder WHERE repeatevent = :repeatevent";
				$query = $db->prepare($q);
				$execute = $query->execute(array(
					":reminder" => 0,
					":mailtoreminder" => "NULL",
					"repeatevent" => $repeatevent
				));
				echo "done-done";
				break;
		}
	}
}