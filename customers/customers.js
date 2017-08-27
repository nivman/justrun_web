var app = angular.module('justrun.customers', []);

app.controller('CustomersController', ['$scope', '$http', 'CustomersFactory', '$modal', 'Domain', function ($scope, $http, CustomersFactory, $modal,Domain) {

    $scope.customers = CustomersFactory;

    $scope.shared = CustomersFactory.shared_scope;
    $scope.shared.show = function () {
        $scope.customers.saveNewCustomer = true;

    };
    $scope.shared.hide = function () {
        $scope.customers.saveNewCustomer = false;
    };

    $scope.init = function (){
        $scope.clear();
        //$scope.calculateAgefordb();
    };

    // $scope.calculateAgefordb = function () { // birthday is a date
    //
    //     $http({
    //         method: 'GET',
    //         url: Domain +'customers/customers.php/?funcname=getallcustomers2'
    //     }).success(function (data) {
    //         angular.forEach(data, function (value) {
    //            var dob = new Date(value.birth_date);
    //             var diff_ms = Date.now() - dob.getTime();
    //             var age_dt = new Date(diff_ms);
    //             var age = Math.abs(age_dt.getUTCFullYear() - 1970);
    //             //console.log(age + " - " + dob)
    //             $http({
    //                 method: 'GET',
    //                 url: Domain +'customers/customers.php/?funcname=updatecustomer',
    //                 params:{
    //                     user_id: value.id,
    //                     age: age
    //                 }
    //             }).success(function (data) {
    //                 console.log(data)
    //             });
    //         });
    //
    //     });
    // };


    //Search Feature
    $scope.searchtext = "";
    $scope.search = function () {
        var func_name = 'search';
        var search_text = $scope.searchtext;
        var value = $scope.Options.selectedoption.value;
        var counter = 0;
        if ($scope.searchtext === "") {
            return;
        }


        if ($scope.Options.selectedoption.value === 'program'){
            func_name = 'searchbyprogram';
        }

        $scope.customers.issearch = true;
        $http({
            method: 'GET',
            //DO NOT FORGET TO CHANGE THE URL!!!!!//
            url: Domain+'customers/customers.php/?funcname='+func_name,
            params: {
                'searchby': value,
                'searchtext':search_text,
                'counter':counter
            }
        }).success(function (data) {
            $scope.customers.customersarr = [];
            angular.forEach(data, function (value){
                value.age = $scope.customers.getAge(new Date(value.birth_date));
                $scope.customers.customersarr.push(value);
            });
        });
    };

    $scope.clear = function () {
        if ($scope.customers.fullarray.length > 0) {
            $scope.customers.customersarr = $scope.customers.fullarray;
            $scope.searchtext = "";
            $scope.customers.issearch = false;
        }
    };
    //END -Search Feature


    //function for Excel feature
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        $scope.customers.customersExsport=[];
        var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
        var textRange;
        var j = 0;
        var tab = document.getElementById('exportTable'); // id of table

        for (j = 0; j < tab.rows.length; j++) {
            tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
            //tab_text=tab_text+"</tr>";
        }

        tab_text = tab_text + "</table>";
        tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, ""); //remove if u want links in your table
        tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
        tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) // If Internet Explorer
        {
            txtArea1.document.open("txt/html", "replace");
            txtArea1.document.write(tab_text);
            txtArea1.document.close();
            txtArea1.focus();
            sa = txtArea1.document.execCommand("SaveAs", true, "Say Thanks to Sumit.xls");
        } else //other browser not tested on IE 11
        {
            sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));
        }

        return (sa);
    });
    $scope.fnExcelReport = function () {
        CustomersFactory.getAllCustomers();

    };

    //END - function for Excel feature

    //Shows & Hide the new coustomer html
    $scope.showmodal = function () {
        $scope.enterdatamodal = $modal({
            scope: $scope,
            templateUrl: 'customers/customernew.html',
            show: true
        });
    };

    $scope.hideModal = function () {
        $scope.customers.resetFormData();
        $scope.enterdatamodal.hide();

    };
    //END - Shows & Hide the new coustomer html



    $scope.calculateAge = function (dob) { // birthday is a date
        if (dob !== undefined && dob !== null && dob !== "")  {
            var today_date = new Date();
            var age = 0;
            var diff_ms = Date.now() - dob.getTime();
            var age_dt = new Date(diff_ms);
            age = Math.abs(age_dt.getUTCFullYear() - 1970);
            $scope.customers.formdata.age = age;
        }
    };



    $scope.$on('closeDialog', function () {

        $scope.hideModal();
    });

    //Filters Options
    $scope.Options = {
        availableOptions: [
            {
                value: 'first_name',
                label: 'First Name'
            },
            {
                value: 'last_name',
                label: 'Last Name'
            },
            {
                value: 'email',
                label: 'Email'
            },
            {
                value: 'birth_date',
                label: 'Birth Date'
            },
            {
                value: 'sign_date',
                label: 'Sign Date'
            },
            {
                value: 'phone_number',
                label: 'Phone Number'
            },
            {
                value: 'ref',
                label: 'Reference'
            }, {
                value: 'program',
                label: 'Program'
            }
        ],

        selectedoption: {
            value: 'fff',
            label: 'Choose Column'
        }
    };

}]);


app.factory("CustomersFactory", ['$http', '$mdDialog', 'toaster', '$filter', '$state', '$rootScope', 'CustomerInfoFactory', 'Domain', function ($http, $mdDialog, toaster, $filter, $state, $rootScope,CustomerInfoFactory,Domain) {

    var self = {
        shared_scope: {},
        'customersarr': [],// main array for customers
        'autocompetearr': [],
        'customersExsport': [],
        'fullarray': [],
        'issearch': false,
        'formdata': {first_name:"",last_name:"",gender:"",email:"",address:"",birth_date:"",sign_date:"",age:"",phone_number:"",ref:"",program:"",string:"",location:"", active:false,facebook:false,trx:false,
            sunday:"",
            monday:"",
            tuesday:"",
            wednesday:"",
            thursday:"",
            friday:"",
            saturday:""
        },
        'hasmore': true,
        'hasmore_not_active': true,
        'startrows': 0,
        'endrows': 20,
        'startrows_notactive': 0,
        'loadingtext': '',
        'isloading': false,
        'isdeleting': false,
        'isbirthday': false,
        'image': "",
        'isactive': true,
        'active_text': 'Show Inactive Customers',

        //this function is called by main.ctrl
        'getCustomers': function () {
            console.log('getcust');
            console.log('loading: ' + self.isloading)
            if (self.startrows === 0) {
                self.customersarr = [];
            }
            if (!self.isloading) {
                self.isloading = true;
                console.log("test");
                self.loadingtext = "Loading Data...";
                $http({
                    method: 'GET',
                    url: Domain +'customers/customers.php/?funcname=getallcustomers',

                    params: {
                        'start': self.startrows,
                        'end': self.endrows
                    }
                }).success(function (data) {
                    console.log(data)
                    if (data.length === 0) {
                        console.log("no data");
                        self.hasmore = false;
                        self.isloading = false;
                    } else {
                        angular.forEach(data, function (value) {
                            value.age = self.getAge(new Date(value.birth_date));
                            self.customersarr.push(value);
                        });
                        self.fullarray = angular.copy(self.customersarr);
                        self.isloading = false;
                    }

                });
            }
        },
        'getAge': function (dob) { // birthday is a date
            if (dob !== undefined && dob !== null && dob !== "")  {
                var today_date = new Date();
                var age = 0;
                var diff_ms = Date.now() - dob.getTime();
                var age_dt = new Date(diff_ms);
                age = Math.abs(age_dt.getUTCFullYear() - 1970);
                return age;
            }
    },
    'getAllCustomers': function () {
            self.customersExsport = [];
            $http({
                method: 'GET',
                url: Domain +'customers/customers.php/?funcname=getallcustomers2'
            }).success(function (data) {
                angular.forEach(data, function (value) {

                    self.customersExsport.push(value);
                });

            });

        },
        'SwitchActiveUsers': function () {
            self.isactive = !self.isactive;
            console.log(self.isactive);
            if (self.isactive) {
                self.active_text = 'Show Inactive Customers';
                self.isactive = true;
                self.customersarr = [];
                self.hasmore = true;
                self.startrows = 0;
                self.endrows = 20;
                self.startrows_notactive = 0;
                self.hasmore_not_active = true;
                self.getCustomers();
            } else {
                self.customersarr = [];
                self.active_text = 'Show Active Customers';
                if (!self.isloading) {
                    self.isloading = true;
                    self.loadingtext = "Loading Data...";
                    $http({
                        method: 'GET',
                        url: Domain +'customers/customers.php/?funcname=getnotactive',

                        params: {
                            'start': self.startrows_notactive,
                            'end': self.endrows
                        }
                    }).success(function (data) {
                        if (data.length === 0) {
                            self.hasmore_not_active = false;
                            self.isloading = false;
                        } else {
                            angular.forEach(data, function (value) {
                                self.customersarr.push(value);
                            });
                            self.fullarray = angular.copy(self.customersarr);
                            self.isloading = false;
                        }
                    });
                }
            }

        },
        'getNotActiveUsers': function () {
            self.isloading = true;
            self.loadingtext = "Loading Data...";
            $http({
                method: 'GET',
                url: Domain +'customers/customers.php/?funcname=getnotactive',

                params: {
                    'start': self.startrows_notactive,
                    'end': self.endrows
                }
            }).success(function (data) {
                if (data.length === 0) {
                    self.hasmore_not_active = false;
                    self.isloading = false;
                } else {
                    angular.forEach(data, function (value) {
                        self.customersarr.push(value);
                    });
                    self.fullarray = angular.copy(self.customersarr);
                    self.isloading = false;
                }
            });
        },
        'loadMore': function () {
            console.log(self.startrows)
            console.log(self.hasmore)
            if (!self.isactive) {
                if (!self.isloading && self.hasmore_not_active && !self.issearch) {
                    self.startrows_notactive = self.startrows_notactive + self.endrows;
                    self.getNotActiveUsers();
                }
            } else {
                if (!self.isloading && self.hasmore && !self.issearch) {
                    self.startrows = self.startrows + self.endrows;
                    self.getCustomers();
                }
            }


        },
        'getCustomersForAutoComplete': function () {
            self.autocompetearr = [];
            return $http({
                method: 'GET',
                url: Domain +'customers/customers.php/?funcname=getcustomerstrx'
            }).success(function (data) {
                angular.forEach(data, function (value) {
                    self.autocompetearr.push({
                        name: value.first_name + " " + value.last_name,
                        first_name : value.first_name,
                        last_name:value.last_name,
                        user_id: value.id,
                        phonenumber: value.phone_number,
                        email: value.email,
                        id:value.id
                    });
                });
            });
        },
        'createNewCustomer': function () {
            self.shared_scope.show();
            var entity = angular.copy(self.formdata);
            entity.birth_date = $filter('date')(entity.birth_date, "yyyy-MM-dd");
            entity.sign_date = $filter('date')(entity.sign_date, "yyyy-MM-dd");
            $http({
                method: 'POST',
                url: Domain +'customers/createCustomer.php/',

                data: {
                    entity: entity,
                    actionname: 'create'
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function (data) {
                self.createTrainDays(entity,data);
                if (typeof entity.trx === 'undefined') {
                    entity.trx = false;
                }
                entity.id = data;
                self.customersarr.unshift(entity);
                self.fullarray = angular.copy(self.customersarr);
                self.isloading = false;
                self.hideModel();
                //self.sendEmail(entity.email, entity.first_name + " " + entity.last_name, entity.gender);
                self.shared_scope.hide();

            });
        },
        'createTrainDays': function (entity,user_id){
            $http({
                method: 'POST',
                url: Domain +'traindays/createTrain.php/',

                data: {
                    entity: entity,
                    user_id: user_id
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function (data) {});
        },
        'hideModel': function () {
            $rootScope.$broadcast('closeDialog', {});
        },
        'sendEmail': function (email, name, gender) {
            if (gender === 'male') {
                gender = 'male';
            } else {
                gender = 'female';
            }
            $http({
                method: 'POST',
                //DO NOT FORGET TO CHANGE THE URL!!!!!//
                url: Domain +'email/sendEmail.php/',
                data: {
                    email: email,
                    name: name,
                    gender: gender
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                params: {}
            }).success(function (data) {});
        },
        'deleteCustomer': function (userid, event, name) {
            var confirm = $mdDialog.confirm().title('Delete' + name + '?')
                .textContent('This customer will be remove permanently')
                .ok('Delete')
                .cancel('Cancle')
                .targetEvent(event)
                .disableParentScroll(false);
            $mdDialog.show(confirm).then(function () {
                //self.customersarr = [];
                self.deleteCustomerFromLocalArray(userid, event, name);
                $http({
                    method: 'GET',
                    //DO NOT FORGET TO CHANGE THE URL!!!!!//
                    url: Domain +'customers/customers.php/?funcname=deletecustomer&user=' + userid,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }
                }).success(function (data) {
                    toaster.clear();
                    toaster.pop('success', 'Action successfully completed');
                    self.isdeleting = false;
                });
            }, function () {
                self.isdeleting = false;
            });
        },
        'deleteCustomerFromLocalArray': function (userid, event, name) {
            angular.forEach(self.customersarr, function (value) {
                if (value.id == userid) {
                    var index = self.customersarr.indexOf(value);
                    self.customersarr.splice(index, 1);
                    self.fullarray = angular.copy(self.customersarr);
                    self.isloading = false;
                }
            });
        },
        'goToCustomerPage': function (customer, $index) {
            $('html,body').scrollTop(0);
            CustomerInfoFactory.paymentssarr = [];
            CustomerInfoFactory.startrows = 0;
            $state.go('home.customersinfo', {
                id: customer.id,
                customer: customer,
                index: $index
            });
            localStorage.setItem("customer", JSON.stringify(customer));
        },
        'checkBirthday': function (cust) {
            var datenow = moment(new Date()).format('M');
            var bdayday = moment(cust.birth_date).format('M');

            return (bdayday === datenow);

        },
        'updateCustomerArray': function (index, custobj) {
            var replaceKeyValue;
            var stringifyValue;
            var myRegexp;

            angular.forEach(self.customersarr, function (value) {
                if (value.id == custobj.id) {
                    var index = self.customersarr.indexOf(value);
                    var n = self.customersarr[index];
                    for (var key in n) {
                        var keyValue = custobj[key];
                        var originalKayVale = n[key];
                        if (custobj[key] !== n[key]) {




                            if (key === "created_date" || key === "birth_date" || key === "sign_date"||key === "trx"||key ==="active"||key ==="facebook"||key ==="age"){

                                if (value[key] === "undefined" || value[key] === null ) {
                                    return;
                                }
                                
                                var lookForComma = value[key].includes(",");
                                if (replaceKeyValue !== "undefined") {
                                    if (lookForComma === true) {
                                        stringifyValue = JSON.stringify(custobj);
                                        myRegexp = new RegExp(key + '(.*?",)');
                                    } else {
                                        stringifyValue = JSON.stringify(custobj);
                                        myRegexp = new RegExp(key + "(.*?,)");
                                    }
                                } else {
                                    if (lookForComma === true) {
                                        stringifyValue = JSON.stringify(value);
                                        myRegexp = new RegExp(key + '(.*?",)');
                                    } else {
                                        stringifyValue = JSON.stringify(value);
                                        myRegexp = new RegExp(key + "(.*?,)");
                                    }
                                }
                                var match = myRegexp.exec(stringifyValue);
                                var cleanString;
                                var stringToReplace;
                                if (originalKayVale.length > 0) {
                                    if (lookForComma !== true) {
                                        cleanString = match[1].replace(/"/gi, "").replace(":", "").replace(",", "");
                                    } else {
                                        cleanString = match[1].replace(/"/gi, "").replace(":", "").replace(/,$/, "");
                                    }
                                    var originalValue = '"' + key + '"' + ':' + '"' + cleanString + '"';
                                    var toReplaceValue = '"' + key + '"' + ':' + '"' + custobj[key] + '"';
                                    stringToReplace = new RegExp(cleanString);
                                    replaceKeyValue = stringifyValue.replace(originalValue, toReplaceValue);
                                } else {
                                    cleanString = match[0].replace(',', "");
                                    var setLocaleNewStirng = cleanString.replace(':', ":");
                                    stringToReplace = new RegExp(cleanString);
                                    replaceKeyValue = stringifyValue.replace(cleanString, setLocaleNewStirng);
                                }
                                var obj = JSON.parse(replaceKeyValue);
                                self.customersarr.splice(index, 1);
                                self.customersarr.splice(index, 0, obj);
                            }
                        }
                    }
                }
            });
        },
        'getBirthDays': function () {
            return $http({
                method: 'GET',
                //DO NOT FORGET TO CHANGE THE URL!!!!!//
                url: Domain +'customers/customers.php/?funcname=birthdays',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            });
        },
        'resetFormData':function(){
            self.formdata =  {first_name:"",last_name:"",gender:"",email:"",address:"",birth_date:"",sign_date:"",age:"",phone_number:"",ref:"",program:"",string:"",location:"", active:false,facebook:false,trx:false,
                sunday:"",
                monday:"",
                tuesday:"",
                wednesday:"",
                thursday:"",
                friday:"",
                saturday:""
            };
        }
    };


    return self;
}]);



app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                    //location.reload();
                });
            }
        }
    };
});