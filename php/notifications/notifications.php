<?php
require "../functions/jwt.php";
if (every_protected_page() != 1) {
	if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS') {
		return http_response_code(401);
	}
}else {
	$q = $db->query("SELECT * FROM calendar WHERE NOT reminder='0'");
	$q  = $q ->fetchAll();
	date_default_timezone_set('Asia/Jerusalem');
	$startreminderTime=$q[0][3];
	$timeNow =date('Y-m-d H:i:00', time());


	foreach ($q as $value) {

		$addremindarhours = "+".$value[8]." hours";

		$new_time = date("Y-m-d H:i:s", strtotime($addremindarhours));

		$format_new_time =strtotime($new_time);
		$format_start = strtotime($value[3]);

		if($format_new_time>$format_start)
		{

			$title="תזכורת ל:". $value[1];
			$description = $value[2];
			$start_event_time =  " ".$value[3]." ";
			$startDate = date('d-m-Y H:i', strtotime($start_event_time));

			$end_event_time =  $value[4];
			$endDate = date('d-m-Y H:i', strtotime($end_event_time));
			$msg =$description."\n\n שעת התחלה : ".$startDate ."\n\n שעת סיום : ".$endDate;
			$headers = "From: JustRun";
			$msg = wordwrap($msg,70);
			$mailtoreminder=$value[10];
			mail($mailtoreminder,$title,$msg,$headers);
			$eventId =($value[0]);

			$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$qToClear = "UPDATE calendar SET reminder=:reminder WHERE eventId=:eventId";
			$query =$db->prepare($qToClear);
			$execute = $query->execute(array(
				":reminder" =>$clear_reminder,
				":eventId"=>$eventId

			));
			echo "   true  $eventId ";
			$response = sendMessage($title,$mailtoreminder);
			$return["allresponses"] = $response;
			$return = json_encode( $return);

		}
		else
		{

		}
	}

	function sendMessage($title,$mailtoreminder){
		$content = array(
			"en" => $title
		);

		$fields = array(

			'app_id' => "01a21e40-dd71-4dee-9301-944b9d52a577",
			'included_segments' => array('All'),
			'data' => array("foo" => "bar"),
			'contents' => $content
		);






		$fields = json_encode($fields);
		print("\nJSON sent:\n");
		print($fields);

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "https://onesignal.com/api/v1/notifications");
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json',
			'Authorization: Basic ZDUzZTJhYzctMDA0ZC00NmM1LThhYTYtZjU1YjM4N2FhNjI4'));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		curl_setopt($ch, CURLOPT_HEADER, FALSE);
		curl_setopt($ch, CURLOPT_POST, TRUE);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);

		$response = curl_exec($ch);
		curl_close($ch);

		return $response;
	}

	$response = sendMessage();
	$return["allresponses"] = $response;
	$return = json_encode( $return);

	print("\n\nJSON received:\n");
	print($return);
	print("\n");


}