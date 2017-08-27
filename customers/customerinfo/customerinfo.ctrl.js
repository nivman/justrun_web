var app = angular.module('justrun.customersinfo', []);

$( document ).ready(function() {
	// Handler for .ready() called.
});
app.controller('CustomerInfoController', ['Upload', '$stateParams', '$scope', '$modal', 'toaster', 'CustomerInfoFactory', 'CustomersFactory', '$mdDialog', '$state','Ahdin','Domain','$http',
	'Blob','FileSaver',
	function (Upload, $stateParams, $scope, $modal, toaster, CustomerInfoFactory, CustomersFactory, $mdDialog, $state,Ahdin,Domain,$http,Blob,FileSaver) {

		$scope.custfactory = CustomerInfoFactory;
		$scope.isedit = false;
		$scope.customerObj = {};
		$scope.image = "";
		$scope.files = [];
		$scope.file = {};
		$scope.friends = [];
		$scope.progress = {
			Percentage: "",
			show: false,
			max: 100
		};
		$scope.progress_image = {
			Percentage: "",
			show: false,
			max: 100
		};
		$scope.shared = CustomerInfoFactory.shared_scope;
		
		$scope.initCustomer = function () {

			if (localStorage.customer) {
				$scope.customerObj = JSON.parse(localStorage.getItem('customer'));
				$scope.customerObj.facebook = Number(JSON.parse(localStorage.getItem('customer')).facebook);
				$scope.customerObj.active = Number(JSON.parse(localStorage.getItem('customer')).active);
				$scope.customerObj.trx = Number(JSON.parse(localStorage.getItem('customer')).trx);
			} else {
				$scope.customerObj = $stateParams.customer;
				$scope.customerObj.facebook = Number($stateParams.customer.facebook);
				$scope.customerObj.active = Number($stateParams.customer.active);
				$scope.customerObj.trx = Number($stateParams.customer.trx);
			}
			$scope.custfactory.userid =  $scope.customerObj.id;
			$scope.index = $stateParams.index;
			$scope.customerObj.birth_date = new Date($scope.customerObj.birth_date);
			$scope.customerObj.sign_date = new Date($scope.customerObj.sign_date);
			$scope.getImage();
			$scope.getFilesName();
			$scope.custfactory.getPaymetsByUser($scope.customerObj.id);
			$scope.custfactory.getTotalByUser($scope.customerObj.id);
			$scope.custfactory.getTestsByUser($scope.customerObj.id);
			$scope.custfactory.getGoalsByUser($scope.customerObj.id);
			$scope.custfactory.getFriendsByUser($scope.customerObj.id);
			$scope.custfactory.getTrainDaysByUser($scope.customerObj.id).success(function (data) {
				if (data.length !== 0){
					$scope.customerObj.sunday = Number(data[0].sunday);
					$scope.customerObj.monday = Number(data[0].monday);
					$scope.customerObj.tuesday = Number(data[0].tuesday);
					$scope.customerObj.wednesday = Number(data[0].wednesday);
					$scope.customerObj.thursday = Number(data[0].thursday);
					$scope.customerObj.friday = Number(data[0].friday);
					$scope.customerObj.saturday = Number(data[0].saturday);
				}
			});
		};
		

		//for V-PANE
		$scope.vpane ={
			comments:false,
			goals:false,
			friends:false,
			files:false,
			payments:false,
			tests:false
		};

		$scope.vpaneClass = {
			comments:"glyphicon glyphicon-plus icon-vpn",
			goals:"glyphicon glyphicon-plus icon-vpn",
			friends:"glyphicon glyphicon-plus icon-vpn",
			files:"glyphicon glyphicon-plus icon-vpn",
			payments:"glyphicon glyphicon-plus icon-vpn",
			tests:"glyphicon glyphicon-plus icon-vpn"
		};

		$scope.expandCallback = function (index, id) {
			$scope.changeIconForVPane(id,'expanded');
		};

		$scope.collapseCallback = function (index, id) {
			$scope.changeIconForVPane(id,'collapsed');
		};

		
		$scope.changeIconForVPane = function (name,action){
			switch (name){
				case 'comments':
					if (action == 'expanded'){
						$scope.vpaneClass.comments = "glyphicon glyphicon-minus icon-vpn";
					}else{
						$scope.vpaneClass.comments = "glyphicon glyphicon-plus icon-vpn";
					}
					break;
				case 'goals':
					if (action == 'expanded'){
						$scope.vpaneClass.goals = "glyphicon glyphicon-minus icon-vpn";
					}else{
						$scope.vpaneClass.goals = "glyphicon glyphicon-plus icon-vpn";
					}
					break;
				case 'friends':
					if (action == 'expanded'){
						$scope.vpaneClass.friends = "glyphicon glyphicon-minus icon-vpn";
					}else{
						$scope.vpaneClass.friends = "glyphicon glyphicon-plus icon-vpn";
					}
					break;
				case 'files':
					if (action == 'expanded'){
						$scope.vpaneClass.files = "glyphicon glyphicon-minus icon-vpn";
					}else{
						$scope.vpaneClass.files = "glyphicon glyphicon-plus icon-vpn";
					}
					break;
				case 'payments':
					if (action == 'expanded'){
						$scope.vpaneClass.payments = "glyphicon glyphicon-minus icon-vpn";
					}else{
						$scope.vpaneClass.payments = "glyphicon glyphicon-plus icon-vpn";
					}
					break;
				case 'tests':
					if (action == 'expanded'){
						$scope.vpaneClass.tests = "glyphicon glyphicon-minus icon-vpn";
					}else{
						$scope.vpaneClass.tests = "glyphicon glyphicon-plus icon-vpn";
					}
					break;
			}
		};

		//END - for V-PANE

		$scope.goToCustomers = function () {
			$state.go('home.customers');
		};

		$scope.getImage = function () {
			var random = (new Date()).toString();
			$http({
				method: 'GET',
				url: Domain + 'customers/getImage.php',
				params: {
					'cb': random,
					'user_id': $scope.customerObj.id
				}
			}).success(function (data) {
				$scope.image = data;
			});
		};

		$scope.downloadFile = function (url,name,type){
			$http({
				method: 'GET',
				url:  url,
				responseType: 'arraybuffer'
			}).success(function (data) {
				var b = new Blob([data], { type: type });
				FileSaver.saveAs(b, name);
			});
		};


		$scope.getFilesName = function () {
			$scope.files = [];
			CustomerInfoFactory.getFilesName($scope.customerObj.id).success(function (data) {
				angular.forEach(data, function (value, key) {
					var fileName= value.file_name.replace(/\d+-/,"");
					var file = {
						name: fileName,
						id: value.id,
						url: Domain +'customers/getFile.php/?funcname=getfile&id=' + value.id,
						type:value.file_type
					};
					$scope.files.push(file);
				});
			});
		};


		$scope.enableForm = function () {
			if (!$scope.isedit) {
				$('.form-control ').prop("disabled", false);
				$('.btn-file ').prop("disabled", false);
				$('.checkbox').prop("disabled", false);
				$scope.isedit = true;
			} else {
				$('.form-control ').prop("disabled", true);
				$('.btn-file ').prop("disabled", true);
				$('.checkbox ').prop("disabled", true);
				$scope.isedit = false;
			}
			$(".allways-enable").prop("disabled", false);
		};
		$scope.updateCustomer = function () {
			CustomerInfoFactory.updateCustomer($scope.customerObj).success(function (data) {
				if (data.errors) {} else {
					toaster.pop('success', 'Action successfully completed');
					CustomersFactory.updateCustomerArray($scope.index, $scope.customerObj);
				}
			});
		};
		$scope.submit = function () {
			$scope.upload($scope.file);

		};
		$scope.uplaoudImg = function () {
			$scope.upload($scope.file);
		};

		$scope.compressFile = function(file){
			return Ahdin.compress({
				sourceFile:file,
				maxWidth:1000,
				outputFormat:'png'
			});
		};

		$scope.uploadimage = function (file) {
			var userid = $scope.customerObj.id;
			var filename = 'profile_image_' + userid +'.jpeg';
			if(file === null)
			{
				return;
			}
			document.getElementById("custimage").src = URL.createObjectURL(file);

			Upload.upload({
				url: Domain +'customers/uploadImage.php/',
				data: {
					file: file,
					filename:filename,
					userid: userid
				},
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			}).then(function (resp) {

				$scope.progress.show = false;
				$scope.progress_image.show = false;

			}, function (resp) {
				$scope.progress_image.show = true;
			}, function (evt) {
				$scope.progress.show = true;
				$scope.progress_image.show = true;
				$scope.progress.Percentage = parseInt(100.0 * evt.loaded / evt.total);
				$scope.progress_image.Percentage = parseInt(100.0 * evt.loaded / evt.total);
			});

		};

		$scope.upload = function (file) {
			var userid = $scope.customerObj.id;
			if(file === null)
			{
				return;
			}

			Upload.upload({
				url: Domain +'customers/uploadFile.php/',
				data: {
					file: file,
					userid: userid
				}
			}).then(function (resp) {
				toaster.clear();
				toaster.pop('success', 'Action successfully completed ');
				$scope.progress.show = false;
				$scope.progress_image.show = false;
				var newfile = {
					name: file.name,
					id: resp.data,
					url: Domain +'customers/getFile.php/?funcname=getfile&id=' + resp.data
				};
				console.log(newfile);
				$scope.files.push(newfile);


			}, function (resp) {
				$scope.progress_image.show = true;
			}, function (evt) {
				$scope.progress.show = true;
				$scope.progress_image.show = true;
				$scope.progress.Percentage = parseInt(100.0 * evt.loaded / evt.total);
				$scope.progress_image.Percentage = parseInt(100.0 * evt.loaded / evt.total);
			});

		};

		$scope.deleteFile = function (name, id, index) {
			var confirm = $mdDialog.confirm().title('Delete ' + name + '?')
				.parent(angular.element(document.querySelector('#trxnew')))
				.textContent('It will be removed permanently')
				.ok('Delete')
				.cancel('Cancle')
				.targetEvent(event)
				.disableParentScroll(false);
			$mdDialog.show(confirm).then(function () {
				CustomerInfoFactory.deleteFile(id).success(function (data) {
					$scope.files.splice(index, 1);
					toaster.clear();
					toaster.pop('success', 'File Deleted!');
				});
			});

		};

		$scope.updateUsedFriend = function (id, used) {
			CustomerInfoFactory.updateUsedFriend(id, used).success(function (data) {});
		};

		$scope.deleteFriends = function (id, name,index) {
			var confirm = $mdDialog.confirm().title('Delete ' + name + '?')
				.textContent('It will be removed permanently')
				.ok('Delete')
				.cancel('Cancel')
				.targetEvent(event)
				.disableParentScroll(false);
			$mdDialog.show(confirm).then(function () {
				CustomerInfoFactory.deleteFriend(id,index);
			}, function () {
			});
		};

		$scope.deleteTest = function (id,index) {
			var confirm = $mdDialog.confirm().title('Delete?')
				.textContent('It will be removed permanently')
				.ok('Delete')
				.cancel('Cancel')
				.targetEvent(event)
				.disableParentScroll(false);
			$mdDialog.show(confirm).then(function () {
				CustomerInfoFactory.deleteTest(id,index);
			}, function () {
			});
		};

		$scope.deleteGoal = function (id, index) {
			var confirm = $mdDialog.confirm().title('Delete?')
				.textContent('It will be removed permanently')
				.ok('Delete')
				.cancel('Cancel')
				.targetEvent(event)
				.disableParentScroll(false);
			$mdDialog.show(confirm).then(function () {
				CustomerInfoFactory.deleteGoal(id, index);
			}, function () {
			});
		};
	}]);

app.factory("CustomerInfoFactory", ['$filter', '$http', 'toaster','Domain', function ($filter, $http, toaster,Domain) {
	var self = {
		'shared_scope': {},
		'startrows': 0,
		'endrows': 20,
		'hasmore':true,
		'isloading': false,
		'paymentssarr':[],
		'loadingtext': "",
		'total_payment': "",
		'form_data_test' : {},
		'form_data_goals' : {},
		'form_data_friend':{},
		'testsarr' : [],
		'goalsarr' : [],
		'friendsarr' : [],
		'userid' : "",
		'loadMore' : function () {
			if (!self.isloading && self.hasmore) {
				self.startrows = self.startrows + self.endrows + 1;
				self.getPaymetsByUser(self.userid);
			}
		},
		'getPaymetsByUser' : function (user_id) {
				self.isloading = true;
				self.loadingtext = "Loading Data...";
				$http({
					method: 'GET',
					url: Domain +'payments/getPayments.php',

					params: {
						'start': self.startrows,
						'end': self.endrows,
						'user_id': user_id,
						'actionname': 'byuser'
					}
				}).success(function (data) {
					if (data.length === 0) {
						self.hasmore = false;
						self.isloading = false;
					} else {
						angular.forEach(data, function (value) {
							var payment = value;
							payment.is_paid = Number(value.is_paid);
							self.paymentssarr.push(payment);
						});
						self.isloading = false;
					}
				}).error(function (data, status){
					console.log("Error status : " + status);
				});

		},
		'getGoalsByUser' : function (user_id) {
			self.goalsarr = [];
			$http({
				method: 'GET',
				url: Domain +'goals/getGoals.php',

				params: {
					'user_id': self.userid
				}
			}).success(function (data) {
				angular.forEach(data, function (value) {
					self.goalsarr.push(value);
				});
			});
		},
		'getTrainDaysByUser' : function (user_id){
			return $http({
				method: 'GET',
				url: Domain +'traindays/getTrain.php',
				params: {
					'user_id': self.userid
				}
			});
		},
		'getTestsByUser' : function (user_id) {
			self.testsarr = [];
			$http({
				method: 'GET',
				url: Domain +'tests/getTests.php',

				params: {
					'user_id': self.userid
				}
			}).success(function (data) {
				angular.forEach(data, function (value) {
					self.testsarr.push(value);
				});
			});
		},
		'getTotalByUser' : function (user_id) {
			$http({
				method: 'GET',
				url: Domain +'payments/getPayments.php',

				params: {
					'user_id': self.userid,
					'actionname': 'totalbyuser'
				}
			}).success(function (data) {
				self.total_payment = data[0]['SUM(total)'];
			});
		},
		'getFilesName' : function (user_id) {
			return $http({
				method: 'GET',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'customers/customers.php/?funcname=getfilesname',
				params: {
					'user_id': self.userid
				}
			});
		},
		'getFriendsByUser' : function (user_id) {
			self.friendsarr = [];
			 $http({
				method: 'GET',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'customers/customers.php/?funcname=getfriends',
				params: {
					'user_id': self.userid
				}
			}).success(function (data) {
				angular.forEach(data, function (value) {
					value.used = Number(value.used);
					self.friendsarr.push(value);
				});
			});
		},
		'updateTrainDay' : function (day,user_id,day_value){
			$http({
				method: 'GET',
				url: Domain +'traindays/updateTrain.php',

				params: {
					'user_id': self.userid,
					'day':day,
					'day_value':day_value

				}
			}).success(function (data) {});
		},
		'updateCustomer': function (obj) {
			var entity = angular.copy(obj);
			entity.birth_date = $filter('date')(entity.birth_date, "yyyy-MM-dd");
			entity.sign_date = $filter('date')(entity.sign_date, "yyyy-MM-dd");
			localStorage.setItem("customer", JSON.stringify(entity));
			return $http({
				method: 'POST',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'customers/createCustomer.php/',
				data: {
					entity: entity,
					actionname: 'update'
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (data) {});
		},

		'updateUsedFriend' : function (id, used) {
			return $http({
				method: 'POST',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'customers/friends.php/',
				data: {
					id: id,
					used: used,
					actionname: 'updatefriends'
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			});
		},
		'createNewTest' : function (user_id) {
			var entity = angular.copy(self.form_data_test);
			entity.test_date = $filter('date')(entity.test_date, "yyyy-MM-dd");
			$http({
				method: 'POST',
				url: Domain +'tests/createTests.php/',
				data: {
					entity: entity,
					user_id: self.userid
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (data) {
				toaster.pop('success', 'Action successfully completed');
				entity.id = data;
				self.testsarr.push(entity);
			});
		},
		'createNewGoal' : function (user_id) {
			var entity = angular.copy(self.form_data_goals);
			entity.date_goal = $filter('date')(entity.date_goal, "yyyy-MM-dd");
			$http({
				method: 'POST',
				url: Domain +'goals/createGoals.php/',
				data: {
					entity: entity,
					user_id: self.userid
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (data) {
				toaster.pop('success', 'Action successfully completed');
				entity.id = data;
				self.goalsarr.push(entity);
			});
		},
		'createNewFriend' : function (user_id) {
			var entity = angular.copy(self.form_data_friend);
			entity.friend_date = $filter('date')(entity.friend_date, "yyyy-MM-dd");
			$http({
				method: 'POST',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'customers/friends.php/',
				data: {
					'friend_name': entity.friend_name,
					'friend_date':entity.friend_date,
					'user_id': self.userid,
					actionname: 'insertfriends',
					used: 0
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (data) {
				toaster.pop('success', 'Action successfully completed');
				entity.id = data;
				self.friendsarr.push(entity);

			});
		},
		'deleteTest' : function (id,index) {
			$http({
				method: 'POST',
				url: Domain +'tests/deleteTest.php/',
				data: {
					id: id
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (data) {
				self.testsarr.splice(index, 1);
			});
		},
		'deleteGoal' : function (id,index) {
			$http({
				method: 'POST',
				url: Domain +'goals/deleteGoal.php/',
				data: {
					id: id
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (data) {
				self.goalsarr.splice(index,1);
			});
		},

		'deleteFile' : function (id) {
			return $http({
				method: 'GET',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'customers/deleteFile.php',
				params: {
					'file_id': id
				}
			});
		},
		'deleteFriend' : function (id,index) {
			return $http({
				method: 'POST',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'customers/friends.php/',
				data: {
					id: id,
					actionname: 'deletefriends'
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (data) {
				self.friendsarr.splice(index,1);
			});
		}
	};
	return self;

}]);