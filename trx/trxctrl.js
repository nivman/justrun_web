var app = angular.module('justrun.trx', ['ui.bootstrap']);
//var app = angular.module('justrun.trx', ['ui.calendar', 'ui.bootstrap']);

app.controller('TrxController', ['$stateParams', '$scope', '$modal', 'toaster', 'TrxFactory', 'CustomersFactory', '$localStorage', '$mdDialog', '$http','Domain',
	function ($stateParams, $scope, $modal, toaster, TrxFactory, CustomersFactory, $localStorage, $mdDialog, $http,Domain) {
		$scope.monthsArray = [];

		//open the from to insert or update reminder
		$scope.alertEventOnClick = function (date, jsEvent, view) {

			var cleanDate = moment(date._d).format("DD-MM-YYYY");
			$scope.fullDate = date._d;
			$scope.addEvent(date); 

			$scope.startdate = cleanDate;
			$scope.selectedDate = cleanDate;
		};

		/* remove event */
		$scope.remove = function (index) {
			$scope.events.splice(index, 1);
		};

		$scope.eventColor = function (data) {
			console.log(data)
		};

		$scope.changeView = function (view, element) {

			var viewMonth = moment(view.intervalStart._d).toObject().months + 1;
			var startDate = moment(view.intervalStart._d).toObject();
			var month = startDate.months + 1;
			for (i = 0; i < $scope.monthsArray.length; i++) {
				if ($scope.monthsArray[i] == month) {
					return;
				}
			}
			$scope.monthsArray.push(viewMonth);
			$scope.event.month = month;
			$scope.event.getCustomers();
			//$scope.event.getEvents();
		};

		$scope.alertOnEventClick = function (date, jsEvent, view) {
			var event_date = moment(date.start._d).format("DD/MM/YYYY HH:m");



			$scope.showmodal();
			$scope.dateclicked = date;
			$scope.datenow = event_date

		};
		//edit exist event
		$scope.eventClick = function (event) {

			$scope.showmodal();
			$scope.dateclicked = event;

		};
		$scope.showmodal = function (date) {

			$scope.enterdatamodal = $modal({
				scope: $scope,
				templateUrl: 'trx/form/trxnew.html',
				show: true
			})

		};
		$scope.hideModal = function () {
			$scope.enterdatamodal.hide();
		};

		$scope.event = TrxFactory;
		$scope.event_id = "";
		$scope.ismeridian = true;
		$scope.calendarDate = new Date();
		$scope.calendarView = 'month';
		$scope.calendarTitle = '';
		$scope.customersSelected = [];

		//add new event
		$scope.addEvent = function () {
			$scope.eventid = guid();
			$scope.enterdatamodal = $modal({
				scope: $scope,
				templateUrl: 'trx/form/newEvent.html',
				show: true
			})
		};

		$scope.hideModal = function () {
			$scope.enterdatamodal.hide();
		};


		function guid() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16)
					.substring(1);
			}

			return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
		}

		//		$('#calendarTrx').fullCalendar({
		//			lang: 'he',
		//			height: 650,
		//			editable: false,
		//			displatEventTime: false,
		//			fixedWeekCount: false,
		//			header: {
		//				left: 'month agendaWeek agendaDay',
		//				center: 'title',
		//				right: 'today next,prev'
		//			},
		//			columnFormat: {
		//				month: 'dddd'
		//			},
		//			titleFormat: {
		//				week: "MMMM D YYYY"
		//			},
		//			eventRender: $scope.eventRender,
		//			eventClick: $scope.alertOnEventClick,
		//			eventDrop: $scope.alertOnDrop,
		//			eventResize: $scope.alertOnResize,
		//			dayClick: $scope.alertEventOnClick,
		//			viewRender: $scope.changeView,
		//			eventAfterRender: function (event, element, view) {
		//			//	console.log(event)
		//				//	element.css('background', '-webkit-radial-gradient(50% 50%, circle farthest-corner, rgba(58, 174, 21, 1) 0%, rgba(1, 141, 0, 1) 100%, rgba(219, 0, 28, 1) 100%)');
		//				element.css('background', '-webkit-radial-gradient(50% 50%, circle farthest-corner, rgba(255, 0, 0, 1) 0%, rgba(219, 0, 28, 1) 100%)');
		//			}
		//		})

	}]);
app.factory("TrxFactory", ['$filter', '$http', '$mdDialog', 'toaster', '$q','CalendarFactory','Domain', function ($filter, $http, $mdDialog, toaster, $q,CalendarFactory,Domain) {
	var self = {
		'calOptions': {
			calender: {
				editable: true
					// eventClick: $scope.alertOnEventClick,
					// dayClick: $scope.alertOnDayClick
			}
		},
		'formData': {},
		'customersarr': [],
		'month': moment(new Date()).format('M'),
		"detailsArray": [],
		'events': [],
		'eve': [],
		'deferred': "",
		'eventSources': [],
		'getEvents': function () {
		//	self.getCustomers();
			self.events = [];
		
			self.deferred = $q.defer()
			$http.get(Domain +'trx/trx.php/?actionname=getevents&month=' + self.month).then(function (data) {
				self.eve = [];

				angular.forEach(data.data, function (value) {
					var details = [];
					var time = value["event_time"];

					var hour = time.slice(0, 2);
					var minute = time.slice(5, 7);
					var date = new Date(value["event_date"]);
					var ts = moment(date).toObject();
					var monthsS = ts.months + 1;
					var y = ts.years;
					var m = ts.months;
					var d = ts.date;
					var hr = ts.hours;
					var mi = ts.minutes;
					var te = moment(date).toObject();
					var ye = te.years;
					var me = te.months;
					var de = te.date;
					var hre = te.hours;
					var mie = te.minutes;
					var newEvent = {
						stick: true,
						title: "TRX",
						type: 'info',
						start: new Date(y, m, d, hour, minute),
						end: new Date(y, m, d, hour, minute),
						id: value.id,
						details: details,
						event_id: value.event_id
					};
					self.eve.push(newEvent);

				});
				self.deferred.resolve(self.eve)
				self.getCustomers();
				//self.getTrx();
			})
			return self.deferred.promise
		},

		'getTrx': function () {
			$http({
				method: 'GET',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'trx/trx.php/?actionname=gettrx',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (data) {
				angular.forEach(data, function (value, key) {
					var username = "";
					if (self.getCustomerById(value["user_id"]) != undefined) {
						username = self.getCustomerById(value["user_id"])["name"];
						var arrived = value["arrived"];
						var paid = value["paid"];
						if (arrived == 1) {
							arrived = 'YES';
						} else {
							arrived = 'NO';
						}
						if (paid == 1) {
							paid = 'YES';
						} else {
							paid = 'NO';
						}
						var newuser = {
							name: username,
							approved: value["approved_customer"],
							cancel: value["cancel_customer"],
							arrived: arrived,
							paid: paid,
							amount: value["amount"],
							user_id: value["user_id"]
						};
						var eve_test = self.findEveById(value["event_id"]);
						if (typeof eve_test !== 'undefined') {
							eve_test.details.push(newuser);

						}
					}
				});
			});
		},
		'createCustomerTrx': function (customer, event_id, approved, cancel, arrived, paid) {
			$http({
				method: 'GET',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'trx/trx.php/?actionname=insertrx',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				params: {
					'userid': customer.user_id,
					'event_id': event_id,
					'approved': approved,
					'cancel': cancel,
					'arrived': arrived,
					'paid': paid
				}
			}).success(function (data) {

			});
			var eve_test = self.findEveById(event_id);

			var newuser = {
				name: customer["name"],
				approved: 0,
				cancel: 0,
				arrived: 0,
				paid: 0,
				amount: 0,
				user_id: customer.user_id
			};
			if (eve_test != undefined) {
				eve_test["details"].push(newuser);
			}

		},
		'createTrxEvent': function (event_id, event_time, event_date) {
			
			self.eve = [];
			var details = [];
			var time = event_time;
			var hour = time.slice(0, 2);
			var minute = time.slice(5, 7);
 
			var date = event_date;
			date.setHours(hour);
			date.setMinutes(minute);
			var eventDate = new Date(event_date);
			var ts = moment(eventDate).toObject();
			var monthsS = ts.months + 1;
			var y = ts.years;
			var m = ts.months;
			var d = ts.date;
			var hr = ts.hours;
			var mi = ts.minutes;
			var te = moment(eventDate).toObject();
			var ye = te.years;
			var me = te.months;
			var de = te.date;
			var hre = te.hours;
			var mie = te.minutes;
			var newEvent = {
				stick: true,
				title: "TRX",
				type: 'info',
				start: new Date(y, m, d, hour, minute),
				end: new Date(y, m, d, hour, minute),
				details: details,
				event_id: event_id
			};

			self.eve.push(newEvent);

			$("#calendar").fullCalendar("addEventSource", self.eve);
			$http({
				method: 'GET',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'trx/trx.php/?actionname=insertevent',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				params: {
					'event_id': event_id,
					'event_time': event_time,
					'event_date': event_date
				}
			}).success(function (data) {
				self.crerteEventInCalendar(newEvent)
			})

		},
		'crerteEventInCalendar':function(newEvent){
				
			var trxData ={
				allday:false,
				start:moment(newEvent.start).format("YYYY-MM-DD HH:mm"),
				end:moment(newEvent.end).format("YYYY-MM-DD HH:mm"),
				description:newEvent.event_id,
				mailtoreminder:"",
				reminder:"",
				stick:true,
				title:"TRX",
				username:"TRX",
				repeatevent:newEvent.event_id,
				eventId:newEvent.event_id
			}

			CalendarFactory.addnewevent("TRX", "", trxData);
		},
		'updateTrxEventTime': function (event_id, time) {

			$http({
				method: 'GET',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'trx/trx.php/?actionname=updateTrxEventTime',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				params: {
					'event_id': event_id,
					'event_time': time

				}
			}).success(function (data) {})
			var newTime= time.replace(" : ",":")+":00";
			var eveIndex="";
				
			for (i = 0; i < self.eve.length; i++) {
				if (self.eve[i].event_id === event_id) {
						
					var end =self.eve[i].end.toString()
						console.log(end)
					var setNewTime= end.replace(/\d+:\d+:\d+/,newTime);
					var toDate = new Date(setNewTime)
					var index = self.eve.indexOf(self.eve[i])
					eveIndex=self.eve[index].start = toDate
					eveIndex=self.eve[index].end = toDate
				
				}
			}
			 $('#calendar').fullCalendar('removeEventSource', self.eve);
		 $("#calendar").fullCalendar('addEventSource', self.eve);

		},

		'getCustomers': function () {
			self.detailsArray = [];
			return $http({
				method: 'GET',
				url: Domain +'customers/customers.php/?funcname=getcustomerstrx'
			}).success(function (data) {
				angular.forEach(data, function (value) {

					self.detailsArray.push({
						name: value["first_name"] + " " + value["last_name"],
						user_id: value["id"],
						phonenumber: value["phone_number"],
						email: value["email"]
					});
				});
				self.getTrx();
				//self.getEvents();
			})

		},
		'getCustomerById': function (userid) {

			for (var i = 0; i < self.detailsArray.length; i++) {

				if (userid == self.detailsArray[i]["user_id"]) {
					return self.detailsArray[i];
				}
			}
		},
		'applyReminder': function (phonenumbers) {
			var confirm = $mdDialog.confirm().title("Send Reminder?")
				.ok('OK')
				.cancel('Cancel')
				.targetEvent(event)
				.disableParentScroll(false);
			$mdDialog.show(confirm).then(function () {
				$http({
					method: 'GET',
					url: Domain +'trx/trx.php/?actionname=reminder',
					params: {
						'phonenumbers': JSON.stringify(phonenumbers)
					}

				}).success(function (data) {

				})
			});
		},

		'findEveById': function (id) {
			for (var i = 0; i < self.eve.length; i++) {
				if (id == self.eve[i]["event_id"]) {

					return self.eve[i];
				}
			}
		},
		'updateCustomer': function (customer, event_id, time) {
			console.log(time)
			var arrived = "";
			var paid = "";
			if (customer.arrived == 'YES') {
				arrived = 1;
			} else {
				arrived = 0;
			}
			if (customer.paid == 'YES') {
				paid = 1;
			} else {
				paid = 0;
			}
			return $http({
				method: 'GET',
				url: Domain +'trx/trx.php/?actionname=updatecustomer',
				params: {
					arrived: arrived,
					paid: paid,
					amount: parseInt(customer.amount),
					event_id: event_id,
					user_id: customer.user_id
				}
			}).success(function (data) {
				//console.log(data)

			})

		},
		'addUnListedCustomer': function (customers, event_id) {
			for (i = 0; i < self.eve.length; i++) {
				if (self.eve[i].event_id == event_id) {
					for (j = 0; j < customers.length; j++) {
						if (self.eve[i].details[j] == undefined) {
							self.eve[i].details.push(customers[j])
						}
					}
					break;
				}
			}
		},
		'deleteCustomer': function (name, user_id, event_id) {
			for (i = 0; i < self.eve.length; i++) {
				if (self.eve[i].event_id == event_id) {
					for (j = 0; j < self.eve[i].details.length; j++) {
						if (self.eve[i].details[j].user_id == user_id) {
							var index = self.eve[i].details.indexOf(self.eve[i].details[j]);
							self.eve[i].details.splice(index, 1)
						}
					}
				}
			}
			return $http({
				method: 'GET',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'trx/trx.php/?actionname=delete',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				params: {
					user_id: user_id,
					event_id: event_id
				}
			})
		},
		'deleteEvent': function (event_id) {
			var index = self.events.indexOf(event);
			self.eve.splice(index, 1);
			$('#calendar').fullCalendar('removeEvents', function (event) {
				if (event_id == event.event_id) {
					return true;
				}
			});
		}
	};
	return self;
}]);
//		'getEvents': function () {
//			
//		
//			self.events = [];
//			self.eve = [];
//		
//	
//				
//			
//			
//			 $http({
//				method: 'GET',
//				//DO NOT FORGET TO CHANGE THE URL!!!!!//
//				url: Domain +'trx/trx.php/?actionname=getevents&month=' + self.month,
//				headers: {
//					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//				}
//			}).success(function (data) {
//
//				self.eve = [];
//				angular.forEach(data, function (value) {
//					var details = [];
//					var time = value["event_time"];
//					var hour = time.slice(0, 2);
//					var minute = time.slice(5, 7);
//					var date = new Date(value["event_date"]);
//					var ts = moment(date).toObject();
//					var monthsS = ts.months + 1;
//					var y = ts.years;
//					var m = ts.months;
//					var d = ts.date;
//					var hr = ts.hours;
//					var mi = ts.minutes;
//					var te = moment(date).toObject();
//					var ye = te.years;
//					var me = te.months;
//					var de = te.date;
//					var hre = te.hours;
//					var mie = te.minutes;
//					var newEvent = {
//						stick: true,
//						title: "TRX",
//						type: 'info',
//						start: new Date(y, m, d, hour, minute),
//						end: new Date(y, m, d, hour, minute),
//						id: value.id,
//						details: details,
//						event_id: value.event_id
//					};
//					self.eve.push(newEvent);
//				
//				});
//					
//				self.getTrx();
//				
//			});
//		},
//		'createEvents': function (usersid, event_id, date, time) {
//				
//			var tempdate = moment(date).toObject();
//			date = tempdate.years + "/" + (tempdate.months + 1) + "/" + tempdate.date;
//			var entity = {
//				users_id: usersid,
//				event_id: event_id,
//				date: date,
//				time: time
//			};
//
//			return $http({
//				method: 'POST',
//				//DO NOT FORGET TO CHANGE THE URL!!!!!//
//				url: Domain +'trx/trx.php/',
//				data: {
//					entity: entity,
//					actionname: 'create'
//				},
//				headers: {
//					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//				}
//			});
//		},