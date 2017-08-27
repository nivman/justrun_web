
var app = angular.module('justrun.controller.main', []);


app.controller('MainCtrl',['$scope', '$state', '$http','CustomersFactory','TrxFactory','PaymentsFactory',
	function ($scope, $state, $http,CustomersFactory,TrxFactory,PaymentsFactory) {
		CustomersFactory.getCustomersForAutoComplete();
		if (CustomersFactory.customersarr.length === 0) {

			CustomersFactory.getCustomers();

		}

		PaymentsFactory.getAllFilters();
	}]);

