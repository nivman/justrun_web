<?php
require "../functions/jwt.php";//already have connection.php inside
	$data = json_decode(file_get_contents("php://input"));
	$start = $data->start;
	$end = $data->end;
	echo $start . " ";

	$yearStart = $data->yearStart;
	$yearEnd = $data->yearEnd;
	$formatStartHour = $data->formatStartHour;
	$formatEndHour = $data->formatEndHour;
	$GLOBALS['title'] = $data->title;
	$GLOBALS['description'] = $data->description;
	$GLOBALS['mailtoreminder'] = $data->mailtoreminder;
	$GLOBALS['reminder'] = $data->reminder;
	$GLOBALS['strtotimefullStartDate'] = strtotime($start);
	$GLOBALS['strtotimefullEndDate'] = strtotime($end);
	$GLOBALS['username'] = $data->username;
	$GLOBALS['guid'] = $data->guid;
	$start_day = new DateTime($start);
	$start_day->modify('first day of this month');
	$end_day = new DateTime($end);
	$end_day->modify('first day of next month');
	$interval = DateInterval::createFromDateString('1 month');
	$period = new DatePeriod($start_day, $interval, $end_day);


	function setEventsInDataBase($startTime, $endTime)
	{
		global $db;
		$username = reset($GLOBALS['username']);
		$repeatevent = $GLOBALS['guid'];
		$q = "INSERT INTO calendar (title, description,start,end,username,repeatevent,mailtoreminder,reminder ) VALUES(:title,:description,:start,:end,:username,:repeatevent,:mailtoreminder,:reminder)";


		$query = $db->prepare($q);
		$execute = $query->execute(array(
			":title" => $GLOBALS['title'],
			":description" => $GLOBALS['description'],
			":start" => $startTime,
			":end" => $endTime,
			":username" => $username,
			":repeatevent" => $repeatevent,
			":mailtoreminder" => $GLOBALS['mailtoreminder'],
			":reminder" => $GLOBALS['reminder']

		));
		$last_id = $db->lastInsertId();
		//echo $last_id." ";
	}

	setEventsInDataBase($start, $end);
