var app = angular.module('justrun.benefits', []);


app.controller('BenefitController', ['$scope', '$modal', '$aside', 'toaster', 'BenefitFactory', '$mdDialog', '$http',  'CustomersFactory','Domain',
	function ($scope, $modal, $aside, toaster, BenefitFactory, $mdDialog, $http,  CustomersFactory,Domain) {
		$scope.benefits = BenefitFactory;
		$scope.benefitsautoarr = CustomersFactory.autocompetearr; //for autocomplete
		$scope.shared = BenefitFactory.shared_scope;

		$scope.shared.hide = function () {

			if ($scope.enterdatamodal !== undefined) {
				$scope.enterdatamodal.hide();
			}
			else
			{
				$scope.updatemodal.hide();
			}
		};
		$scope.init = function () {
			$scope.benefits.benefitssarr = [];
			$scope.benefits.startrows = 0;
			$scope.benefits.getBenefits();
		};

		$scope.showmodal = function () {
			$scope.enterdatamodal = $modal({
				scope: $scope,
				templateUrl: 'benefits/newBenefit.html',
				show: true

			});

		};
		$scope.hideModal = function () {
			$scope.enterdatamodal.hide();
		};

		$scope.hideUpdatedModal = function () {
			$scope.updatemodal.hide();
		};

		$scope.update = function (b, id, name, total, exp_date, used_date, client_name, index) {
			$scope.benefits.benefitid = id;
			$scope.benefits.formdataupdated.benefit_name = name;
			$scope.benefits.formdataupdated.total = total;
			$scope.benefits.formdataupdated.expire_date = new Date(exp_date);
			console.log(used_date);
			if (!used_date) {
				used_date = new Date();
				$scope.benefits.formdataupdated.used_date = used_date;
			} else {
				$scope.benefits.formdataupdated.used_date = new Date(used_date);
			}
			$scope.benefits.formdataupdated.client_name = client_name;
			$scope.benefits.formdataupdated.index = index;
			$scope.benefits.formdataupdated.id = id;

			$scope.updatemodal = $modal({
				scope: $scope,
				templateUrl: 'benefits/updateBenefit.html',
				show: true
			});
		};
	}]);


app.factory("BenefitFactory", ['$filter', '$http', '$mdDialog', 'toaster','Domain', function ($filter, $http, $mdDialog, toaster,Domain) {
	var self = {
		shared_scope: {},
		'benefitssarr': [],
		'benefitid': "",
		'detailsArray': [],
		'formdata': {},
		'formdataupdated': {},
		'hasmore': true,
		'startrows': 0,
		'endrows': 20,
		'loadingtext': '',
		'isloading': false,
		'isdeleting': false,
		'isCustTemp':false,
		'getBenefits': function () {
			if (!self.isloading) {
				self.isloading = true;
				self.loadingtext = "Loading Data...";
				$http({
					method: 'GET',
					url: Domain +'benefits/getBenefits.php/',

					params: {
						'start': self.startrows,
						'end': self.endrows
					}
				}).success(function (data) {

					if (data.length === 0) {
						self.hasmore = false;
						self.isloading = false;
					} else {
						angular.forEach(data, function (value) {
							self.benefitssarr.push(value);
						});
						self.isloading = false;
					}
				});
			}
		},
		'createNewBenefit': function () {
			var entity = angular.copy(self.formdata);
			var namearr = "";
			var user_data ={};
			var first_name = "";
			var last_name = "";
			if (self.isCustTemp){
				if (entity.phonetemp === '' || entity.phonetemp === null || typeof entity.phonetemp === 'undefined') {
					var confirm = $mdDialog.confirm().title('Error')
						.textContent('You must enter Phone Number for temp customer')
						.ok('OK')
						.targetEvent(event)
						.disableParentScroll(false);
					$mdDialog.show(confirm).then(function () {});

				}else {
					namearr = entity.tempname.split(" ");
					user_data.name = entity.tempname;
					first_name = namearr[0];
					last_name = namearr[1];
					entity.expire_date = $filter('date')(entity.expire_date, "yyyy-MM-dd");
					entity.used_date = $filter('date')(entity.used_date, "yyyy-MM-dd");
					if (self.isCustTemp) {
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
								phone_number: entity.phonetemp
							}
						}).success(function (data) {
							user_data.user_id = data;

							$http({
								method: 'POST',
								url: Domain +'benefits/createBenefit.php/',

								data: {
									entity: entity,
									client_name: user_data.name,
									user_id: user_data.user_id
								},
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
								}
							}).success(function (data) {
								if (data.errors) {
									console.log(data.errors);
								} else {
									toaster.clear();
									toaster.pop('success', 'Action successfully completed');
									entity.client_name = user_data.name;
									self.benefitssarr.unshift(entity);
									self.shared_scope.hide();
								}

							});
						});
					}
				}

			}else{
				user_data = entity.selected;
				namearr = user_data.name.split(" ");
				first_name = namearr[0];
				last_name = namearr[1];
				$http({
					method: 'POST',
					url: Domain +'benefits/createBenefit.php/',

					data: {
						entity: entity,
						client_name: user_data.name,
						user_id: user_data.user_id
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					}
				}).success(function (data) {
					if (data.errors) {
						console.log(data.errors);
					} else {
						toaster.clear();
						toaster.pop('success', 'Action successfully completed');
						entity.client_name = user_data.name;
						self.benefitssarr.unshift(entity);
						self.shared_scope.hide();
					}

				});
			}
		},
		'TempCustomer':function (type){
			if (type === 'temp'){
				self.isCustTemp = true;
			}else{
				self.isCustTemp = false;
			}
		},

		'deleteBenefit': function (benefit_id, index, name) {
			var confirm = $mdDialog.confirm().title('Delete ' + name + '?')
				.textContent('The award will be remove permanently')
				.ok('Delete')
				.cancel('Cancel')
				.targetEvent(event)
				.disableParentScroll(false);
			$mdDialog.show(confirm).then(function () {
				$http({
					method: 'GET',
					//DO NOT FORGET TO CHANGE THE URL!!!!!//
					url: Domain +'benefits/deleteBenefit.php/?benefit_id=' + benefit_id,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					}
				}).success(function (data) {
					toaster.clear();
					toaster.pop('success', 'Action successfully completed');
					self.isdeleting = false;
					self.benefitssarr.splice(index, 1)
				});
			}, function () {
				self.isdeleting = false;
			});
		},
		'updateBenefit': function () {
			var entity = angular.copy(self.formdataupdated);
			entity.expire_date = $filter('date')(entity.expire_date, "yyyy-MM-dd");
			entity.used_date = $filter('date')(entity.used_date, "yyyy-MM-dd");
			$http({
				method: 'POST',
				url: Domain +'benefits/updateBenefit.php/',
				benefit_id: self.benefit_id,
				data: {
					entity: entity

				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (data) {
				toaster.pop('success', 'Action successfully completed');
				entity.benefit_id = self.benefitid;
				self.benefitssarr[self.formdataupdated.index] = entity;
				self.shared_scope.hide();
			});
		},
		'loadMore': function () {
			if (!self.isloading && self.hasmore) {
				self.startrows = self.endrows + 1;
				self.endrows = self.endrows + 20;
				self.getBenefits();
			}
		}
	};
	return self;

}]);