var app = angular.module('justrun.trxform', []);


app.controller('TrxFormController', ['$scope', '$modal', '$aside', 'toaster', 'TrxFactory', '$mdDialog', '$http',  'CustomersFactory','CalendarFactory','Domain',
    function ($scope, $modal, $aside, toaster, TrxFactory, $mdDialog, $http, CustomersFactory,CalendarFactory,Domain) {
		
		$scope.customers = [];
		$scope.timenow = "";
		$scope.event = TrxFactory;
		$scope.customerobjarr = $scope.event.detailsArray; //for autocomplete
		var counter = 0;
		var event_id = "";
		$scope.formData = { 
			selected: undefined,
			datenow: "",
			time: "",
			maxcount: 0,
			selectedDate: "",
			selectedfromenter: ""
		};
		$scope.init = function () {
			var data = $scope.dateclicked;
			var eventTime = data._start._d;
			event_id = $scope.dateclicked["event_id"];
			$scope.formData.datenow = moment($scope.dateclicked.startsAt).format("DD/MM/YYYY");
			angular.forEach(data["details"], function (value, key) {
				counter++;
				$scope.formData.maxcount++;
				$scope.customers.push(value);
			});

			var hour = moment(data.startsAt).hour().toString();
			var minute = moment(data.startsAt).minute().toString();
			var date = new Date();
			date.setHours(hour);
			date.setMinutes(minute);

			if (hour.length == 1) {
				hour = "0" + hour;
			}
			if (minute.length == 1) {
				minute = "0" + minute;
			}

			$scope.formData.time = eventTime;
			$scope.timenow = "-" + hour + ":" + minute;
		};
		$scope.isTimeSet = function () {
			return $scope.formData.time == ""
		};
		$scope.getApprovedImage = function (customer) {
			if (customer.approved == 1) {
				return "http://justrun.site/images/v_green.svg"
			} else {
				if (customer.cancel == 1) {
					return "http://justrun.site/images/x_red.svg"
				} else {
					return "http://justrun.site/images/question-sign.svg"
				}
			}
		};
		$scope.isCustTemp = false;
		$scope.TempCustomer = function (type){
			if (type == 'temp'){
				$scope.isCustTemp = true;
			}else{
				$scope.isCustTemp = false;
			}
		}
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
			 
			if ($scope.showAlertCounter()) {
				$(".trx-dropdown-menu").toggle();
				return;
			}
			if (showAlertSameUser(item.user_id)) {
				$(".trx-dropdown-menu").toggle();
				return;
			}

			if (counter < $scope.formData.maxcount) {
				$scope.event.createCustomerTrx(item, event_id, 0, 0, 0, 0);
				$scope.customers.push(item);
				counter++;
			}
		};
		$scope.addFromUpdateEnter = function () {
			var phone_number = $scope.formData.phonetemp;
			if (phone_number == '' || phone_number == null || typeof phone_number === 'undefined') {
				var confirm = $mdDialog.confirm().title('Temporary client error')
					.textContent('Inserting a temporary client requires the insertion of a phone number')
					.ok('OK')
					.targetEvent(event)
					.disableParentScroll(false);
				$mdDialog.show(confirm).then(function () {
				})
				return;
			}

			maxcount = $scope.showAlertCounter();

			if (maxcount == true) {
				return;
			}
			counter++;
			var namearr = $scope.formData.selectedfromenter.split(" ");
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
					'email': 0,
					'birth_date': 0,
					'sign_date': 0,
					'ref': 0.,
					'trx': 0,
					'phone_number': phone_number,
					'program': 0
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

				$scope.event.createCustomerTrx(customer, event_id, 0, 0, 0, 0);
				$scope.customers.push(customer);
			});
		};

		$scope.showAlertCounter = function() {
			if ($scope.formData.maxcount == counter) {
				var ale = $mdDialog.alert({
						onRemoving: function () {
							$(".trx-dropdown-menu").toggle()
						}
					})
					.title('Maximum Participants - Please Change Quantity')
					.ok('Ok')
					.parent(angular.element(document.querySelector('#trxnew')));
				$mdDialog.show(ale).finally(function () {
				$scope.formData.selected='';
					ale = undefined;
				
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
					.ok('Ok')
					.parent(angular.element(document.querySelector('#trxnew')));
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

		$scope.UpdateCustomer = function (customer) {
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
			
			$scope.event.updateTrxEventTime(event_id,time);
			angular.forEach($scope.customers, function (value, key) {

				$scope.event.updateCustomer(value, event_id,time);
			});
			$scope.event.addUnListedCustomer($scope.customers, event_id);
			toaster.pop('success', 'Updated successfully!');


			$scope.enterdatamodal.hide();
		};

		$scope.deleteCustomer = function (customer) {
			var confirm = $mdDialog.confirm().title('Delete ' + customer["name"] + '?')
				.parent(angular.element(document.querySelector('#trxnew')))
				.textContent('The data will be deleted and can not be restored ')
				.ok('Delete')
				.cancel('Cancel')
				.targetEvent(event)
				.disableParentScroll(false);
			$mdDialog.show(confirm).then(function () {
				counter--;
				$scope.event.deleteCustomer(customer.name, customer.user_id, event_id).success(function (data) {
					toaster.pop('success', 'Data successfully deleted');
					var index = $scope.customers.indexOf(customer);
					$scope.customers.splice(index, 1);

				})
			})
		};

		$scope.deleteEvent = function () {
			var confirm = $mdDialog.confirm().title('Delete event?')
				.parent(angular.element(document.querySelector('#trxnew')))
				.textContent('Data will be deleted and can not be recovered')
				.ok('Delete')
				.cancel('Cancel')
				.targetEvent(event)
				.disableParentScroll(false);
			$mdDialog.show(confirm).then(function () {
				$http({
					method: 'GET',
					//DO NOT FORGET TO CHANGE THE URL!!!!!//
					url: Domain +'trx/trx.php/?actionname=deleteevent',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					},
					params: {
						'event_id': event_id

					}
				}).success(function (data) {
					CalendarFactory.daleteTrxEvent(event_id);
					$scope.event.deleteEvent(event_id);
					$scope.hideModal();
				});
			})
		}
    }]);