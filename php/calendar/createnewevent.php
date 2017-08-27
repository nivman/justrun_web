<?php
require "../functions/jwt.php";//already have connection.php inside

if (every_protected_page() != 1) {
	if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
		return http_response_code(401);
	}
}else {
	$data = json_decode(file_get_contents("php://input"));
	$title = (isset($data->title) ? $data->title : "");
	$description =  (isset($data->description) ? $data->description : "");
	$start = $data->start;
	$end = $data->end;
	$username =  (isset($data->username) ? $data->username : "");
	$allday = $data->allday;
	$eventId = (isset($data->eventId) ? $data->eventId : "");
	$repeatevent =  (isset($data->repeatevent) ? $data->repeatevent : "");
	$reminder =  (isset($data->reminder) ? $data->reminder : "");
	$mailtoreminder = (isset($data->mailtoreminder) ? $data->mailtoreminder : "");
	$funcname = "";
	function dateIsBetween($from, $to, $start_date_from_user, $end_date_from_user, $event_id_from_server, $event_id_from_clinet)
	{
		$start_date_from_user = is_int($start_date_from_user) ? $start_date_from_user : $start_date_from_user;
		$from = is_int($from) ? $from : $from;
		$to = is_int($to) ? $to : $to;


		if ($start_date_from_user > $from && $start_date_from_user < $to) {
			$middle["a"] = "found_over_lapping_hours_at_start";
			$middle["b"] = $start_date_from_user;
			$middle["c"] = $end_date_from_user;
			$middle["d"] = $event_id_from_server;
			$middle["e"] = $event_id_from_clinet;
			return $middle;

		}
		if ($end_date_from_user > $from && $end_date_from_user < $to) {
			$middle["a"] = "found_over_lapping_hours_at_end";
			$middle["b"] = $start_date_from_user;
			$middle["c"] = $end_date_from_user;
			$middle["d"] = $event_id_from_server;
			$middle["e"] = $event_id_from_clinet;
			return $middle;

		}

		if (($from >= $start_date_from_user) && ($from <= $end_date_from_user)) {

			$middle["a"] = "found_over_lapping_hours_at_middle";
			$middle["b"] = $start_date_from_user;
			$middle["c"] = $end_date_from_user;
			$middle["d"] = $event_id_from_server;
			$middle["e"] = $event_id_from_clinet;
			return $middle;

		}

	}

	if (!empty($_GET['funcname'])) {

		$funcname = $_GET['funcname'];
		switch ($funcname) {
			case 'checkforoverlappinghours':

				$stmt = $db->prepare("SELECT start, end,eventid,title,repeatevent FROM calendar");
				$stmt->execute();
				$result = $stmt->fetchAll();
				for ($i = 0; $i < sizeof($result); $i++) {

					$start_date = strtotime($result[$i][0]);

					$end_date = strtotime($result[$i][1]);
					$start_date_from_user = strtotime($start);
					$end_date_from_user = strtotime($end);
					$id = ($result[$i][2]);
					$overlappingtitle = $result[$i][3];
					$overlappingrepeatevents = $result[$i][4];
					$test = dateIsBetween($start_date, $end_date, $start_date_from_user, $end_date_from_user, $id, $eventId);

					if (($test["a"] == 'found_over_lapping_hours_at_middle' || $test["a"] == 'found_over_lapping_hours_at_start' || $test["a"] == 'found_over_lapping_hours_at_end') && $test["d"] != $test["e"]) {
						$printstartdate = date("Y-m-d H:i", $start_date);
						$printenddate = date("Y-m-d H:i", $end_date);

						echo json_encode($test["a"] . "," . $printstartdate . "," . $printenddate . "," . $test["d"] . "," . $overlappingtitle . "," . $overlappingrepeatevents);
						//break;
					}


				}
				echo "";
				break;

			case 'setnewevent':
				$eventId = $data->eventId;
				$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$q = "INSERT INTO calendar (title, description,start,end,username,allday,reminder,	mailtoreminder) VALUES(:title,:description,:start,:end,:username,:allday,:reminder,:mailtoreminder)";

				$query = $db->prepare($q);
				$execute = $query->execute(array(
					":title" => $title,
					":description" => $description,
					":start" => $start,
					":end" => $end,
					":username" => $username,
					":allday" => $allday,
					":reminder" => $reminder,
					":mailtoreminder" => $mailtoreminder

				));
				$last_id = $db->lastInsertId();
				echo $last_id;
				break;
			case 'updateevent':
				$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$q = "UPDATE calendar SET title = :title,description= :description,start=:start,end=:end,username=:username,allday=:allday, reminder=:reminder,mailtoreminder=:mailtoreminder WHERE eventId = :eventId";
				$query = $db->prepare($q);
				$execute = $query->execute(array(
					":title" => $title,
					":description" => $description,
					":start" => $start,
					":end" => $end,
					":username" => $username,
					":allday" => $allday,
					":eventId" => $eventId,
					":reminder" => $reminder,
					":mailtoreminder" => $mailtoreminder
				));

				echo "update";
				break;
			case 'updaterepeatedevent':
				$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				$q = "UPDATE calendar SET title = :title,description= :description,start=:start,end=:end,username=:username,allday=:allday, reminder=:reminder,mailtoreminder=:mailtoreminder  WHERE repeatevent = :repeatevent AND eventId = :eventId";
				$query = $db->prepare($q);
				$execute = $query->execute(array(
					":title" => $title,
					":description" => $description,
					":start" => $start,
					":end" => $end,
					":username" => $username,
					":allday" => $allday,
					":reminder" => $reminder,
					":repeatevent" => $repeatevent,
					":eventId" => $eventId,
					":mailtoreminder" => $mailtoreminder
				));
				print_r($data);
				break;

		}

	}
}
	
	
