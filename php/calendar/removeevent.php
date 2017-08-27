<?php
require "../functions/jwt.php";//already have connection.php inside
if (every_protected_page() != 1) {
	if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
		return http_response_code(401);
	}
}else{
	$data = json_decode(file_get_contents("php://input"));
	$funcname = "";

	if(!empty($_GET['funcname'])) {
		$funcname = $_GET['funcname'];
		switch ($funcname) {
			case 'removeSingleEvent':

				$title= $data->title;
				$start = $data->start;

				$event=	$db->prepare("DELETE FROM calendar WHERE title = :title AND start =:start");

				$execute = $event->execute(array(
					":title" =>$title,
					":start" =>$start
				));

				break;
			case 'removeMultiEvent':

				$guid= $data->guid;
				$event=	$db->prepare("DELETE FROM calendar WHERE repeatevent = :repeatevent");

				$execute = $event->execute(array(
					":repeatevent" =>$guid
				));
				echo "done";
				break;
		}
	}
}