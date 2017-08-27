<?php
require "../functions/jwt.php";//already have connection.php inside
	$data = json_decode(file_get_contents("php://input"));
	$start = $data->start;
	$end = $data->end;
	$yearStart = $data->yearStart;
	$yearEnd = $data->yearEnd;

	$dayToRepeat = $data->dayToRepeat;
	$GLOBALS['$formatStartHour'] = $data->formatStartHour;
	$GLOBALS['$formatEndHour'] = $data->formatEndHour;
	$GLOBALS['title'] = $data->title;
	$GLOBALS['description'] = $data->description;
	$GLOBALS['repeatsEvery'] = $data->repeatsEvery;
	$GLOBALS['username'] = $data->username;
	$GLOBALS['guid'] = $data->guid;
	$GLOBALS['mailtoreminder'] = $data->mailtoreminder;
	$GLOBALS['reminder'] = $data->reminder;
	function createDateRangeArray($strDateFrom, $strDateTo)
	{
		$aryRange = array();
		$iDateFrom = mktime(1, 0, 0, substr($strDateFrom, 5, 2), substr($strDateFrom, 8, 2), substr($strDateFrom, 0, 4));
		$iDateTo = mktime(1, 0, 0, substr($strDateTo, 5, 2), substr($strDateTo, 8, 2), substr($strDateTo, 0, 4));
		if ($iDateTo >= $iDateFrom) {
			$i = 0;
			$j = 0;
			array_push($aryRange, date('Y-m-d', $iDateFrom));
			while ($iDateFrom < $iDateTo) {
				if (($i % 2) === 0) {
					$iDateFrom += 86400; // add 24 hours
					array_push($aryRange, date('Y-m-d', $iDateFrom));
				}
				$i++;
			}
			$size = count($aryRange);
			$result = array();
			for ($i = 0; $i < $size; $i += $GLOBALS['repeatsEvery']) {
				$result[] = $aryRange[$i];
				$startTime = "  " . $aryRange[$i] . " " . $GLOBALS['$formatStartHour'];
				$endTime = $aryRange[$i] . " " . $GLOBALS['$formatEndHour'];
				setEventsInDataBase($startTime, $endTime);
			}
		}
	}
	function setEventsInDataBase($startTime, $endTime)
	{
		global $db;
		$username = reset($GLOBALS['username']);
		$repeatevent = $GLOBALS['guid'];
		$mailtoreminder = $GLOBALS['mailtoreminder'];
		$q = "INSERT INTO calendar (title, description,start,end,username,repeatevent,mailtoreminder,reminder) VALUES(:title,:description,:start,:end,:username,:repeatevent,:mailtoreminder,:reminder)";
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
		echo "  " . $GLOBALS['guid'] . " ";
	}

	createDateRangeArray($start, $end);
