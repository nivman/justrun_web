'use strict';


app.controller('headerNotificationController',['$scope','$http','$state','CustomersFactory','$modal','birthDaysFactory','Domain','$localStorage', function ($scope, $http, $state,CustomersFactory,$modal,birthDaysFactory,Domain,$localStorage) {


    var customers = CustomersFactory;
    $scope.birthdayscount = 0;
    $scope.birthday = birthDaysFactory;

    $scope.countBirthDays= function(){
        var counter = 0;
        var this_month = moment(new Date()).format('M');
        customers.getBirthDays().success(function (data) {
            angular.forEach(data,function(value,key){
                if (moment(value['birth_date']).format('M') == this_month){
                    $scope.birthday.thisMonthBirthDay.push(value);
                    counter++;
                }
            });
            $scope.birthdayscount =  counter;
        });
    };


    $scope.showBirthDays = function(){
        $scope.enterdatamodal = (
            $modal({
                scope: $scope,
                templateUrl: 'scripts/directives/header/header-notification/birthdays.html',
                show: true
            })
        );
    };

    $scope.hideModal = function() {
        $scope.enterdatamodal.hide();

    };



    $scope.logout = function () {
        $http({
            method: 'POST',
            //DO NOT FORGET TO CHANGE THE URL!!!!!//
            url: Domain +'logout/logout.php',

            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).success(function (response) {
            $localStorage.token = null;
            $state.go('login');
        }).error(function (error) {
            console.log(error);
        });
    };


}]);


app.factory("birthDaysFactory",['$http','$mdDialog','toaster','$filter','$state',function($http,$mdDialog,toaster,$filter,$state){
    var self = {
        'thisMonthBirthDay':[]
    };


    return self;

}]);



angular.module('justrun').directive('headerNotification', function () {

    return {
        templateUrl: 'scripts/directives/header/header-notification/header-notification.html',
        restrict: 'E',
        replace: true
    }
});