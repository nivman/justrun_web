var app = angular.module('justrun.sidebar', []);

app.controller('SidebarController', ['$scope', '$modal', 'toaster', '$mdDialog', '$http', 'CustomersFactory', '$location', '$state','BenefitFactory','Domain',
    function ($scope, $modal, toaster, $mdDialog, $http, CustomersFactory, $location, $state,BenefitFactory,Domain) {


		$scope.init = function () {
			$scope.id ={male:"",female:""};
			$scope.getEmailData('male');
			$scope.getEmailData('female');
		};
		$scope.editortext = {male:"",female:""};
		$scope.editorOptions = {
			language: 'en',
			removeButtons: ''
		};

		$scope.getEmailData = function(type){
			$http({
				method: 'GET',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'email/getEmailTemplate.php/',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				params: {type:type}
			}).success(function (data) {

				if (type == 'male'){
					$scope.editortext.male = data[0].html;
					$scope.id.male = data[0].id;
				}else{
					$scope.editortext.female = data[0].html;
					$scope.id.female = data[0].id;
				}

			})
		}

		$scope.updateEmail = function (type) {
			var id ="";
			var html = "";
			if (type == 'male'){
				id = $scope.id.male;
				html = $scope.editortext.male

			}else{
				id = $scope.id.female;
				html = $scope.editortext.female
			}
			$http({
				method: 'POST',
				url: Domain +'email/updateEmailTemplate.php/',

				data: {
					id: id,
					html: html
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (data) {
				toaster.clear();
					toaster.pop('success', 'Changes Saved!');
			});
		};
		$scope.saveEmail = function () {
			var data = [{
				'controls': $scope.controls
			}];
			var json = JSON.stringify(data);
			var html = "";

			angular.forEach($scope.controls, function (value, key) {
				console.log(value);
				if (value.type == 'header') {
					html = html + "<h1>" + value.text + "</h1><br>";
				} else {
					html = html + "<div>" + value.text + "</div>";
				}
			});
			console.log(html);
			$http({
				method: 'POST',
				url: Domain +'email/createEmailTemplate.php/',

				data: {
					email_json: json
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (data) {
				console.log(data);
			});
		}
		var imageUnClicked = 'http://justrun.site/images/unclicked_button.svg';
		var imageClicked = 'http://justrun.site/images/clikcked_button.svg';
		var imageHover = 'http://justrun.site/images/huver_blue_color.svg';
 		$scope.keepClickButtonView = function (keyname) {
			var url = $location.path().replace("/", "");
			
			switch (url) {
			case "dashboard":
				$scope.url = imageClicked
				$scope.dashboard = imageClicked;
				break;
			case "customers":
				this.customers = imageClicked;
				break;
			case "trx":
				this.trx = imageClicked;
				break;
			case "calendar":
				this.calendar = imageClicked
				break;
			case "tickets":
				this.tickets = imageClicked;
				break;
			case "benefits":
				this.benefits = imageClicked;
				break;
			case "emailedit":
				this.emailedit = imageClicked;
				break;
			case "payments":
				this.payments = imageClicked;
				break;
			default:
			}
			
		}
		$scope.unClickButtonView = function (keyname) {
			switch (keyname) {
			case "dashboard":
				this.dashboard = imageUnClicked;
				break;
			case "customers":
				this.customers = imageUnClicked;
				break;
			case "trx":
				this.trx = imageUnClicked;
				break;
			case "calendar":
				this.calendar = imageUnClicked
				break;
			case "tickets":
				this.tickets = imageUnClicked;
				break;
			case "benefits":
				this.benefits = imageUnClicked;
				break;
			case "emailedit":
				this.emailedit = imageUnClicked;
				break;
			case "payments":
				this.payments = imageUnClicked;
				break;
			default:
			}
		}
		$scope.mounseHover = function (e) {
			var url = $location.path().replace("/", "");
			switch (e) {
			case "dashboard":
				this.dashboard = imageHover;
				$scope.setFiltersFalse("dashboard");
				break;
			case "customers":
				this.customers = imageHover;
				$scope.setFiltersFalse("customers");
				break;
			case "trx":
				this.trx = imageHover;
				$scope.setFiltersFalse("trx");
				break;
			case "calendar":
				this.calendar = imageHover
				$scope.setFiltersFalse("calendar");
				break;
			case "tickets":
				this.tickets = imageHover;
				$scope.setFiltersFalse("tickets");
				break;
			case "benefits":
				this.benefits = imageHover;
				$scope.setFiltersFalse("benefits");
				break;
			case "emailedit":
				this.emailedit = imageHover;
				$scope.setFiltersFalse("emailedit");
				break;
			case "payments":
				this.payments = imageHover;
				$scope.setFiltersFalse("payments");
				break;
			default:
			}
			$scope.keepClickButtonView($location);

		}
		$scope.changebuttonView = function (e) {
			switch (e) {
			case "dashboard":
				$scope.dashboard = imageClicked;
				$scope.setFiltersFalse("dashboard");
				break;
			case "customers":
				$scope.customers = imageClicked;
				$scope.setFiltersFalse("customers");
				break;
			case "trx":
				$scope.trx = imageClicked;
				$scope.setFiltersFalse("trx");
				break;
			case "calendar":
				$scope.calendar = imageClicked;
				$scope.setFiltersFalse("calendar");
				break;
			case "tickets":
				$scope.tickets = imageClicked;
				$scope.setFiltersFalse("tickets");
				break;
			case "benefits":
				$scope.benefits = imageClicked;
				// BenefitFactory.benefitssarr = [];
				$scope.setFiltersFalse("benefits");
				break;
			case "emailedit":
				$scope.emailedit = imageClicked;
				$scope.setFiltersFalse("emailedit");
				break;
			case "payments":
				$scope.payments = imageClicked;
				$scope.setFiltersFalse("payments");
				break;
			}
		}
		$scope.setFiltersFalse = function (keyname) {
	
			var buttonName = ["dashboard", "customers", "trx", "calendar", "tickets", "benefits", "emailedit", "payments"]
			for (var i = 0; i < buttonName.length; i++) {
				if (keyname != buttonName[i]) {
						
					$scope.unClickButtonView(buttonName[i])
				}
			}
		}
		$scope.mouselive = function (e) {
			this.payments = imageUnClicked;
			this.trx = imageUnClicked;
			this.dashboard = imageUnClicked;
			this.calendar = imageUnClicked
			this.tickets = imageUnClicked;
			this.benefits = imageUnClicked;
			this.emailedit = imageUnClicked;
			this.customers = imageUnClicked;
			$scope.keepClickButtonView($location);
		}
		$scope.keepClickButtonView($location)
		var url = $location.path().replace("/", "");
		$scope.setFiltersFalse(url)
 
		$scope.selectedMenu = 'dashboard';
		$scope.collapseVar = 0;
		$scope.multiCollapseVar = 0;

		$scope.check = function (x) {

			if (x == $scope.collapseVar)
				$scope.collapseVar = 0;
			else
				$scope.collapseVar = x;
		};

		$scope.multiCheck = function (y) {

			if (y == $scope.multiCollapseVar)
				$scope.multiCollapseVar = 0;
			else
				$scope.multiCollapseVar = y;
		};
		var colorditaction = angular.element('#nev-header');
    }]);
app.directive('sidebar', ['$location', function () {
	return {
		templateUrl: 'scripts/directives/sidebar/sidebar.html',
		restrict: 'AE',
		replace: true,
		scope: {},
		controller: 'SidebarController'

	}
}]);