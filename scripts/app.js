var app = angular.module('justrun', [
    'ngMaterial',
    'ngMessages',
    'ngCookies',
    'ngAnimate',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'toaster',
    'infinite-scroll',
    'mgcrea.ngStrap',
    'ngStorage',
    'ngFileUpload',
    'ngCkeditor',
    'justrun.controller.login',
    'justrun.controller.main',
    'justrun.controller.dashboard',
    'justrun.customers',
    'justrun.customersinfo',
    'justrun.trx',
    'justrun.trxform',
    'justrun.trxnewevent',
    'justrun.calendar',
    'justrun.tickets',
    'justrun.benefits',
    'justrun.sidebar',
    'justrun.payments',
    'angularjs-dropdown-multiselect',
    'mwl.calendar',
    'ahdin',
    'angular-svg-round-progressbar',
    'vAccordion',
    'ngFileSaver'

]);


// app.config(['$compileProvider', function($compileProvider) {
//     //configure routeProvider as usual
//     $compileProvider.debugInfoEnabled(false);
// }]);



app.constant('Domain', '');



app.config(function($stateProvider,$urlRouterProvider,$httpProvider){

    $httpProvider.interceptors.push('AuthInterceptor');
    $urlRouterProvider.otherwise('/dashboard');

    $stateProvider
        .state('home',{
            url:'',
            templateUrl:'pages/main.html',
            controller:'MainCtrl',
            abstract:true
        })
        .state('home.dashboard',{
            url:"/dashboard",
            templateUrl:'pages/dashboard.html',
            controller:'DashboardCtrl'
        })
        .state('home.customers',{
            url:'/customers',
            templateUrl:'customers/customers.html',
            controller:'CustomersController'
        })
        .state('home.customersinfo',{
            url:'/customerinfo/:id',
            templateUrl:'customers/customerinfo/customer_info.html',
            controller:'CustomerInfoController',
            params: {
                customer:null
            }
        })
        .state('home.trx', {
            url: '/trx',
            templateUrl: 'trx/trx.html',
            controller: 'TrxController'
        })
        .state('home.calendar', {
            url: '/calendar',
            templateUrl: 'calendar/calendar.html',
            controller: 'CalendarController'
        })
        .state('home.tickets', {
            url: '/tickets',
            templateUrl: 'tickets/tickets.html',
            controller: 'TicketsController'
        })
        .state('home.benefits', {
            url: '/benefits',
            templateUrl: 'benefits/benefits.html',
            controller: 'BenefitController'
        })
        .state('home.payments', {
            url: '/payments',
            templateUrl: 'payments/payments.html',
            controller: 'PaymentsController'
        })
        .state('home.emailedit', {
            url: '/emailedit',
            templateUrl: 'scripts/directives/sidebar/newEmailTemplate.html',
            controller: 'SidebarController'
        })
        .state('login',{
            url:'/login',
            templateUrl:'login/login.html',
            controller:'LoginController'
        })
        .state('signup',{
            url:'/login/7110eda4d09e062aa5e4a390b0a572ac0d2c0220',
            templateUrl:'login/7110eda4d09e062aa5e4a390b0a572ac0d2c0220/signup.html',
            controller:'LoginController'
        });

});



