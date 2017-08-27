var app = angular.module('justrun.trxnewevent', []);


app.controller('TrxEventController', ['$scope', '$modal', '$aside', 'toaster', 'TrxFactory', '$mdDialog', '$http', 'CustomersFactory', 'CalendarFactory','Domain',
    function ($scope, $modal, $aside, toaster, TrxFactory, $mdDialog, $http, CustomersFactory, CalendarFactory,Domain) {
		$scope.customers = [];
		$scope.timenow = "";
		$scope.event = TrxFactory;
		$scope.customerobjarr = $scope.event.detailsArray; //for autocomplete

		var counter = 0;
		var event_id = "";
		var maxcount;
		$scope.formData = {
			selected: undefined,
			datenow: "",
			time: "",
			maxcount: 0,
			selectedDate: "",
			selectedfromenter: ""
		};

		$scope.isCustTemp = false;

		$scope.TempCustomer = function (type){
			if (type == 'temp'){
				$scope.isCustTemp = true;
			}else{
				$scope.isCustTemp = false;

			}
		}

		$scope.createNewEvent = function () {

			var time = moment($scope.formData.time).toObject();
			var hour = time.hours.toString();
			var minute = time.minutes.toString();
			//formating the  time like: 10 : 15
			if (hour.length == 1) {
				hour = "0" + hour;
			}
			if (minute.length == 1) {
				minute = "0" + minute;
			}
			time = hour + " : " + minute;
			//END - formating the time
			var date = $scope.fullDate;
			var removeSpacecFromTime = time.replace(/ /g, "")
			var dateToString = date.toString();
			var newTime = dateToString.replace("00:00:00", removeSpacecFromTime + ":00 ")
			var newDate = new Date(newTime)
			console.log(newDate)
			console.log(moment(newDate).format("YYYY-MM-DD HH:mm"))
			var data = {
				allday: false,
				start: moment(newDate).format("YYYY-MM-DD HH:mm"),
				end: moment(newDate).format("YYYY-MM-DD HH:mm"),

			}
			$scope.checkforoverlappinghours(data, $scope.eventid, time, date);

			//		$scope.event.createTrxEvent($scope.eventid, time, date);
			//		angular.forEach($scope.customers, function (value, key) {
			//			$scope.event.createCustomerTrx(value, $scope.eventid, 0, 0, 0, 0);
			//		});
			//		toaster.pop('success', 'added');
			//		$scope.customers = [];
			//		counter = 0;
			//		$scope.hideTrxModal();
		};

		$scope.isTimeSet = function () {
			return $scope.formData.time == ""
		};

		function guidTempUser() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16)
					.substring(1);
			}
			return 'T' + s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
		}
		$scope.OnSelect = function (item, model, label, event) {

			if (showAlertCounterNewEventCtrl()) {
				$(".trx-dropdown-menu").toggle();
				return;
			}
			if (showAlertSameUser(item.user_id)) {
				$(".trx-dropdown-menu").toggle();
				return;
			}

			//This is creating only one Event in events DB with unique ID.
			if (counter < $scope.formData.maxcount) {
				if (!$scope.isCreatedEvent) {
					$scope.isCreatedEvent = true;
				}
				$scope.customers.push(item);
				counter++;
			}
		};

		$scope.checkforoverlappinghours = function (data, eventid, time, date) {
			var overLappingDetails = [];
			var trxData = "";
			$http({
				method: 'POST',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'calendar/createnewevent.php/?funcname=checkforoverlappinghours',
				data: data,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (response) {
				if (response !== "") {

					var arr = response.split(",");
					overLappingDetails = {
						title: arr[4],
						start: arr[1],
						end: arr[2]
					}
					var formatStartTime = moment(overLappingDetails.start).format("DD-MM-YYYY , HH:mm");
					var formatEndTime = moment(overLappingDetails.end).format("DD-MM-YYYY , HH:mm");
					var details = "<p>" + "<b>" + '  Reminder tite: ' + "</b>" + overLappingDetails.title + "<br>" + "<b>" + " Start time :" + "</b>" + formatStartTime + "<br>" + "<b>" + " End time : " + "</b>" + formatEndTime + "</p>";
					var modesStatus = "";
					var referToContainer = '';
					var confirm = $mdDialog.confirm()
						.parent(angular.element(document.querySelector("body")))
						.title("Reminder times overlap")
						.htmlContent(details + '<br>Click OK to enter a reminder or cancel to change the hours')
						.ariaLabel(modesStatus)
						.ok('Ok')
						.cancel('Cancel');
					$mdDialog.show(confirm).then(function (modesStatus) {
						$scope.createEvent($scope.eventid, time, date);
					}, function () {
						console.log('Record not added!');
					});
				}
				else{
						$scope.createEvent($scope.eventid, time, date);
				}
			}).error(function (error) {});

		};
		$scope.createEvent = function (eventid, time, date) {
			$scope.event.createTrxEvent(eventid, time, date);
			angular.forEach($scope.customers, function (value, key) {
				$scope.event.createCustomerTrx(value, eventid, 0, 0, 0, 0);
			});
			toaster.pop('success', ' Event successfully added!');
			$scope.customers = [];
			counter = 0;
			$scope.hideTrxModal();
		};
		$scope.addFromEnter = function () {
			var phone_number = $scope.formData.phonetemp;
			if (phone_number == '' || phone_number == null || typeof phone_number === 'undefined') {
				var confirm = $mdDialog.confirm().title('Temporary client error')
					.textContent('Inserting a temporary client requires the insertion of a phone number')
					.ok('Ok')
					.targetEvent(event)
					.disableParentScroll(false);
				$mdDialog.show(confirm).then(function () {
				})
				return;
			}

			maxcount = showAlertCounterNewEventCtrl();
			if (maxcount == true) {
				return;
			}
			counter++;
			var namearr = $scope.formData.selectedfromenter.split(" ");
			if (namearr.length < 2) {
				namearr[1] = " ";
			}
			$http({
				method: 'GET',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'customers/createCustomer.php/?actionname=createtemp',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				params: {
					'first_name': namearr[0],
					'last_name': namearr[1],
					'phone_number':phone_number
				}
			}).success(function (data) {
				var customer = {
					name: $scope.formData.selectedfromenter,
					approved: 0,
					cancel: 0,
					arrived: 0,
					paid: 0,
					amount: 0,
					user_id: data
				};

				$scope.customers.push(customer);
			});
		};


		$(document).keydown(function (e) {

			var isDisable = $(".trainer-input").attr("disabled")
			var isMdDialog = $("md-dialog-content")

			if (isDisable == undefined && isMdDialog.length == 0) {
				if (e.which == 13) {

					var input = document.querySelector(".addTempCustommer")
					input.focus();
				}

			}
		});

		function showAlertCounterNewEventCtrl() {
			if ($scope.formData.maxcount == counter) {
				var alert = $mdDialog.alert({
						onRemoving: function () {
							$(".trx-dropdown-menu").toggle()
						}
					})
					.title('Maximum Participants - Please Change Quantity')
					.ok('Ok')
					.parent(angular.element(document.querySelector('#trxevent')));
				$mdDialog
					.show(alert)
					.finally(function () {
						alert = undefined;
					});
				return true;
			} else {
				return false;
			}
		}

		function showAlertSameUser(user_id) {
			var isuserexist = false;
			for (var i = 0; i < $scope.customers.length; i++) {
				if (user_id == $scope.customers[i].user_id) {
					isuserexist = true;
					break;
				}
			}
			if (isuserexist) {
				var alert2 = $mdDialog.alert({
						onRemoving: function () {
							$(".trx-dropdown-menu").toggle()
						}
					})
					.title('Practitioner already listed')
					.ok('OK')
					.parent(angular.element(document.querySelector('#trxevent')));
				$mdDialog
					.show(alert2)
					.finally(function () {
						alert2 = undefined;
					});
				return true;
			} else {
				return false;
			}
		}

		$scope.deleteCustomer = function (customer) {
			var confirm = $mdDialog.confirm().title(' Delete ' + customer["name"] + '?')
				.parent(angular.element(document.querySelector('#trxnew')))
				.textContent('The data will be deleted and can not be restored')
				.ok('OK')
				.cancel('Cancel')
				.targetEvent(event)
				.disableParentScroll(false);
			$mdDialog.show(confirm).then(function () {
				$scope.event.deleteCustomer(customer.name, customer.user_id, event_id).success(function (data) {
					toaster.pop('success', '  Data deleted successfully!!');
					var index = $scope.customers.indexOf(customer);
					$scope.customers.splice(index, 1);

					var event = $scope.event.findEventById(event_id);
					for (var i = 0; i < event["details"].length; i++) {

						if (event["details"][i].user_id == customer.user_id) {
							event["details"].splice(i, 1);
							break;
						}
					}
				})
			})
		};
		$scope.changeToCalendarForm = function () {
			$("#calendarNewEvent").remove();
			$scope.enterTrxdatamodal.hide()
			$scope.enterdatamodal = $modal({
				scope: $scope,
				templateUrl: 'calendar/calendarnewevent/calendarnewevent.html',
				show: true

			})


		}
				}]);