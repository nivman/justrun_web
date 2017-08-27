app.controller('CalendarEventForm', ['$scope', '$modal', 'Calendardetails', 'CalendarFactory', '$log', '$mdDialog', '$rootScope', 'TrxFactory', function ($scope, $modal, Calendardetails, CalendarFactory, $log, $mdDialog, $rootScope, TrxFactory) {
	$scope.neweventservice = CalendarFactory;
	//$scope.event = TrxFactory;
	//$scope.customerobjarr = $scope.event.detailsArray;
	//console.log($scope.customerobjarr)
	//$scope.event.getCustomers();
	$scope.shared = CalendarFactory.shared_scope;
	$scope.shared.show = function () {
		$scope.neweventservice.checkOverlap = true;
	};
	$scope.shared.hide = function () {
		$scope.neweventservice.checkOverlap = false;
	};
	$scope.openemailbox = function (ev) {
		var getTokenfromLocalStorage = JSON.stringify(localStorage['ngStorage-token']);
		var getemail = getTokenfromLocalStorage.replace(/ \| .+/, "").replace(/.+"/, '');
		$scope.alertmail = false;
		var confirm = $mdDialog.prompt()
			.parent(angular.element(document.querySelector('#calender-main-contant')))
			.title('Email Reminder')
			.placeholder("Email")
			.initialValue(getemail)
			.targetEvent(ev)
			.ok('Ok')
			.cancel('Cancel');
		$mdDialog.show(confirm).then(function (result) {
			$scope.targetmail = result;
			$scope.neweventservice.formdata.targetmail = result;
			$scope.alertmail = true;
		}, function () {});
	};
	$scope.startdate = Calendardetails.getDate();
	$scope.hideRepeatDialog = function () {
		$scope.enableClick();
		$(".modal-backdrop").remove();
		$scope.container = 'false';
	};
	$scope.neweventservice.formdata.eventtitle = "";
	$scope.neweventservice.formdata.eventdescription = "";
	$scope.neweventservice.formdata.eventstarthour = "";
	$scope.neweventservice.formdata.eventendhour = "";
	$scope.neweventservice.formdata.selecetreminder = "";
	$scope.neweventservice.formdata.username = "";
	$scope.neweventservice.formdata.reminder = false;
	$scope.neweventservice.formdata.allday = false;
	if ($scope.startdate[0] != "null") {
		$scope.neweventservice.formdata.guid = null;
		var t = moment($scope.startdate[0]._d).toObject();
		var m = t.months + 1;
		$scope.today = function () {
			$scope.neweventservice.formdata.eventstartdate = new Date(t.years + "," + m + "," + t.date);
			$scope.neweventservice.formdata.eventenddate = new Date(t.years + "," + m + "," + t.date);
		};
		$scope.today();
		$scope.formTitle = "Add reminder";
		$scope.neweventservice.formdata.insertMode = "insert";
		$scope.neweventservice.formdata.names = [{
			name: "user1",
			text: "user1"
		}, {
			name: "user2",
			text: "user2"
		}, {
			name: "user3",
			text: "user3"
		}];
	} else {
		var years = moment($scope.eventSelectedStartDate, "DD-MM-YYYY").format("YYYY");
		var months = moment($scope.eventSelectedStartDate, "DD-MM-YYYY").format("MM");
		var days = moment($scope.eventSelectedStartDate, "DD-MM-YYYY").format("DD");
		var yeare = moment($scope.eventSelectedEndDate, "DD-MM-YYYY").format("YYYY");
		var monthe = moment($scope.eventSelectedEndDate, "DD-MM-YYYY").format("MM");
		var daye = moment($scope.eventSelectedEndDate, "DD-MM-YYYY").format("DD");
		$scope.neweventservice.formdata.eventstartdate = new Date(years + "," + months + "," + days);
		$scope.neweventservice.formdata.eventenddate = new Date(yeare + "," + monthe + "," + daye);
		$scope.time = Calendardetails.getbreakStartTime();
		var starthour = $scope.time[0];
		var startmin = $scope.time[1];
		var endhour = $scope.time[2];
		var endmin = $scope.time[3];
		$scope.neweventservice.formdata.eventstarthour = new Date().setHours(starthour, startmin);
		$scope.neweventservice.formdata.eventendhour = new Date().setHours(endhour, endmin);
		$scope.neweventservice.formdata.eventtitle = $scope.eventSelectedTitle;
		$scope.neweventservice.formdata.eventdescription = $scope.eventSelectedDescription;
		$scope.formTitle = "Edit reminder";
		$scope.neweventservice.formdata.insertMode = "update";
		$scope.neweventservice.formdata.eventId = $scope.eventId;
		$scope.neweventservice.formdata.userName = $scope.username;
		$scope.neweventservice.formdata.guid = $scope.guid;
		var setusername;
		if ($scope.username == "user1") {
			setusername = 0;
		} else if ($scope.username == "user2") {
			setusername = 1;
		} else {
			setusername = 2;
		}
		$scope.neweventservice.formdata.names = [{
			name: "user1",
			text: "user1"
				}, {
			name: "user2",
			text: "user2"
				}, {
			name: "user3",
			text: "user3"
				}];
		$scope.neweventservice.formdata.username = $scope.neweventservice.formdata.names[setusername];
	}
	$scope.inlineOptions = {
		customClass: getDayClass,
		minDate: new Date(),
		showWeeks: true
	};
	$scope.dateOptions = {
		formatYear: 'yy',
		maxDate: new Date(2120, 5, 22),
		minDate: new Date(2016, 5, 25),
		startingDay: 1
	};
	$scope.toggleMin = function () {
		$scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
		$scope.dateOptions.minDate = $scope.inlineOptions.minDate;
	};
	$scope.toggleMin();
	$scope.open1 = function () {
		$scope.popup1.opened = true;
	};
	$scope.open2 = function () {
		$scope.popup2.opened = true;
	};
	$scope.open3 = function () {
		$scope.popup3.opened = true;
	};
	$scope.setDate = function (day, month, year) {
		$scope.formdata.eventstartdate = new Date(day, month, year);
	};
	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	$scope.format = $scope.formats['yyyy-MM-dd'];
	$scope.altInputFormats = ['M!/d!/yyyy'];
	$scope.popup1 = {
		opened: false
	};
	$scope.popup2 = {
		opened: false
	};
	$scope.popup3 = {
		opened: false
	};
	var tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);
	var afterTomorrow = new Date();
	afterTomorrow.setDate(tomorrow.getDate() + 1);
	$scope.events = [{
		date: tomorrow,
		status: 'full'
    }, {
		date: afterTomorrow,
		status: 'partially'
    }];

	function getDayClass(data) {
		var date = data.date,
			mode = data.mode;
		if (mode === 'day') {
			var dayToCheck = new Date(date).setHours(0, 0, 0, 0);
			for (var i = 0; i < $scope.events.length; i++) {
				var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);
				if (dayToCheck === currentDay) {
					return $scope.events[i].status;
				}
			}
		}
		return '';
	}
	$scope.mytime = new Date();
	$scope.ismeridian = true;
	$scope.toggleMode = function () {
		$scope.ismeridian = !$scope.ismeridian;
	};
	$scope.update = function () {
		var d = new Date();
		d.setHours(14);
		d.setMinutes(0);
		$scope.mytime = d;
	};
	$scope.clear = function () {
		$scope.mytime = null;
		$scope.dt = null;
	};
	$scope.products = Calendardetails.getDate();
	$scope.startdate = moment($scope.products[0]._d).format('DD-MM-YYYY').replace(/T.+/, "");
	$scope.title = "";
	$scope.checkFormValidationForRepeat = function () {
		if ($scope.neweventservice.formdata.eventtitle === "" || $scope.neweventservice.formdata.eventtitle === undefined) {
			$scope.title = 'No header inserted';
			$scope.popUpMassage($scope.title);
		} else if ($scope.neweventservice.formdata.eventstarthour > $scope.neweventservice.formdata.eventendhour) {
			$scope.title = 'Start time is greater than end time';
			$scope.popUpMassage($scope.title);
			return;
		} else if ($scope.neweventservice.formdata.username === "") {
			$scope.title = 'No user name entered';
			$scope.popUpMassage($scope.title);
			return;
		} else if (($scope.neweventservice.formdata.eventstarthour === undefined || $scope.neweventservice.formdata.eventendhour === undefined || $scope.neweventservice.formdata.eventendhour === "" || $scope.neweventservice.formdata.eventstarthou === "") && ($scope.neweventservice.formdata.allday === false || $scope.neweventservice.formdata.allday === undefined)) {
			$scope.title = 'Start time or end time was not entered';
			$scope.popUpMassage($scope.title);
			return;
		} else if (String($scope.neweventservice.formdata.eventstarthour) == String($scope.neweventservice.formdata.eventendhour) && ($scope.neweventservice.formdata.allday === false || $scope.neweventservice.formdata.allday === undefined) && String($scope.neweventservice.formdata.eventstartdate) == String($scope.neweventservice.formdata.eventenddate)) {
			$scope.title = 'Start time and end time equal';
			$scope.popUpMassage($scope.title);
			return;
		} else {
			$scope.container = 'true';
		}
		$scope.formatStartDate = moment($scope.neweventservice.formdata.eventstartdate).format("DD-MM-YYYY");
	};
	$scope.popUpMassage = function (title) {
		$scope.container = 'false';
		$mdDialog.show(
			$mdDialog.alert()
			.parent(angular.element(document.querySelector('#calender-main-contant')))
			.clickOutsideToClose(true)
			.title(title)
			.ariaLabel('Alert Dialog Demo')
			.ok('Got it!')
		);
	};
	$scope.hideTrxModal = function () {
		$scope.enterTrxdatamodal.hide();
	};
	$scope.changeToTrxForm = function () {
		$('#calendarNewEvent').remove();
		$scope.enterdatamodal.hide();
		var date = moment($scope.startdate, "DD-MM-YYYY");
		$scope.fullDate = date._d;
		$scope.eventid = $scope.guid();
		$scope.enterTrxdatamodal = $modal({
			scope: $scope,
			templateUrl: 'trx/form/newEvent.html',
			show: true
		});
	}
	
	$scope.guid = function () {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
	};
	$scope.$watchCollection('neweventservice.formdata.eventtitle', function (NewValue, OldValue) {
	if (NewValue !== undefined) {
		var lastChar = NewValue.substr(NewValue.length - 1);
		if (lastChar == ",") {
			$scope.neweventservice.formdata.eventtitle = OldValue;
			$mdDialog.show(
				$mdDialog.alert()
				.parent(angular.element(document.querySelector('#dialogContainer')))
				.clickOutsideToClose(true)
				.title('Event name can not contain commas')
				.ariaLabel('Alert Dialog Demo')
				.ok('Got it!')
			);
		}
	}
});
		//watch the reminder schedule that user enter and output the result 
	$scope.$watchCollection('neweventservice.formRepeatEvent.repeats', function (NewValue, OldValue) {
	switch (NewValue) {
	case "1":
		day = " Daily reminder set ";
		$scope.Summary = day;
		$scope.type = "1";
		$scope.frequency = "";
		break;
	case "2":
		day = " A weekly reminder has been set ";
		$scope.Summary = day;
		$scope.type = "2";
		$scope.frequency = "";
		break;
	case "3":
		day = " A monthly reminder has been set ";
		$scope.Summary = day;
		$scope.type = "3";
		$scope.frequency = "";
		break;
	case "4":
		day = " An annual reminder has been set ";
		$scope.Summary = day;
		$scope.type = "4";
		$scope.frequency = "";
		break;
	}
});
	$scope.$watchCollection('neweventservice.formRepeatEvent.repeatsEvery', function (NewValue, OldValue) {
	// determine if $scope.type =1 : by day ,if $scope.type=3 by mounth
	if ($scope.type == 1)

		var day;
	var removeDaytIfExists = "";
	var frequencyInput = $scope.frequency;
	var mounthInYear = $scope.repeatsAtMounth;

	switch (NewValue) {
	case "1":
		if ($scope.type == 1) {
			$scope.frequency = "Every day";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the first of every month " + " - " + removeDaytIfExists;
		}

		break;
	case "2":
		if ($scope.type == 1) {
			$scope.frequency = " Every two days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the second of every  month" + " - " + removeDaytIfExists;
		}
		break;
	case "3":
		if ($scope.type == 1) {
			$scope.frequency = "Every three days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the third of every  month"+ " - " + removeDaytIfExists;
		}
		break;
	case "4":
		if ($scope.type == 1) {
			$scope.frequency = "Every four days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the fourth of every the month" + " - " + removeDaytIfExists;
		}
		break;
	case "5":
		if ($scope.type == 1) {
			$scope.frequency = "Every five days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the fifth of every  month" + " - " + removeDaytIfExists;
		}
		break;
	case "6":
		if ($scope.type == 1) {
			$scope.frequency = "Every six days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the six of every  month" + " - " + removeDaytIfExists;
		}
		break;
	case "7":
		if ($scope.type == 1) {
			$scope.frequency ="Every seven days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the seventh of every  month" + " - " + removeDaytIfExists;
		}
		break;
	case "8":
		if ($scope.type == 1) {
			$scope.frequency = "Every eight days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the eighth of every month" + " - " + removeDaytIfExists;
		}
		break;
	case "9":
		if ($scope.type == 1) {
			$scope.frequency = "Every nine days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the ninth of every month" + " - " + removeDaytIfExists;
		}
		break;
	case "10":
		if ($scope.type == 1) {
			$scope.frequency = "Every ten days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the tenth of every month" + " - " + removeDaytIfExists;
		}
		break;
	case "11":
		if ($scope.type == 1) {
			$scope.frequency = "Every eleven days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the eleven of every month" + " - " + removeDaytIfExists;
		}
		break;
	case "12":
		if ($scope.type == 1) {

			$scope.frequency = "Every twelve days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the twelve of every month"+ " - " + removeDaytIfExists;
		}
		break;
	case "13":
		if ($scope.type == 1) {
			$scope.frequency = "Every Thirteen Days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency ="On the thirteen of every month" + " - " + removeDaytIfExists;
		}
		break;
	case "14":
		if ($scope.type == 1) {
			$scope.frequency = "Every fourteen days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the fourteen of every month" + " - " + removeDaytIfExists;
		}
		break;
	case "15":
		if ($scope.type == 1) {
			$scope.frequency = "Every fifteen days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the fifteen of every month" + " - " + removeDaytIfExists;
		}
		break;
	case "16":
		if ($scope.type == 1) {
			$scope.frequency = "Every sixteen days";
        } else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the sixteen of every month" + " - " + removeDaytIfExists;
		}
		break;
	case "17":
		if ($scope.type == 1) {
			$scope.frequency = "Every seventeen days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the seventeen of every month" + " - " + removeDaytIfExists;
		}
		break;
	case "18":
		if ($scope.type == 1) {

			$scope.frequency = "Every eighteen days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the eighteen of every month"+ " - " + removeDaytIfExists;
		}
		break;
	case "19":
		if ($scope.type == 1) {
			$scope.frequency = "Every nineteen days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the nineteen of every month" + " - " + removeDaytIfExists;
		}
		break;
	case "20":
		if ($scope.type == 1) {
			$scope.frequency = "Every twenty days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the twentieth of every month" + " - " + removeDaytIfExists;
		}
		break;
	case "21":
		if ($scope.type == 1) {
			$scope.frequency = "Every twenty-one days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the twenty one of every month" + " - " + removeDaytIfExists;
		}
		break;
	case "22":
		if ($scope.type == 1) {

			$scope.frequency = "Every twenty-two days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the twenty two of every month" + " - " + removeDaytIfExists;
		}
		break;
	case "23":
		if ($scope.type == 1) {
			$scope.frequency = "Every twenty-three days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency ="On the twenty-three of every month"+ " - " + removeDaytIfExists;
		}
		break;
	case "24":
		if ($scope.type == 1) {
			$scope.frequency = "Every twenty-four days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the twenty-four of every month"+ " - " + removeDaytIfExists;
		}
		break;
	case "25":
		if ($scope.type == 1) {
			$scope.frequency = "Every twenty-five days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the twenty-five of every month" + " - " + removeDaytIfExists;
		}
		break;
	case "26":
		if ($scope.type == 1) {
			$scope.frequency = "Every twenty-six days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the twenty-six of every month" + " - " + removeDaytIfExists;
		}
		break;
	case "27":
		if ($scope.type == 1) {
			$scope.frequency = "Every twenty-seven days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the twenty-seven of every month" + " - " + removeDaytIfExists;
		}
		break;
	case "28":
		if ($scope.type == 1) {
			$scope.frequency = "Every twenty-eight days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = " On the twenty-eight of every month" + " - " + removeDaytIfExists;
		}
		break;
	case "29":
		if ($scope.type == 1) {
			$scope.frequency = "Every twenty-nine days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the twenty-nine of every month"+ " - " + removeDaytIfExists;
		}
		break;
	case "30":
		if ($scope.type == 1) {
			$scope.frequency = "Every thirty days";
		} else if ($scope.type == 3 || $scope.type == 4) {
			removeDaytIfExists = frequencyInput.replace(/.+-/, "");
			$scope.frequency = "On the thirty of every month"+ " - " + removeDaytIfExists;
		}
		break;
	}
});
	var showResult;
	var frequentDiscriptionSingleDay = "";
	for (var i = 0; i < $scope.days.length; i++) {
	$scope.$watchCollection('neweventservice.formRepeatEvent.selected', function (NewValue, OldValue) {
		var days = [];
		for (var key in NewValue) {
			if (NewValue[key] === true) {
				switch (key) {
				case "sunday":
					days.push("Sunday");
					break;
				case "monday":
					days.push("Monday");
					break;
				case "tuesday":
					days.push("Tuesday");
					break;
				case "wednesday":
					days.push("Wednesday");
					break;
				case "thursday":
					days.push("Thursday");
					break;
				case "friday":
					days.push("Friday");
					break;
				case "saturday":
					days.push("Saturday");
					break;
				}
			}
		}
		if (days.length === 0) {
			frequentDiscriptionSingleDay = "";
		} else if (days.length == 1) {
			frequentDiscriptionSingleDay = " Every  : ";
		} else {
			frequentDiscriptionSingleDay = " In the days  : ";
		}
		$scope.frequency = frequentDiscriptionSingleDay + days;
	});
	}
	$scope.$watchCollection('neweventservice.formRepeatEvent.repeatsYearEvery', function (NewValue, OldValue) {
	var frequencyInput = "";
	var removeYeatIfExists = "";
	frequencyInput = $scope.frequency;
	switch (NewValue) {
	case "1":
		removeYeatIfExists = frequencyInput.replace(/-.+/, "");
		$scope.frequency = removeYeatIfExists + " " + "For one year";
		break;
	case "2":
		removeYeatIfExists = frequencyInput.replace(/-.+/, "");
		$scope.frequency = removeYeatIfExists + " " + "For two years";
		break;
	case "3":
		removeYeatIfExists = frequencyInput.replace(/-.+/, "");
		$scope.frequency = removeYeatIfExists + " " + "For three years ";
		break;
	case "4":
		removeYeatIfExists = frequencyInput.replace(/-.+/, "");
		$scope.frequency = removeYeatIfExists + " " + "For four years";
		break;
	case "5":
		removeYeatIfExists = frequencyInput.replace(/-.+/, "");
		$scope.frequency = removeYeatIfExists + " " + "For five years";
		break;
	case "6":
		removeYeatIfExists = frequencyInput.replace(/-.+/, "");
		$scope.frequency = removeYeatIfExists + " " + "For six years";
		break;
	case "7":
		removeYeatIfExists = frequencyInput.replace(/-.+/, "");
		$scope.frequency = removeYeatIfExists + " " + "For seven years";
		break;
	case "8":
		removeYeatIfExists = frequencyInput.replace(/-.+/, "");
		$scope.frequency = removeYeatIfExists + " " + "For eight years";
		break;
	case "9":
		removeYeatIfExists = frequencyInput.replace(/-.+/, "");
		$scope.frequency = removeYeatIfExists + " " + "For nine years";
		break;
	case "10":
		removeYeatIfExists = frequencyInput.replace(/-.+/, "");
		$scope.frequency = removeYeatIfExists + " " + "For ten years";
		break;
	}
});
	$scope.$watchCollection('neweventservice.formRepeatEvent.repeatsAtMounth', function (NewValue, OldValue) {
	var removeMounthIfExists = "";

	frequencyInput = $scope.frequency;
	switch (NewValue) {
	case "01":
		removeMounthIfExists = frequencyInput.replace(/\,.+/, "");
		$scope.frequency = removeMounthIfExists + " , " + " Every January";
		break;
	case "02":
		removeMounthIfExists = frequencyInput.replace(/\,.+/, "");
		$scope.frequency = removeMounthIfExists + " , " + " Every February";
		break;
	case "03":
		removeMounthIfExists = frequencyInput.replace(/\,.+/, "");
		$scope.frequency = removeMounthIfExists + " , " + " Every March";
		break;
	case "04":
		removeMounthIfExists = frequencyInput.replace(/\,.+/, "");
		$scope.frequency = removeMounthIfExists + " , " + " Every April";
		break;
	case "05":
		removeMounthIfExists = frequencyInput.replace(/\,.+/, "");
		$scope.frequency = removeMounthIfExists + " , " + " Every May";
		break;
	case "06":
		removeMounthIfExists = frequencyInput.replace(/\,.+/, "");
		$scope.frequency = removeMounthIfExists + " , " + " Every June";
		break;
	case "07":
		removeMounthIfExists = frequencyInput.replace(/\,.+/, "");
		$scope.frequency = removeMounthIfExists + " , " + " Every July";
		break;
	case "08":
		removeMounthIfExists = frequencyInput.replace(/\,.+/, "");
		$scope.frequency = removeMounthIfExists + " , " + " Every August";
		break;
	case "09":
		removeMounthIfExists = frequencyInput.replace(/\,.+/, "");
		$scope.frequency = removeMounthIfExists + " , " + " Every September";
		break;
	case "10":
		removeMounthIfExists = frequencyInput.replace(/\,.+/, "");
		$scope.frequency = removeMounthIfExists + " , " + " Every October";
		break;
	case "11":
		removeMounthIfExists = frequencyInput.replace(/\,.+/, "");
		$scope.frequency = removeMounthIfExists + " , " + " Every November";
		break;
	case "12":
		removeMounthIfExists = frequencyInput.replace(/\,.+/, "");
		$scope.frequency = removeMounthIfExists + " , " + " Every December";
		break;
	}
});
}]);