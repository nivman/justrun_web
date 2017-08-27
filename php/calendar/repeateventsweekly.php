<?php
require "../functions/jwt.php";//already have connection.php inside

	$data = json_decode(file_get_contents("php://input"));

	$start = $data->start;
	$end = $data->end;

	$yearStart = $data->yearStart;
	$yearEnd = $data->yearEnd;

	$GLOBALS['yearStart'] = $data->yearStart;
	$GLOBALS['yearEnd'] = $data->yearEnd;


	$dayToRepeat = $data->dayToRepeat;
	$formatStartHour = $data->formatStartHour;
	$formatEndHour = $data->formatEndHour;
	$GLOBALS['title'] = $data->title;
	$GLOBALS['description'] = $data->description;

	$GLOBALS['strtotimefullStartDate'] = strtotime($start);
	$GLOBALS['strtotimefullEndDate'] = strtotime($end);
	$GLOBALS['username'] = $data->username;
	$GLOBALS['guid'] = $data->guid;
	$GLOBALS['reminder'] = $data->reminder;
	$GLOBALS['mailtoreminder'] = $data->mailtoreminder;
	$start_day = new DateTime($start);
	$start_day->modify('first day of this month');
	$end_day = new DateTime($end);
	$end_day->modify('first day of next month');
	$interval = DateInterval::createFromDateString('1 month');
	$period = new DatePeriod($start_day, $interval, $end_day);

	function getMounth($period, $dayToRepeat, $yearStart, $yearEnd, $formatStartHour, $formatEndHour)
	{
		if ($yearStart == $yearEnd) {
			$years = array($yearStart);
		} else {
			$years = array($yearStart, $yearEnd);
		}

		$days = array();
		$mounths = array();
		foreach ($dayToRepeat as $day) {
			array_push($days, $day);
		}
		foreach ($period as $dt) {
			$mounthArray = $dt->format("m") . PHP_EOL;
			array_push($mounths, $mounthArray);
		}

		passmounth($mounths, $days, $years, $formatStartHour, $formatEndHour);
	}

	function passmounth($mounths, $days, $years, $formatStartHour, $formatEndHour)
	{

		$i = 0;
		$j = 0;


		$d1 = new DateTime($GLOBALS['yearStart'] . '-01-01');
		$d2 = new DateTime($GLOBALS['yearEnd'] . '-01-01');

		$diff = $d2->diff($d1);
		$i = 0;
		$j = 0;

		$yearCount = $diff->y;
		print_r($yearCount);
		$array = array();
		$addToStart;
		for ($i = 0; $i < $yearCount + 1; $i++) {
			$addToStart = $GLOBALS['yearStart'] + $i;
			$array [] = $addToStart;

		}

		$i = 0;
		$j = 0;
		print_r($array);
		print_r($mounths);

		print_r($days);

		$prevmounth = 0;
		$esc = false;
		$currantYear = date("Y");
		$arrayLangth = count($array) - 1;
		$sumTheMounthOfTheRemainlYears = $arrayLangth * 12;
		$getMounth = reset($mounths);

		$remainMounthToTheEndOfTheCurrentYear = 12 - $getMounth;
		print_r(" remainMounthToTheEndOfTheCurrentYear   " . $remainMounthToTheEndOfTheCurrentYear . "  - ");

		foreach ($array as $year) {
			$addYear = $currantYear + $j;
			$j++;
			if ($currantYear == $addYear) {

				foreach ($mounths as $mounth) {

					if ($i < $remainMounthToTheEndOfTheCurrentYear + 1) {
						foreach ($days as $day) {
							setDateToParse($year, $mounth, $day, $formatStartHour, $formatEndHour);

						}
					}
					$i++;

				}

				continue;
			} else {

				for ($n = 1; $n < $sumTheMounthOfTheRemainlYears; $n++) {
					$mounth = $n;
					if ($n < 13) {
						setDateToParse($year, $mounth, $day, $formatStartHour, $formatEndHour);
					} else {
						continue;
					}

				}


			}
			$j++;
		}
	}

	function setDateToParse($year, $mounth, $daySelected, $formatStartHour, $formatEndHour)
	{

		foreach (setDate($year, $mounth, $daySelected) as $day) {
			$date = $day->format("Y-m-d");

			$srt = strtotime($date);

			$endDateStr = $GLOBALS['strtotimefullEndDate'];

			if ($endDateStr > $srt) {

				$startTime = $date . " " . $formatStartHour . " ";
				$endTime = $date . " " . $formatEndHour . " ";

				setEventsInDataBase($startTime, $endTime);
			}

		}
	}

	function setDate($y, $m, $daySelected)
	{
		$mo = $m + 1;
		$checkForLastDate = date("j,t", strtotime("last $daySelected $y-$mo"));
		$lastDayArray = explode(",", $checkForLastDate);
		$firstElement = array_values($lastDayArray)[0];
		$secondElement = array_values($lastDayArray)[1];
		if ($firstElement == $secondElement) {
			return new DatePeriod(
				new DateTime("first $daySelected of $y-$m"),
				DateInterval::createFromDateString("next $daySelected"),
				new DateTime("next month $y-$m")
			);
		}
		return new DatePeriod(
			new DateTime("first $daySelected of $y-$m"),
			DateInterval::createFromDateString("next $daySelected"),
			new DateTime("last day of $y-$m")
		);
	}

	function setEventsInDataBase($startTime, $endTime)
	{
		global $db;
		$username = reset($GLOBALS['username']);
		$repeatevent = $GLOBALS['guid'];
		
		$q = "INSERT INTO calendar (title, description,start,end,username,repeatevent,reminder,mailtoreminder ) VALUES(:title,:description,:start,:end,:username,:repeatevent,:reminder,:mailtoreminder)";


		$query = $db->prepare($q);
		$execute = $query->execute(array(
			":title" => $GLOBALS['title'],
			":description" => $GLOBALS['description'],
			":start" => $startTime,
			":end" => $endTime,
			":username" => $username,
			":repeatevent" => $repeatevent,
			":reminder" => $GLOBALS['reminder'],
			":mailtoreminder" => $GLOBALS['mailtoreminder']
		));
		$last_id = $db->lastInsertId();
		//echo $last_id." ";
	}

	getMounth($period, $dayToRepeat, $yearStart, $yearEnd, $formatStartHour, $formatEndHour);
