var app = angular.module('justrun.payments', []);

app.controller('PaymentsController', ['$scope', '$http', 'CustomersFactory', '$modal', 'PaymentsFactory', '$timeout','Domain',
	function ($scope, $http, CustomersFactory, $modal, PaymentsFactory, $timeout,Domain) {


	$scope.payments = PaymentsFactory;
	$scope.paymentsautoarr = CustomersFactory.autocompetearr; //for autocomplete
	$scope.isFullTable = false;
	$scope.viewButtonText = "Full View";
	$scope.changeToFullView = function () {
		if (!$scope.isFullTable) {
			$scope.isFullTable = true;
			$scope.payments.isFullTable = true;
			$scope.viewButtonText = "Month View";
		} else {
			$scope.isFullTable = false;
			$scope.payments.isFullTable = false;
			$scope.viewButtonText = "Full View";
			$scope.payments.payments_per_month = [];
			$scope.payments.startrows_month = 0;
			$scope.payments.getPayments_month();
		}
	};
	$scope.finishLoading = function () {

		$timeout(function () {
			$('.glyphicon-remove').click();
		}, 10);

	};


	$scope.init = function () {
		$scope.payments.paymentssarr = [];
		$scope.payments.startrows = 0;
		$scope.payments.getPayments();
		$scope.payments.getPayments_month();
		$scope.payments.sorttable = localStorage.getItem('sort') === null ?  "-payment_date" : localStorage.sort;
	};

		$scope.sortchange = function () {
			localStorage.setItem("sort",$scope.payments.sorttable);
		};



	//Filters
	$scope.payments.counter = 0; //count the filters applied
	$scope.payments.counter_month = 0; //count the filters applied
	$scope.translations = {
		buttonDefaultText: 'Choose',
		dynamicButtonTextSuffix: 'Chose'
	};
	$scope.settings = {
		displayProp: 'first_name',
		enableSearch: true,
		idProp: 'first_name',
		externalIdProp: 'first_name',
		showCheckAll: false,
		showUncheckAll: false
	};
	$scope.settings_first_name_month = {
		displayProp: 'first_name',
		enableSearch: true,
		idProp: 'first_name',
		externalIdProp: 'first_name',
		showCheckAll: false,
		showUncheckAll: false
	};
	$scope.settings_last_name_month = {
		displayProp: 'last_name',
		enableSearch: true,
		idProp: 'last_name',
		externalIdProp: 'last_name',
		showCheckAll: false,
		showUncheckAll: false
	};
	$scope.settings_last_name = {
		displayProp: 'last_name',
		enableSearch: true,
		idProp: 'last_name',
		externalIdProp: 'last_name',
		showCheckAll: false,
		showUncheckAll: false
	};
	$scope.settings_type = {
		displayProp: 'payment_type',
		enableSearch: true,
		idProp: 'payment_type',
		externalIdProp: 'payment_type',
		showCheckAll: false,
		showUncheckAll: false
	};
	$scope.settings_for = {
		displayProp: 'payment_for',
		enableSearch: true,
		idProp: 'payment_for',
		externalIdProp: 'payment_for',
		showCheckAll: false,
		showUncheckAll: false
	};
	$scope.settings_receipt = {
		displayProp: 'receipt_type',
		enableSearch: true,
		idProp: 'receipt_type',
		externalIdProp: 'receipt_type',
		showCheckAll: false,
		showUncheckAll: false
	};
	$scope.settings_ispaid = {
		displayProp: 'label',
		enableSearch: true,
		idProp: 'option',
		externalIdProp: 'option',
		showCheckAll: false,
		showUncheckAll: false,
		closeOnBlur: true
	};
	$scope.selecEvents_First_name_month = {
		onItemSelect: function () {
			$scope.payments.payments_per_month = [];
			$scope.payments.startrowsfilter_month = 0;
			$scope.payments.applyFilter_month("filter");
			$scope.payments.counter_month++;
		},
		onItemDeselect: function () {
			$scope.payments.counter_month--;
			if ($scope.payments.counter_month == 0) {
				$scope.payments.hasmore_month = true;
				$scope.payments.startrows = 0;
			}
			$scope.payments.payments_per_month = [];
			$scope.payments.startrowsfilter_month = 0;
			$scope.payments.applyFilter_month("filter");
		}
	};
	$scope.selecEvents_Last_name_month = {

		onItemSelect: function () {

			$scope.payments.counter_month++;
			$scope.payments.payments_per_month = [];
			$scope.payments.startrowsfilter_month = 0;

			$scope.payments.applyFilter_month("filter");
		},
		onItemDeselect: function () {
			$scope.payments.counter_month--;
			if ($scope.payments.counter_month === 0) {
				$scope.payments.hasmore_month = true;
			}
			$scope.payments.payments_per_month = [];
			$scope.payments.startrowsfilter_month = 0;
			$scope.payments.applyFilter_month("filter");

		}
	};
	$scope.selecEvents = {
		onItemSelect: function () {
			$scope.payments.paymentssarr = [];
			$scope.payments.startrowsfilter = 0;
			$scope.payments.applyFilter();
			$scope.payments.counter++;
		},
		onItemDeselect: function () {
			$scope.payments.counter--;
			if ($scope.payments.counter === 0) {
				$scope.payments.hasmore = true;
				$scope.payments.startrows = 0;
			}
			$scope.payments.paymentssarr = [];
			$scope.payments.startrowsfilter = 0;

			$scope.payments.applyFilter();
		}
	};
	$scope.selecEvents_Last_name = {
		onItemSelect: function () {
			$scope.payments.counter++;
			$scope.payments.paymentssarr = [];
			$scope.payments.startrowsfilter = 0;

			$scope.payments.applyFilter();
		},
		onItemDeselect: function () {
			$scope.payments.counter--;
			if ($scope.payments.counter === 0) {
				$scope.payments.hasmore = true;
				$scope.payments.startrows = 0;
			}
			$scope.payments.paymentssarr = [];
			$scope.payments.startrowsfilter = 0;

			$scope.payments.applyFilter();
		}
	};

	$scope.selecEvents_payment_type = {
		onItemSelect: function () {
			$scope.payments.counter++;
			$scope.payments.paymentssarr = [];
			$scope.payments.startrowsfilter = 0;

			$scope.payments.applyFilter();
		},
		onItemDeselect: function () {

			$scope.payments.counter--;
			if ($scope.payments.counter === 0) {
				$scope.payments.hasmore = true;
				$scope.payments.startrows = 0;
			}
			$scope.payments.paymentssarr = [];
			$scope.payments.startrowsfilter = 0;

			$scope.payments.applyFilter();
		}
	};
	$scope.selecEvents_payment_for = {
		onItemSelect: function () {
			$scope.payments.counter++;
			$scope.payments.paymentssarr = [];
			$scope.payments.startrowsfilter = 0;

			$scope.payments.applyFilter();
		},
		onItemDeselect: function () {
			$scope.payments.counter--;
			if ($scope.payments.counter === 0) {
				$scope.payments.hasmore = true;
				$scope.payments.startrows = 0;
			}
			$scope.payments.paymentssarr = [];
			$scope.payments.startrowsfilter = 0;

			$scope.payments.applyFilter();
		}
	};
	$scope.selecEvents_payment_receipt = {
		onItemSelect: function () {
			$scope.payments.counter++;
			$scope.payments.paymentssarr = [];
			$scope.payments.startrowsfilter = 0;

			$scope.payments.applyFilter();
		},
		onItemDeselect: function () {
			$scope.payments.counter--;
			if ($scope.payments.counter === 0) {
				$scope.payments.hasmore = true;
				$scope.payments.startrows = 0;
			}
			$scope.payments.paymentssarr = [];
			$scope.payments.startrowsfilter = 0;

			$scope.payments.applyFilter();
		}
	};

	$scope.selecEvents_ispaid = {
		onItemSelect: function () {
			$scope.payments.counter++;
			$scope.payments.paymentssarr = [];
			$scope.payments.startrowsfilter = 0;
			$scope.payments.applyFilter();
		},
		onItemDeselect: function () {
			$scope.payments.counter--;
			if ($scope.payments.counter === 0) {
				$scope.payments.hasmore = true;
				$scope.payments.startrows = 0;
			}
			$scope.payments.paymentssarr = [];
			$scope.payments.startrowsfilter = 0;

			$scope.payments.applyFilter();
		}
	};

	$scope.applyFilterDate = function (type) {
		$scope.payments.counter++;
		$scope.payments.date_filter.clear = false;
		$scope.payments.paymentssarr = [];
		$scope.payments.startrowsfilter = 0;
		$scope.datemodel.hide();
		if (type === 'clear') {
			$scope.payments.counter--;
			$scope.payments.date_filter.month = "";
			$scope.payments.date_filter.start = "";
			$scope.payments.date_filter.end = "";
			$scope.payments.date_filter.day = "";
			$scope.payments.date_filter.year = "";
			$scope.payments.date_filter.clear = true;
			$scope.options.oneday = true;
			$scope.options.range = false;
			$scope.options.month = false;
			$scope.options.year = false;

		}
		$scope.payments.applyFilter();
	};

	//END - Filters

	$scope.showDetails = function (user_id, first_name, last_name) {
		$scope.detailsarray = [];
		$scope.payments.getPaymentsByUser(user_id).success(function (data) {
			$scope.detailsarray = data;
			$scope.payments.formdatadetails.client_name = first_name + " " + last_name;
			$scope.detailsmodel = $modal({
				scope: $scope,
				templateUrl: 'payments/payments_details.html',
				clickOutsideToClose: true,
				show: true
			});
		});


	};
	$scope.dateSelectedBox = function () {
		$scope.datemodel = $modal({
			scope: $scope,
			templateUrl: 'payments/paymentDateFilterBox.html',
			clickOutsideToClose: true,
			show: true
		});
	};

	$scope.showmodal = function () {
		$scope.enterdatamodal = $modal({
			scope: $scope,
			templateUrl: 'payments/newPayment.html',
			show: true
		});
	};
	$scope.hideUpdatedModal = function () {
		$scope.updatemodal.hide();
	};
	$scope.hideDatesdModal = function () {
		$scope.datemodel.hide();
	};
	$scope.hideModal = function () {
		$scope.enterdatamodal.hide();
	};
	$scope.hideDetailsModal = function () {
		$scope.detailsmodel.hide();
	};
	$scope.options = {
		'oneday': true,
		'range': false,
		'month': false
	};
	$scope.changeOption = function (option) {
		switch (option) {
			case 'oneday':
				$scope.options.oneday = true;
				$scope.options.range = false;
				$scope.options.month = false;
				$scope.options.year = false;
				$scope.payments.date_filter.month = "";
				$scope.payments.date_filter.start = "";
				$scope.payments.date_filter.end = "";
				$scope.payments.date_filter.year = "";

				break;
			case 'range':
				$scope.options.range = true;
				$scope.options.oneday = false;
				$scope.options.month = false;
				$scope.options.year = false;
				$scope.payments.date_filter.day = "";
				$scope.payments.date_filter.month = "";
				$scope.payments.date_filter.year = "";
				break;
			case 'month':

				$scope.options.month = true;
				$scope.options.range = false;
				$scope.options.oneday = false;
				$scope.options.year = false;
				$scope.payments.date_filter.day = "";
				$scope.payments.date_filter.start = "";
				$scope.payments.date_filter.end = "";
				$scope.payments.date_filter.year = "";
				break;
			case 'year':
				$scope.options.year = true;
				$scope.options.month = false;
				$scope.options.range = false;
				$scope.options.oneday = false;
				$scope.payments.date_filter.day = "";
				$scope.payments.date_filter.start = "";
				$scope.payments.date_filter.end = "";
				$scope.payments.date_filter.year = new Date().getFullYear();
				break;
		}
	};

	$scope.update = function (user_id, id, first_name, last_name, date,index) {
		$scope.payments.formdataupdated.client_name = first_name + " " + last_name;
		$scope.payments.formdataupdated.first_name = first_name;
		$scope.payments.formdataupdated.last_name = last_name;
		$scope.payments.formdataupdated.payment_id = id;
		$scope.payments.formdataupdated.year_old = moment(new Date(date)).format('YYYY');
		$scope.payments.formdataupdated.index = index;
		$scope.payments.formdataupdated.user_id = user_id;
		$scope.payments.getPaymentsByUser(user_id).success(function (data) {
			$scope.payments.formdataupdated.paymentsarr = data;
			$scope.payments.formdataupdated.paymentsarr.reverse();
			$scope.payments.formdataupdated.payments_old = angular.copy($scope.payments.formdataupdated.paymentsarr);
			console.log($scope.payments.formdataupdated.paymentsarr);
			for (var i = 0; i < $scope.payments.formdataupdated.paymentsarr.length; i++) {
				$scope.payments.formdataupdated.paymentsarr[i].payment_date = new Date($scope.payments.formdataupdated.paymentsarr[i].payment_date);
			}

			$scope.updatemodal = $modal({
				scope: $scope,
				templateUrl: 'payments/updatePayment.html',
				show: true
			});
		});
	};
	$scope.updateFull = function (payment,index) {
		$scope.payments.formdataupdated_full.client_name = payment.first_name + " " + payment.last_name;
		$scope.payments.formdataupdated_full.payment_id = payment.id;
		$scope.payments.formdataupdated_full.user_id = payment.user_id;
		$scope.payments.formdataupdated_full.total = payment.total;
		$scope.payments.formdataupdated_full.total_old = angular.copy($scope.payments.formdataupdated_full.total);
		$scope.payments.formdataupdated_full.payment_date = new Date(payment.payment_date);
		$scope.payments.formdataupdated_full.payment_for = payment.payment_for;
		$scope.payments.formdataupdated_full.receipt_type= payment.receipt_type;
		$scope.payments.formdataupdated_full.payment_type = payment.payment_type;
		$scope.payments.formdataupdated_full.is_paid = payment.is_paid;
		$scope.payments.formdataupdated_full.index = index;
		$scope.updatemodal = $modal({
			scope: $scope,
			templateUrl: 'payments/updatePayment_Full.html',
			show: true
		});
	};
	$scope.clear = function () {
		if ($scope.customers.fullarray.length > 0) {
			$scope.customers.customersarr = $scope.customers.fullarray;
			$scope.searchtext = "";
			$scope.customers.issearch = false;
		}
	};
}]);
app.factory("PaymentsFactory", ['$http', '$mdDialog', 'toaster', '$filter','CustomersFactory','Domain','$state',
	function ($http, $mdDialog, toaster, $filter,CustomersFactory,Domain,$state) {
	var self = {
		'paymentssarr': [],
		'counter': 0,
		'counter_month': 0,
		'payments_by_user_arr': [],
		'payments_per_month': [],
		'payments_per_month_total': [],
		'payments_per_month_total_filter': [],
		'montharr': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		'year_chosen': moment(new Date()).format('YYYY'),
		'filters': {},
		'firstname': [],
		'lastname': [],
		'firstname_month': [],
		'lastname_month': [],
		'ispaid': [],
		'type': [],
		'for': [],
		'receipt_type':[],
		'date_filter': {},
		'day': "",
		'start_date': "",
		'end_date': "",
		'total': 0,
		'total_month': [],
		'sorttable': "-payment_date",
		'formdata': {
			'is_paid': false
		},
		'formdataupdated': {},
		'formdataupdated_full': {},
		'formdatadetails': {},
		'hasmore': true,
		'hasmore_month': true,
		'startrows': 0,
		'endrows': 30,
		'startrows_month': 0,
		'endrows_month': 30,
		'startrowsfilter': 0,
		'endrowsfilter': 30,
		'startrowsfilter_month': 0,
		'endrowsfilter_month': 30,
		'loadingtext': '',
		'isloading': false,
		'isloading_month': false,
		'isdeleting': false,
		'isdeleting_month': false,
		'isFullTable': false,
		'fullMode': "false",
		'isCustTemp':false,
		'getPayments': function () {
			if (!self.isloading) {

				self.getTotal();
				self.isloading = true;
				self.loadingtext = "Loading Data...";
				$http({
					method: 'GET',
					url: Domain +'payments/getPayments.php',
					params: {
						'start': self.startrows,
						'end': self.endrows,
						'actionname': 'all'
					}
				}).success(function (data) {

					if (data.length === 0) {
						self.hasmore = false;
						self.isloading = false;
					} else {
						angular.forEach(data, function (value) {
							self.paymentssarr.push(value);
						});
						self.isloading = false;
					}
				});
			}
		},
		'getPaymentsByUser': function (user_id) {
			return $http({
				method: 'GET',
				url: Domain +'payments/getPayments.php',
				params: {
					'user_id': user_id,
					'actionname': 'byuserid',
					'year': self.year_chosen
				}
			});

		},

		'TempCustomer':function (type){
			if (type === 'temp'){
				self.isCustTemp = true;
			}else{
				self.isCustTemp = false;
			}
		},
		'getPayments_month': function () {

			if (self.payments_per_month.length > 0) {
				self.payments_per_month = [];
			}
			var d = new Date();
			var currentYear = d.getFullYear();
			self.payments_per_month = [];
			var yearInput = document.getElementsByClassName("select-year-payment")[0];
			if (yearInput === undefined) {
				self.year_chosen = currentYear;
			}
			self.startrowsfilter_month = 0;
			var arr_temp = [];
			if (!self.isloading_month) {
				self.isloading_month = true;
				self.loadingtext = "Loading Data...";
				$http({
					method: 'GET',
					url: Domain +'payments/getPayments_Month.php',
					params: {
						'start': self.startrows_month,
						'end': self.endrows_month,
						'year': self.year_chosen,
						'actionname': 'all'
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					}
				}).success(function (data) {
					if (data.length === 0) {
						self.hasmore_month = false;
						self.isloading_month = false;
						//self.payments_per_month = [];
						self.startrowsfilter_month = 0;
					} else {
						self.hasmore_month = true;
						var i = 0;
						angular.forEach(data, function (value) {
							var obj = {
								'first_name': value.first_name,
								'last_name': value.last_name,
								'id': value.id,
								'user_id': value.user_id,
								'payment_date': value.payment_date
							};
							arr_temp.push(obj);
							var obj_month = {
								'0': value.jun,
								'1': value.feb,
								'2': value.mar,
								'3': value.apr,
								'4': value.may,
								'5': value.june,
								'6': value.july,
								'7': value.aug,
								'8': value.sept,
								'9': value.oct,
								'10': value.nov,
								'11': value.decm
							};
							arr_temp[i].months = [];
							arr_temp[i].months = obj_month;
							i++;
						});
						self.payments_per_month = arr_temp;
						self.getPayments_month_total();
						self.isloading_month = false;
						self.hasmore_month = true;
					}
				});
			}
		},
		'getPayments_month_total': function () {
			var arr_temp = [];
			$http({
				method: 'GET',
				url: Domain +'payments/getPayments_Month_total.php',
				params: {
					'year': self.year_chosen
				}
			}).success(function (data) {

				var i = 0;
				angular.forEach(data, function (value) {
					var obj = {
						'payment_date': value.payment_date
					};
					arr_temp.push(obj);
					var obj_month = {
						'0': value.jun,
						'1': value.feb,
						'2': value.mar,
						'3': value.apr,
						'4': value.may,
						'5': value.june,
						'6': value.july,
						'7': value.aug,
						'8': value.sept,
						'9': value.oct,
						'10': value.nov,
						'11': value.decm
					};
					arr_temp[i].months = [];
					arr_temp[i].months = obj_month;
					i++;
				});
				self.payments_per_month_total = arr_temp;
				self.setTotalMonth();
				self.isloading_month = false;
			});
		},
		'setTotalMonth': function () {
			self.total_month = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			angular.forEach(self.payments_per_month_total, function (value) {
				if (moment(value.payment_date).format('YYYY') == self.year_chosen) {
					for (var z = 0; z < 12; z++) {
						self.total_month[z] = Number(self.total_month[z]) + Number(value.months[z]);
					}
				}
			});
		},
		'updateForm': function (id, date, type, payment_for,receipt_type, total, is_paid) {
			var month = moment(date).format('M');
			var year = moment(date).format('YYYY');
			var year_old = self.formdataupdated.year_old;
			$http({
				method: 'POST',
				url: Domain +'payments/updatePayment.php/',
				data: {
					payment_id: id,
					date: date,
					type: type,
					for_payment: payment_for,
					receipt_type: receipt_type,
					total: total,
					is_paid: is_paid,
					user_id: self.formdataupdated.user_id,
					first_name:self.formdataupdated.first_name,
					last_name:self.formdataupdated.last_name,
					month: month,
					year: year

				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function () {
				var index_month  = self.formdataupdated.index;
				//we can't updated locally the full table array(because of lazyload), so we need to get all the updated records again
				//so we clear the array and reset the start rows to 0 and call GetPayments again;
				self.startrows = 0;
				self.paymentssarr = [];
				self.getPayments();
				self.getPaymentByUserId_Month(self.formdataupdated.user_id,year_old).success(function (data){
					var obj_payment = self.CreateLocalArray_Month(data[0]);
					var total_by_user = self.getTotalByUser(obj_payment);
					if (total_by_user === 0) {
						self.payments_per_month.splice(index_month, 1);
						self.deletePayment_month(obj_payment.id).success(function () {
							self.isdeleting_month = false;
							self.getPayments_month();
							self.getTotal();

						});
					}else{
						self.getPayments_month();
						self.getTotal();
					}
					toaster.clear();
					toaster.pop('success', 'Updated successfully!');
				});

			});

		},
		'updatePayment_Full': function () {
			var date = self.formdataupdated_full.payment_date;
			var entity = angular.copy(self.formdataupdated_full);
			var month = moment(date).format('M');
			var year = moment(date).format('YYYY');
			var total = entity.total;
			entity.id =  entity.payment_id;
			var index = self.formdataupdated_full.index;
			$http({
				method: 'POST',
				url: Domain +'payments/updatePayment_Full.php/',
				data: {
					entity: entity,
					month: month,
					year: year,
					total: total
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function () {
				self.paymentssarr[index] = entity;
				self.payments_per_month = [];
				self.startrows_month  = 0;
				self.getPayments_month();
				self.setTotalMonth();
				self.getTotal();
				toaster.clear();
				toaster.pop('success', 'Action successfully completed');
				var splitName = entity.client_name.split(" ");
				for (var i = 0; i < splitName.length; i++) {
					entity.first_name = splitName[0];
					entity.last_name = splitName[1];
				}
				$state.reload();
			});
		},
		'changeYear': function () {
			self.payments_per_month_total = [];
			self.payments_per_month = [];
			self.startrows_month = 0;
			self.endrows_month = 20;
			self.firstname_month = [];
			self.lastname_month = [];
			self.counter_month = 0;
			self.filters.firstname_month = [];
			self.filters.lastname_month = [];
			self.getFilterBy_month('firstname');
			self.getFilterBy_month('lastname');
			self.getPayments_month();
			self.getPayments_month_total();
			self.startrowsfilter_month = 0;
		},
		'createNewPayment': function () {
			var entity = angular.copy(self.formdata);
			entity.payment_date = $filter('date')(entity.payment_date, "yyyy-MM-dd");
			var first_name = "";
			var last_name = "";
			var user_data ={};
			if (self.isCustTemp){
				if (entity.phonetemp === '' || entity.phonetemp === null || typeof entity.phonetemp === 'undefined') {
					var confirm = $mdDialog.confirm().title('Error')
						.textContent('Must enter Phone Number for temp customer')
						.ok('OK')
						.targetEvent(event)
						.disableParentScroll(false);
					$mdDialog.show(confirm).then(function () {
					});
				}else{
					var namearr = entity.tempname.split(" ");
					 first_name = namearr[0];
					 last_name = namearr[1];
					$http({
						method: 'GET',
						//DO NOT FORGET TO CHANGE THE URL!!!!!//
						url: Domain +'customers/createCustomer.php/?actionname=createtemp',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
						},
						params: {
							first_name: first_name,
							last_name: last_name,
							phone_number:entity.phonetemp
						}
					}).success(function (data) {
						user_data.user_id = data;
						$http({
							method: 'POST',
							url: Domain +'payments/createPayment.php/',

							data: {
								entity: entity,
								first_name: first_name,
								last_name: last_name,
								user_id: user_data.user_id
							},
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
							}
						}).success(function (data) {
							self.getAllFilters();
							self.getTotal();
							entity.first_name = first_name;
							entity.last_name = last_name;
							entity.user_id = user_data.user_id;
							entity.id = data;
							self.paymentssarr.unshift(entity);
							self.paymentssarr = $filter('orderBy')(self.paymentssarr, 'payment_date', false);
						});
						self.createNewPaymentMonth(first_name, last_name, user_data, entity);
						self.formdata.tempname = "";
						self.formdata.phonetemp = "";
						self.formdata.selected = "";
						self.formdata.payment_date = "";
						self.formdata.payment_type = "";
						self.formdata.payment_for = "";
						self.formdata.is_paid = "";
						self.formdata.total = "";
							});
				}

			}else{
				var names = self.getCustomerNameFromArray(entity);
				 first_name = names[0];
				 last_name =  names[1];
				user_data = entity.selected;
				//in DB name is with
				$http({
					method: 'POST',
					url: Domain +'payments/createPayment.php/',

					data: {
						entity: entity,
						first_name: first_name,
						last_name: last_name,
						user_id: user_data.user_id
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					}
				}).success(function (data) {
					self.getAllFilters();
					self.getTotal();
					entity.first_name = first_name;
					entity.last_name = last_name;
					entity.user_id = user_data.user_id;
					entity.id = data;
					self.paymentssarr.unshift(entity);
				});
				self.createNewPaymentMonth(first_name, last_name, user_data, entity);
				self.formdata.tempname = "";
						self.formdata.phonetemp = "";
						self.formdata.selected = "";
						self.formdata.payment_date = "";
						self.formdata.payment_type = "";
						self.formdata.payment_for = "";
						self.formdata.is_paid = "";
						self.formdata.total = "";
			}
		},
		'getCustomerNameFromArray':function (entity){
			var names = [];
			var autoarr = CustomersFactory.autocompetearr;
			for (var i=0;i<autoarr.length;i++){
				if (autoarr[i].id === entity.selected.id){
					names.push(autoarr[i].first_name);
					names.push(autoarr[i].last_name);
					break;
				}
			}
			return names;
		},
		'createNewPaymentMonth': function (first_name, last_name, user_data, entity) {
			self.montharr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			var entity_month = angular.copy(entity);
			var total = entity.total;
			var month = (moment(entity_month.payment_date).format('M')) - 1;
			var year = (moment(entity_month.payment_date).format('YYYY'));
			var user_id = user_data.user_id;
			self.montharr[month] = +Number(total);
			self.total_month[month] = Number(self.total_month[month]) + Number(total);
			entity_month.first_name = first_name;
			entity_month.last_name = last_name;
			entity_month.userid = user_id;
			entity_month.months = [];
			$http({
				method: 'POST',
				url: Domain +'payments/createPaymentMonth.php/',
				data: {
					payment_date: entity_month.payment_date,
					year: moment(entity_month.payment_date).format('YYYY'),
					months: self.montharr,
					first_name: first_name,
					last_name: last_name,
					user_id: user_id
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (response) {
				entity_month.id = response;
				self.getPaymentByUserId_Month(user_id,year).success(function(data){
					var payment_month = self.CreateLocalArray_Month(data[0]);
					if (self.payments_per_month.length === 0) {
						entity_month.months[month] = total;
						entity_month.user_id = user_data.user_id;
						self.payments_per_month.unshift(entity_month);
					} else {
						var payment = self.getPaymentById_Month(payment_month.id);
						if (typeof payment !== 'undefined') {
							if (isNaN(payment.months[month])) {
								payment.months[month] = 0;
							}
							payment.months[month] = Number(payment.months[month]) + Number(total);
						} else {
							entity_month.months[month] = total;
							for (var i = 0; i < 12; i++) {
								if (entity_month.months[i] === undefined) {
									entity_month.months[i] = 0;
								}
							}
							entity_month.user_id = user_data.user_id;
							self.payments_per_month.unshift(entity_month);
							self.payments_per_month = $filter('orderBy')(self.payments_per_month, 'first_name', false);
						}
					}
					self.getAllFilters();
					self.getTotal_Month();
				});
				toaster.pop('success', 'Action successfully completed');
			});


		},

		"CreateLocalArray_Month":function(obj){
			//The data we get from the server is not organized as we want.
			//this function get a non organized array and organize as object with months prop as array.
			var arr_user = [];
			var obj_details = {
				'first_name': obj.first_name,
				'last_name': obj.last_name,
				'id': obj.id,
				'user_id': obj.user_id,
				'payment_date': obj.payment_date
			};
			arr_user.push(obj_details);
			var obj_month = {
				'0': obj.jun,
				'1': obj.feb,
				'2': obj.mar,
				'3': obj.apr,
				'4': obj.may,
				'5': obj.june,
				'6': obj.july,
				'7': obj.aug,
				'8': obj.sept,
				'9': obj.oct,
				'10': obj.nov,
				'11': obj.decm
			};
			arr_user[0].months = [];
			arr_user[0].months = obj_month;
			return arr_user[0];
		},
		'getAllFilters': function () {
			self.getFilterBy('firstname');
			self.getFilterBy('lastname');
			self.getFilterBy('type');
			self.getFilterBy('for');
			self.getFilterBy('receipt_type');
			self.getFilterBy_month('firstname');
			self.getFilterBy_month('lastname');
		},
		'getPaymentByUserId_Month': function (user_id,year) {
			return $http({
				method: 'GET',
				url: Domain +'payments/getPayments_Month.php',
				params: {
					'user_id': user_id,
					'actionname': 'byid',
					'year': year
				}
			});
		},
		'getPaymentById_Month': function (id) {
			for (var i=0;i<self.payments_per_month.length;i++){
				if (id === self.payments_per_month[i].id){
					return self.payments_per_month[i];
				}
			}
		},
		'getPaymentById_Full': function (id) {
			for (var i=0;i<self.paymentssarr.length;i++){
				if (id === self.paymentssarr[i].id){
					return self.paymentssarr[i];
				}
			}
		},
		'getPaymentById': function (id) {
			return $http({
				method: 'GET',
				url: Domain +'payments/getPayments.php',
				params: {
					'id': id,
					'actionname': 'byid'
				}
			});
		},
		'deletePayment': function (id, user_id, event, name, date, index, total) {
			var month = moment(date).format('M');
			var year = moment(date).format('YYYY');
			self.isdeleting = true;
			self.loadingtext = "Deleting Data...";
			var confirm = $mdDialog.confirm().title('Delete' + name + '?')
				.textContent('It will be removed permanently')
				.ok('Delete')
				.cancel('Cancel')
				.targetEvent(event)
				.disableParentScroll(false);
			$mdDialog.show(confirm).then(function () {
				$http({
					method: 'GET',
					url: Domain +'payments/deletePayment.php/?id=' + id + '&year=' + year + '&month=' + month + '&user_id=' + user_id + '&total=' + total,
					headers: {
						'Content-Type': 'application/x-wwwgetLocalArray_Month-form-urlencoded; charset=UTF-8'
					}
				}).success(function (data) {
					
					toaster.pop('success', 'Action successfully completed');
					self.paymentssarr.splice(index, 1);


					self.isdeleting = false;
					self.payments_per_month = [];
					self.startrows_month  = 0;
					self.getPayments_month();
					self.getTotal_Month();
				});
			}, function () {
				self.isdeleting = false;
			});
		},
		'deletePayment_month': function (id) {
			self.isdeleting_month = true;
			self.loadingtext = "Delete data...";
			return	$http({
				method: 'GET',
				url: Domain +'payments/deletePayment_Month.php/?id=' + id,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			});
		},
		'getTotalByUser': function (obj) {
			var total = 0;
			for (var i = 0; i < 12; i++) {

				total = Number(total) + Number(obj.months[i]);
			}
			return total;
		},
		'loadMore': function (counter) {

			if (!self.isloading && self.hasmore) {
				if (counter === 0) {
					self.startrows = self.startrows + self.endrows;
					self.getPayments();
				} else {
					self.startrowsfilter = self.startrowsfilter + self.endrowsfilter;
					self.applyFilter('full');
				}
			}
		},
		'loadMore_Month': function (counter) {

			if (!self.isloading_month && self.hasmore_month) {
				self.startrowsfilter_month = self.startrowsfilter_month + self.endrowsfilter_month;
				self.applyFilter_month();
			}
		},
		'applyFilter_month': function (filter) {
			self.payments_per_month_total_filter = [];
			var start = self.startrowsfilter_month;
			var end = self.endrowsfilter_month;
			$http({
				method: 'POST',
				url: Domain +'payments/filter_month.php/',
				data: {
					first_name: self.firstname_month,
					last_name: self.lastname_month,
					start: start,
					end: end,
					year: self.year_chosen
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (data) {
				if (data.length === 0) {
					self.hasmore_month = false;
				}

				var i = self.payments_per_month.length;
				if (data.length === 0) {
					self.hasmore_month = false;
					self.hasmorefilter = false;
					self.isloadingfilter = false;
				} else {
					angular.forEach(data, function (value) {
						var obj = {
							'first_name': value.first_name,
							'last_name': value.last_name,
							'id': value.id,
							'user_id': value.user_id,
							'payment_date': value.payment_date
						};
						self.payments_per_month.push(obj);
						var obj_month = {
							'0': value.jun,
							'1': value.feb,
							'2': value.mar,
							'3': value.apr,
							'4': value.may,
							'5': value.june,
							'6': value.july,
							'7': value.aug,
							'8': value.sept,
							'9': value.oct,
							'10': value.nov,
							'11': value.decm
						};
						self.payments_per_month[i].months = [];
						self.payments_per_month[i].months = obj_month;
						i++;
					});
					self.isloadingfilter = false;
				}
				if (filter !== undefined) {
					self.payments_per_month_total_filter = self.payments_per_month;
					self.setTotalMonthAfterFilter();
				}
				if ((self.firstname_month.length === 0 && self.lastname_month.length === 0) && filter !== undefined) {
					self.setTotalMonth();
				}
			});
		},
		'setTotalMonthAfterFilter': function () {
			self.total_month = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			angular.forEach(self.payments_per_month_total_filter, function (value) {
				if (moment(value.payment_date).format('YYYY') === self.year_chosen) {
					for (var z = 0; z < 12; z++) {
						self.total_month[z] = Number(self.total_month[z]) + Number(value.months[z]);
					}
				}
			});
		},
		'getFilterBy': function (type) {

			self.filters.ispaid = [{
				label: 'Yes',
				option: 1
			}, {
				label: 'No',
				option: 0
			}];
			$http({
				method: 'GET',
				url: Domain +'payments/filterPayments.php/?funcname=' + type,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (data) {
				switch (type) {
					case 'firstname':
						self.filters.firstname = data;
						break;
					case 'lastname':
						self.filters.lastname = data;
						break;
					case 'type':
						self.filters.type = data;
						break;
					case 'for':
						self.filters.for = data;
						break;
					case 'receipt_type':
						self.filters.receipt_type = data;
						break;
				}
			});
		},
		'getFilterBy_month': function (type) {
			$http({
				method: 'GET',
				url: Domain +'payments/filter_month.php/?funcname=' + type + '&year=' + self.year_chosen,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (data) {
				switch (type) {
					case 'firstname':
						self.filters.firstname_month = data;
						break;
					case 'lastname':
						self.filters.lastname_month = data;
						break;
				}
			});
		},
		'applyFilter': function () {
			self.getTotal();
			var start = "";
			var end = "";
			var entity = angular.copy(self.date_filter);
			if (entity.day !== null) {
				entity.day = $filter('date')(entity.day, "yyyy-MM-dd");
			} else {
				if (entity.start !== null) {
					entity.start = $filter('date')(entity.start, "yyyy-MM-dd");
					entity.end = $filter('date')(entity.end, "yyyy-MM-dd");
				}
			}
			if (entity.clear === undefined || entity.clear === true) {
				self.fullMode = "false";
			} else {
				self.fullMode = "true";
			}
			if (entity.year !== undefined && entity.year !== null && entity.year !== "") {
				 start = entity.year + "-" + 1 + "-" + 1;
				 end = entity.year + "-" + 12 + "-" + 31;
				var ns = new Date(start);
				var ne = new Date(end);
				entity.start = $filter('date')(ns, "yyyy-MM-dd");
				entity.end = $filter('date')(ne, "yyyy-MM-dd");
			}
			 start = self.startrowsfilter;
			 end = self.endrowsfilter;
			$http({
				method: 'POST',
				url: Domain +'payments/filterPayments.php/',
				data: {
					first_name: self.firstname,
					last_name: self.lastname,
					payment_type: self.type,
					payment_for: self.for,
					receipt_type: self.receipt_type,
					ispaid: self.ispaid,
					dates: entity,
					start: start,
					end: end
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (data) {
				if (data.length === 0) {
					self.hasmorefilter = false;
					self.isloadingfilter = false;
				} else {
					angular.forEach(data, function (value) {
						self.paymentssarr.push(value);
					});
					self.isloadingfilter = false;
				}
				if (self.fullMode === "true") {
					self.getTotal();
				}
			});
			if (self.fullMode === "false") {
				self.getTotal();
			}
		},
		'getTotal': function () {
			var entity = angular.copy(self.date_filter);
			var yearChosen = "";
			if (self.isFullTable === false) {
				yearChosen = self.year_chosen;
			} else {
				yearChosen = self.date_filter.year;
			}

			if (yearChosen == undefined){
				yearChosen =  moment(new Date()).format('YYYY')
			}
			$http({
				method: 'POST',
				url: Domain +'payments/getTotalPayment.php/',
				data: {
					first_name: self.firstname,
					last_name: self.lastname,
					payment_type: self.type,
					payment_for: self.for,
					ispaid: self.ispaid,
					year: yearChosen

				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (data) {
				self.total = data[0].total;
				if (self.fullMode === "true") {
					self.setNewTotalWithDate();
				} else {
					self.total = data[0].total;
				}
			});
		},
		'getTotal_Month': function () {
			$http({
				method: 'POST',
				url: Domain +'payments/getTotalPayment_Month.php/',
				data: {
					first_name: self.firstname_month,
					last_name: self.firstname_month,
					year: self.year_chosen
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (data) {

				self.total_month = data[0];
			});
		},
		'setNewTotalWithDate': function () {
			var newTotal = 0;
			angular.forEach(self.paymentssarr, function (value) {
				newTotal +=  parseInt(value.total);
			});
			self.total = newTotal;
		}
	};
	return self;
}]);
app.filter('byear', function ($filter) {
	return function (payments_array, selected_year) {
		var arr = [];
		angular.forEach(payments_array, function (value) {
			var year = moment(value.payment_date).format('YYYY');
			if (year == selected_year) {
				arr.push(value);
			}
		});
		// arr =  $filter('orderBy')(arr, 'first_name', false)
		return arr;
	};
});
app.directive('yearDrop', function () {
	function getYears(offset, range) {
		var currentYear = new Date().getFullYear();
		var years = [];
		for (var i = 0; i < range + 1; i++) {
			years.push(currentYear + offset + i);
		}
		return years;
	}
	return {
		link: function (scope, element, attrs) {
			scope.years = getYears(+attrs.offset, +attrs.range);
			scope.payments.year_chosen = new Date().getFullYear();
		},
		template: '<select  class="select-year-payment" ng-model="payments.year_chosen" ng-options="y for y in years" ng-change="payments.changeYear()"></select>'
	};
});
app.directive('yearDropForGeneralPaymentTable', function () {
	function getYears(offset, range) {
		var currentYear = new Date().getFullYear();
		var years = [];
		for (var i = 0; i < range; i++) {
			years.push(currentYear + offset + i);
		}
		years.unshift(" ");
		return years;
	}
	return {
		link: function (scope, element, attrs) {
			scope.years = getYears(+attrs.offset, +attrs.range);

			//scope.payments.date_filter.year = new Date().getFullYear();

		},
		template: '<select  class="select-year-payment-full-table" ng-model="payments.date_filter.year" ng-options="y for y in years" ng-change="payments.changeYear()"></select>'

	};
});