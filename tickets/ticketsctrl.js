/**
 * Created by eladschwartz on 20/06/2016.
 */
var app = angular.module('justrun.tickets', []);

app.controller('TicketsController', ['$scope','$http','$modal','TicketsFactory','$mdDialog','CustomersFactory','Domain',function ($scope,$http,$modal,TicketsFactory,$mdDialog,CustomersFactory,Domain) {

    $scope.tickets = TicketsFactory;
    $scope.ticketsautoarr = CustomersFactory.autocompetearr;//for autocomplete
    $scope.shared = TicketsFactory.shared_scope;


    $scope.shared.hide = function(){

        if($scope.enterdatamodal !== undefined)
        {
            $scope.enterdatamodal.hide();
        }
    };


    $scope.init = function (){
        $scope.tickets.ticketsarr = [];
        $scope.tickets.startrows = 0;
        $scope.tickets.getTickets();
    };

    $scope.updateTotal = function (total,name,index,id){
        $scope.tickets.formdataupdated.total = total;
        $scope.tickets.formdataupdated.ticket_name = name;
        $scope.tickets.formdataupdated.id = id;
        $scope.tickets.formdataupdated.index = index;
        $scope.tickets.formdataupdated.first_name =name;

        $scope.enterdatamodal = $modal({
            scope: $scope,
            templateUrl: 'tickets/update_ticket.html',
            show: true
        });
    };

    $scope.showmodal = function() {
        $scope.enterdatamodal = $modal({
            scope: $scope,
            templateUrl: 'tickets/new_ticket.html',
            show: true
        });
    };

    $scope.hideModal = function() {
        $scope.enterdatamodal.hide();
    };

    $scope.update = function(action,id,index){
        if ($scope.tickets.ticketsarr[index].total === 0 && action === 'subtract'){
            var confirm = $mdDialog.confirm().title("Can't Change Data")
                .textContent("Number of Lessons in 0")
                .ok('OK')
                .targetEvent(event)
                .disableParentScroll(false);
            $mdDialog.show(confirm);
        }else {
            $scope.tickets.updateTicket(action, id,0);
            if (action === "add") {
                $scope.tickets.ticketsarr[index].total++;
            } else {
                $scope.tickets.ticketsarr[index].total--;
                if ($scope.tickets.ticketsarr[index].total < 0) {
                    $scope.tickets.ticketsarr[index].total = 0;
                }

            }
        }
    };
}]);


app.factory("TicketsFactory",['$http','$mdDialog','toaster','Domain',function($http,$mdDialog,toaster,Domain){

    var self = {
        shared_scope: {},
        'ticketsarr':[],
        'formdata':{},
        'formdataupdated':{},
        'hasmore':true,
        'startrows':0,
        'endrows':20,
        'loadingtext':'',
        'isloading':false,
        'isdeleting':false,
        'getTickets':function () {
            if (!self.isloading) {
                self.isloading = true;
                self.loadingtext = "Loading Data...";
                $http({
                    method: 'GET',
                    url: Domain +'tickets/getTickets.php/',

                    params:{'start':self.startrows,
                        'end':self.endrows
                    }
                }).success(function (data) {

                    if (data.length === 0 ){
                        self.hasmore = false;
                        self.isloading = false;
                    }else {
                        angular.forEach(data,function(value){
                            if (value.total < 0){
                                value.total = 0;
                            }
                            self.ticketsarr.push(value);
                        });
                        self.isloading = false;
                    }
                });
            }
        },
        'createNewTicket': function (){
            var entity = angular.copy(self.formdata);
            $http({
                method: 'POST',
                url: Domain +'tickets/createTicket.php/',
                data: {
                    entity:entity,
                    client_name:self.formdata.selected.name
                },
                headers:{
                    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function (data) {
                toaster.pop('success','Created!');
                entity.client_name = self.formdata.selected.name;
                entity.id = data;
                self.ticketsarr.unshift(entity);
                self.shared_scope.hide();


            });
        },
        'updateTicket': function (action,ticket_id,total){
            var index = self.formdataupdated.index;
            $http({
                method: 'POST',
                url: Domain +'tickets/updateTicket.php/',
                data: {
                    ticket_id:ticket_id,
                    actionname:action,
                    total:total
                },
                headers:{
                    'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function (data) {
                toaster.clear();
                toaster.pop('success','Data Updated');

                if (total  !== 0){
                    self.ticketsarr[index].total = total;
                }
                self.shared_scope.hide();
            });
        },
        'deleteTicket': function(id,index){
            self.isdeleting = true;
            self.loadingtext = "Deleting Data...";
            var confirm = $mdDialog.confirm().title('Delete Ticket?')
                .textContent('The ticket will be remove permanently')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(event)
                .disableParentScroll(false);
            $mdDialog.show(confirm).then(function(){
                $http({
                    method: 'GET',
                    //DO NOT FORGET TO CHANGE THE URL!!!!!//
                    url: Domain +'tickets/deleteTicket.php/?ticket_id='+id,
                    headers:{
                        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).success(function (data) {
                    toaster.pop('success','Action successfully completed');
                    self.isdeleting  = false;
                    self.ticketsarr.splice(index,1);
                });
            },function(){
                self.isdeleting  = false;
            });
        },
        'loadMore': function(){
            if (!self.isloading && self.hasmore) {
                self.startrows = self.endrows +1;
                self.endrows = self.endrows + 20;
                self.getTickets();
            }
        }
    };
    return self;

}]);
//
// app.directive('myEnterTicket', function () {
//     return function (scope, element, attrs) {
//         element.bind("keydown keypress", function (event) {
//             if(event.which === 13) {
//                 scope.$apply(function (){
//                     scope.$eval(attrs.myEnter);
//                 });
//
//                 event.preventDefault();
//             }
//         });
//     };
// });
