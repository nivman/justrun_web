<?php
require "../functions/jwt.php";//already have connection.php inside

	$data = json_decode(file_get_contents("php://input"));
	$start = $data->start;
	$end = $data->end;
	$yearStart = $data->yearStart;
	$yearEnd = $data->yearEnd;
	
	$GLOBALS['eventId'] = $data->eventId;
	$dayToRepeat = $data->dayToRepeat;
	$GLOBALS['$formatStartHour'] = $data->formatStartHour;
	$GLOBALS['$formatEndHour'] = $data->formatEndHour;
	$GLOBALS['title'] = $data->title;
	$GLOBALS['description'] = $data->description;
	$GLOBALS['repeatsEvery'] = $data->repeatsEvery;
	$GLOBALS['username'] = $data->username;
	$GLOBALS['guid'] = $data->guid;
	$GLOBALS['strtotimefullStartDate'] = strtotime($start);
	$GLOBALS['strtotimefullEndDate'] = strtotime($end);
	$GLOBALS['$startMonth'] = $start;
	$GLOBALS['$endMonth'] = $end;
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

	function checkOverlapingWeekMode($startTime, $endTime)
	{
		global $db;
		$stmt = $db->prepare("SELECT start, end,eventid,title FROM calendar");
		$stmt->execute();
		$result = $stmt->fetchAll();

		for ($i = 0; $i < sizeof($result); $i++) {

			$start_date = strtotime($result[$i][0]);
			$end_date = strtotime($result[$i][1]);
			$start_date_from_user = strtotime($startTime);
			$end_date_from_user = strtotime($endTime);
			$id = ($result[$i][2]);
			$overlappingtitle = $result[$i][3];
			//$overlappingrepeatevents= $result[$i][4];
			$test = dateIsBetween($start_date, $end_date, $start_date_from_user, $end_date_from_user, $id, 1);
			if (($test["a"] == 'found_over_lapping_hours_at_middle' || $test["a"] == 'found_over_lapping_hours_at_start' || $test["a"] == 'found_over_lapping_hours_at_end') && $test["d"] != $test["e"]) {
				$printstartdate = date("Y-m-d H:i", $start_date);
				$printenddate = date("Y-m-d H:i", $end_date);

				echo $test["a"] . "," . $printstartdate . "," . $printenddate . "," . $test["d"] . "," . $overlappingtitle . ",1";
			}

		}
		echo "";
	}

	function checkOverlaping($startTime, $endTime)
	{
		global $db;
		$stmt = $db->prepare("SELECT start, end,eventid,title FROM calendar");
		$stmt->execute();
		$result = $stmt->fetchAll();

		for ($i = 0; $i < sizeof($result); $i++) {

			$start_date = strtotime($result[$i][0]);

			$end_date = strtotime($result[$i][1]);
			$start_date_from_user = strtotime($startTime);
			$end_date_from_user = strtotime($endTime);
			$id = ($result[$i][2]);
			$overlappingtitle = $result[$i][3];

			$test = dateIsBetween($start_date, $end_date, $start_date_from_user, $end_date_from_user, $id, $GLOBALS['eventId']);

			if (($test["a"] == 'found_over_lapping_hours_at_middle' || $test["a"] == 'found_over_lapping_hours_at_start' || $test["a"] == 'found_over_lapping_hours_at_end') && $test["d"] != $test["e"]) {
				$printstartdate = date("Y-m-d H:i", $start_date);
				$printenddate = date("Y-m-d H:i", $end_date);

				echo $test["a"] . "," . $printstartdate . "," . $printenddate . "," . $test["d"] . "," . $overlappingtitle;

				break;
			}


		}
		echo "";

	}

	if (!empty($_GET['funcname'])) {
		$funcname = $_GET['funcname'];
		switch ($funcname) {
			case 'checkforoverlappingdays':

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
							checkOverlapingWeekMode($startTime, $endTime);
						}
					}
				}

				createDateRangeArray($start, $end);
				break;
			case 'checkforoverlappingweeks':
				$formatEndHour = $GLOBALS['$formatEndHour'];
				$formatStartHour = $GLOBALS['$formatStartHour'];

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
					$prevmounth = 0;
					$esc = false;
					//foreach ($years as $year) {

					foreach ($mounths as $mounth) {
						foreach ($days as $day) {
							if ($i <= count($days) && $j <= count($mounths) && count($mounths) == 1) {
								$firstYear = array_values($years)[0];
								setDateToParse($firstYear, $mounth, $day, $formatStartHour, $formatEndHour);
							} elseif ($i < count($days) && $j <= count($mounths)) {
								if ($prevmounth < $mounth && $esc == false) {
									$firstYear = array_values($years)[0];
									setDateToParse($firstYear, $mounth, $day, $formatStartHour, $formatEndHour);
								} else {
									$secondyYear = array_values($years)[1];
									setDateToParse($secondyYear, $mounth, $day, $formatStartHour, $formatEndHour);
									$esc = true;
									$prevmounth = 0;
								}
								if ($esc == false) {
									$prevmounth = $mounth;
									// $esc=false;
								}
							}
							$i++;
						}
						$i = 0;
						$j++;
					}
					//}
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
							checkOverlapingWeekMode($startTime, $endTime);

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

				getMounth($period, $dayToRepeat, $yearStart, $yearEnd, $formatStartHour, $formatEndHour);
				break;
			case 'checkforoverlappingmonth':
				$startTime = $GLOBALS['$startMonth'];
				$endTime = $GLOBALS['$endMonth'];
				checkOverlaping($startTime, $endTime);
				break;
			case 'checkforoverlappingyear':
				$startTime = $GLOBALS['$startMonth'];
				$endTime = $GLOBALS['$endMonth'];

				checkOverlaping($startTime, $endTime);
				break;

		}
		
}