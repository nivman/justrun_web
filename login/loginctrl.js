var app = angular.module('justrun.controller.login', []);

app.controller('LoginController', ['$rootScope', '$scope', '$cookieStore', '$http', '$state', 'CustomersFactory', 'TrxFactory', '$mdDialog','$sce','Authorization','Domain','$localStorage',
	function ($rootScope, $scope, $cookieStore, $http, $state, CustomersFactory, TrxFactory, $mdDialog,$sce,Authorization,Domain,$localStorage) {
		$scope.signUpInfo = {
			username: undefined,
			password: undefined
		};
		$scope.loginInfo = {
			username: undefined,
			password: undefined
		};
		$scope.sign_in = "<div id='login'> <form class='form-signin'> <h2 class='form-signin-heading text-center'> Log in - Just Run - Management System</h2> <label for='inputEmail' class='sr-only'>email address</label> <input type='email' id='inputEmail' class='form-control' placeholder='Email address' ng-model='loginInfo.username' required autofocus> <label for='inputPassword' class='sr-only'>Password</label> <input type='password' id='inputPassword' class='form-control' placeholder='Password' ng-model='loginInfo.password' required> <input class='btn btn-lg btn-primary btn-block' type='submit' value= 'Log in' ng-click='loginUser()'/> <div id='forgotpassbtn-wrappar'>  </div> </form> </div>";

		$scope.loginUser = function () {
			var data = {
				username: $scope.loginInfo.username,
				password: $scope.loginInfo.password
			};
			if (data.username === undefined || data.password === undefined) {
				alert("Please enter user name and password");
				return;
			}
			$http({
				method: 'POST',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'login/login.php/',
				data: data,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (response) {
				if (response === "temppassword") {
					var message = $scope.loginInfo.username;
					$mdDialog.show({
							templateUrl: './login/forgotpassword.html',
							parent: angular.element(document.querySelector('#event-detail')),
							targetEvent: "ev",
							controller: $scope.DialogController,
							clickOutsideToClose: true,
							locals: {
								message: message
							}
						})
						.then(function (answer) {
						}, function () {
						});
					return;
				}
				if (response['state'] != 'home.dashboard') {
					$scope.sign_in = response;
				}else {
					if (response['state'] == 'home.dashboard') {
						if (CustomersFactory.customersarr.length == 0) {
							CustomersFactory.getCustomers();
						}
						if (TrxFactory.eventSources.length == 0) {
							TrxFactory.getEvents();
						}
						Authorization.saveToken(response['token']);
						Authorization.user_name = data.username;
						$state.go(response['state']);
					}
				}
			}).error(function (error) {
				console.log(error);
			});
		};
		$scope.signUserUp = function () {
			var username = $scope.loginInfo.username;
			var data = {
				username: $scope.loginInfo.username,
				password: $scope.loginInfo.password
			};
			if (data.username == undefined || data.password == undefined) {
				alert("Please enter user name and password");
				return;
			}
			$http({
				method: 'POST',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'login/signup.php',
				data: data,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (response) {
				if (response['page'] != 'home.dashboard') {
					$scope.sign_in = response;
				} else {
					Authorization.saveToken(response['token']);
					$state.go(response['page']);
				}
			}).error(function (error) {
				console.log(error)
			});
		};
		$scope.forgetPassword = function () {
			var username = $scope.loginInfo.username;
			if (username === undefined) {
				alert("No email entered");
				return;
			}
			var data = {
				username: $scope.loginInfo.username,
				password: $scope.loginInfo.password
			};
			$http({
				method: 'POST',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'login/forgotpassword.php',
				data: data,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (response) {
				if (response === "nomail") {
					alert("The email does not exist on the system");
				} else {
					alert("Temporary password sent by email");
				}
			}).error(function (error) {
				console.log(error);
			});
		};
		$scope.DialogController = function ($scope, $mdDialog, message) {
			$scope.answer = function () {
				if ($scope.login === undefined ) {
					alert("No password entered");
					return;
				}
				$scope.password = $scope.login.tempPassword;
				var data = {
					username: message,
					password: $scope.password
				};
				$http({
					method: 'POST',
					//DO NOT FORGET TO CHANGE THE URL!!!!!//
					url: Domain +'login/newpassword.php',
					data: data,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					}
				}).success(function (response) {
					$mdDialog.hide();

				}).error(function (error) {
					console.log(error);
				});
			};
		};
		$scope.backToLogin = function(){
			$state.go('login');
		};


	}]);

app.factory('Authorization',['$localStorage','$injector','Domain',function($localStorage,$injector,Domain){
	var self = {
		'q':"",
		'http':"",
		'state':"",
		'user_name':"",
		'saveToken': function (token) {
			$localStorage.token = token;
		},
		'getToken': function () {
			return $localStorage.token;
		},
		'logout': function () {
			$localStorage.token = null;
		},
		'validUser': function () {
			self.state = $injector.get('$state');
			self.http = $injector.get('$http');
			self.http({
				method: 'GET',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain + 'login/auth.php/',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).success(function (data) {
				console.log(data);
			}).error(function (data, status, headers, config) {
				if (status == 401) {
					self.state.go('login');
				}
			});
		}
	};
	return self;
}]);


app.factory('AuthInterceptor',function AuthInterceptor(Authorization,$injector){
	return{
		request:addToken,
		responseError:handleError
	};
	function addToken(config){
		var token = Authorization.getToken();
		if (token){
			config.headers = config.headers || {};
			config.headers.Authorization = 'Bearer ' + token;
		}
		return config;
	}

	function handleError (rejection) {
		if (rejection.status === 401) {
			var state = $injector.get('$state');
			state.go('login');
		}
	}

});




app.directive('compile', ['$compile', function ($compile) {
	return function (scope, element, attrs) {
		scope.$watch(
			function (scope) {
				// watch the 'compile' expression for changes
				return scope.$eval(attrs.compile);
			},
			function (value) {
				// when the 'compile' expression changes
				// assign it into the current DOM
				element.html(value);

				// compile the new DOM and link it to the current
				// scope.
				// NOTE: we only compile .childNodes so that
				// we don't get into infinite loop compiling ourselves
				$compile(element.contents())(scope);
			}
		);
	}}]);