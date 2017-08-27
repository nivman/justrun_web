var app = angular.module('justrun.calendar', ['ui.bootstrap']);
var GllocalCalendarEvents = []
var GLrepeatevent=[];
app.controller('CalendarController', ['$scope', '$compile', '$timeout', '$modal', '$http', 'Calendardetails', '$state', '$mdDialog', '$mdMedia', 'CustomersFactory', 'TrxFactory', '$q', 'CalendarFactory', '$timeout','Domain', function ($scope, $compile, $timeout, $modal, $http, Calendardetails, $state, $mdDialog, $mdMedia, CustomersFactory, TrxFactory, $q, CalendarFactory, $timeout,Domain) {
    $scope.trxEvent = TrxFactory;
    $scope.monthsTrxArray = [];
    $scope.trxEvents = [];
    $scope.shared = CalendarFactory.shared_scope;
    $scope.viewIsActive = true;
    $scope.days = [{
        value: 'sunday',
        name: "Sunday"
	}, {
        value: 'monday',
        name: "Monday"
	}, {
        value: 'tuesday',
        name: "Tuesday"
	}, {
        value: 'wednesday',
        name: "Wednesday"
	}, {
        value: 'thursday',
        name: "Thursday"
	}, {
        value: 'friday',
        name: "Friday"
	}, {
        value: 'saturday',
        name: "Saturday"
	}];

    $scope.enterdatamodal = null;
    $scope.dialogRemoveReminder = function (ev) {
        document.getElementsByTagName("body")[0].style.pointerEvents = 'none';
        if ($scope.guid != null && $scope.guid != "") {
            $mdDialog.show({
                    templateUrl: './calendar/calendarnewevent/removedialog.html',
                    parent: angular.element(document.querySelector('#event-detail')),
                    targetEvent: ev,
                    controller: DialogController,
                    clickOutsideToClose: true
                })
                .then(function (answer) {
                    if (answer == 'multi') {
                        $scope.enableClick();
                        $scope.removeEvent($scope.guid);
                    } else if (answer == 'single') {
                        $scope.enableClick();
                        $scope.removeEvent('single');
                    } else if (answer == 'cencel') {
                        $scope.enableClick();

                    }
                }, function () {
                    $scope.enableClick();
                    $scope.removeEvent($scope.guid)
                });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
            $scope.disAbleClick();
        } else {
            var confirm = $mdDialog.confirm()
                .parent(angular.element(document.querySelector('#event-detail')))
                .title('Delete reminder')
                .textContent('Click OK to delete')
                .ariaLabel('TutorialsPoint.com')
                .ok('OK')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function () {
                $scope.removeEvent('single');
                document.getElementById("myModal").style.display = "none"
                $scope.enableClick();
            }, function () {
                $scope.enableClick();
                console.log('Record not deleted!');
            });
            $scope.disAbleClick();
        }

    };
    $scope.setTrxEvents = function () {
        var getTrxEvents = TrxFactory.getEvents();

        getTrxEvents.then(function (data) {
            $timeout(function () {
                $("#calendar").fullCalendar("addEventSource", data);
            }, 200);
        })
    }

    $scope.disAbleClick = function () {
        setTimeout(function () {
            var mdDefaultTheme = document.getElementsByClassName("md-default-theme");
            if (mdDefaultTheme != "undefined") {
                for (j = 0; j < mdDefaultTheme.length; j++) {
                    mdDefaultTheme[j].style.pointerEvents = 'auto';
                }
            }
            var removeForm = document.getElementsByClassName("remove-form")
            if (removeForm != "undefined") {
                for (i = 0; i < removeForm.length; i++) {
                    removeForm[i].style.pointerEvents = 'auto';
                }
            }
        }, 100);
    }
    $scope.enableClick = function () {
        document.getElementsByTagName("body")[0].style.pointerEvents = 'auto';
    }
    $scope.removeEvent = function (guid) {
        if (guid == 'single') {
            var eventToDeleteByTitle = $scope.eventSelectedTitle
            var eventToDeleteByStartTime = $scope.eventSelectedStartDoBeDelete
                //the server give diffrent date format than the local client so its need to be format as the server date format
            var str = eventToDeleteByStartTime.slice(-1);
            if (str == "Z") {
                eventToDeleteByStartTime = eventToDeleteByStartTime.replace("Z", "+03:00")
            }
            for (i = 0; i < GllocalCalendarEvents.length; i++) {
                var fromatStartDate = moment(GllocalCalendarEvents[i].start).format();
                if (GllocalCalendarEvents[i].title == eventToDeleteByTitle && fromatStartDate == eventToDeleteByStartTime) {
                    var index = GllocalCalendarEvents.indexOf(GllocalCalendarEvents[i]);
                    GllocalCalendarEvents.splice(index, 1);
                    break;
                }
            }
            data = {
                title: $scope.eventSelectedTitle,
                start: $scope.eventSelectedStartDoBeDelete
            }
            $('#calendar').fullCalendar('removeEvents', function (event) {
                if (event.eventId == $scope.eventId) {
                    return true;
                }
            });
            $http({
                method: 'POST',
                data: data,
                //DO NOT FORGET TO CHANGE THE URL!!!!!//
                url: Domain +'calendar/removeevent.php/?funcname=removeSingleEvent',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function (respond) {
                $scope.hideModal();
            });
        } else {
            $('#calendar').fullCalendar('removeEvents', function (event) {
                if (event.repeatevent == $scope.guid) {
                    return true;
                }
            });
            data = {
                guid: $scope.guid
            }
            $http({
                method: 'POST',
                data: data,
                //DO NOT FORGET TO CHANGE THE URL!!!!!//
                url: Domain +'calendar/removeevent.php/?funcname=removeMultiEvent',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function (respond) {
                
                for(i=0;i<GllocalCalendarEvents.length;i++)
                    {
                        if(GllocalCalendarEvents[i].repeatevent===$scope.guid)
                            {
                                GllocalCalendarEvents.splice(i,1)
                                i--;
                            }
                    }
                
            });
            document.getElementById("myModal").style.display = "none"
            var modalBackdrop = document.getElementsByClassName("modal-backdrop")[0]
            if (modalBackdrop !== null) {
                document.getElementsByTagName('body')[0].removeChild(detailEvents);
                document.getElementsByTagName('body')[0].removeChild(modalBackdrop);
            }
        }
    }



    $scope.alertEventOnClick = function (date, jsEvent, view) {


        if (date == "updateForm") {
            $scope.showmodal(startTime, endTime);
            var startTime = $scope.eventSelectedStartTime;
            var endTime = $scope.eventSelectedEndTime;
            Calendardetails.breakStartTime(startTime, endTime);
            date = "null"
            Calendardetails.addDate(date);

        } else {
            $scope.guid = 'null';
            $scope.showmodal(date);
            Calendardetails.addDate(date);
        }
    };
    $scope.showmodal = function (date) {
        var modalBackdrop = document.getElementsByClassName("modal-backdrop")[0];
        if (modalBackdrop != null) {
            document.getElementsByTagName('body')[0].removeChild(modalBackdrop);
            document.getElementsByTagName('body')[0].removeChild(detailEvents);
        }
        $scope.enterdatamodal = $modal({
            scope: $scope,
            templateUrl: 'calendar/calendarnewevent/calendarnewevent.html',
            show: true,
            controller: 'CalendarEventForm',
            backdrop: 'static'
        })
    };
    $scope.showTrxmodal = function (date) {
        $scope.enterdatamodal = $modal({
            scope: $scope,
            templateUrl: 'trx/form/trxnew.html',
            show: true,
            backdrop: 'static'
        })
    };
    $scope.showdetailmodal = function (date) {
        $scope.enterdatamodal = $modal({
            scope: $scope,
            templateUrl: 'calendar/calendarnewevent/calendardetail.html',
            show: true,
            backdrop: 'static'
        })
    };
    $scope.hideDialog = function (event) {
        $scope.enableClick();
        $scope.eventSelectedTitle = '';
    };
    $scope.hideModal = function () {
        $scope.enableClick();
        if ($scope.enterdatamodal != null) {
            $scope.enterdatamodal.hide();
            $("#calendarNewEvent").remove();
            $(".modal-backdrop").remove();
        }
    };
    $scope.$on('eventFired', function () {
            $scope.enableClick();
            $scope.hideModal();
        })
        /* alert on eventClick show dialog with the details about the selected event */
    $scope.alertOnEventClick = function (date, jsEvent, view) {
        //date.type ==="info" its mean that the event is trx
        if (date.type === "info") {
            var event_date = moment(date.start._d).format("DD/MM/YYYY HH:m");
            $scope.dateclicked = date;
            $scope.datenow = event_date;
            $scope.showTrxmodal(date)
            return;
        }
        var checkIfotificationRemove = $scope.checkIfotificationRemove(date.eventId, date.reminder);
        $scope.reminderNotifications = false;
        if (checkIfotificationRemove == true) {
            date.reminder = 0
        }
        if (date.reminder != 0 && date.reminder != null) {
            $scope.reminderNotifications = true;
        }
        if (date.eventId == undefined) {
            return
        }
        $scope.showdetailmodal();
        $scope.editEventDialog = "false";
        var detailEvents = document.getElementById("detailEvents");
        var modalBackdrop = document.getElementsByClassName("modal-backdrop")[0]
        if (detailEvents != null) {
            document.getElementsByTagName('body')[0].removeChild(detailEvents);
            document.getElementsByTagName('body')[0].removeChild(modalBackdrop);
        }
        $scope.eventSelectedTitle = (date.title);
        $scope.eventSelectedDescription = (date.description);
        $scope.eventSelectedStartDoBeDelete = moment(date.start).format();
        $scope.eventSelectedStartDate = (moment(date.start).format('DD-MM-YYYY'));
        $scope.eventSelectedEndDate = (moment(date.end).format('DD-MM-YYYY'));
        $scope.eventSelectedStartTime = (moment(date.start).format("HH:mm"));
        $scope.eventSelectedEndTime = (moment(date.end).format("HH:mm"));
        $scope.eventId = date.eventId;
        $scope.username = date.username;
        $scope.guid = date.repeatevent;
    };
    $scope.checkIfotificationRemove = function (eventId, reminder) {
        for (i = 0; i < GllocalCalendarEvents.length; i++) {
            if (eventId == GllocalCalendarEvents[i].eventId) {
                if (GllocalCalendarEvents[i].reminder < reminder) {
                    return true;
                    break;
                } else {
                    return false;
                    break;
                }
            }
        }
    };
    $scope.addRemoveEventSource = function (sources, source) {
        var canAdd = 0;
        angular.forEach(sources, function (value, key) {
            if (sources[key] === source) {
                sources.splice(key, 1);
                canAdd = 1;
            }
        });
        if (canAdd === 0) {
            sources.push(source);
        }
    };
    /* add custom event*/
    $scope.addEvent = function () {
        $scope.events.push({
            title: 'Open Sesame',
            start: new Date(y, m, d),
            end: new Date(y, m, d),
            className: ['openSesame']
        });
    };
    /* remove event */
    $scope.remove = function (index) {
        $scope.events.splice(index, 1);
    };
    $scope.eventColor = function (data) {
        console.log(data)
    };
    $scope.eventRender = function (event, element, view) {
        element.attr({
            'tooltip': event.title,
            'tooltip-append-to-body': true
        });
    };
    $scope.shared.renderCalendar = function (repeatevent) {

       GLrepeatevent.push(repeatevent);
     
        var dataR = {
            repeatevent: repeatevent
        }
        return $http({
            method: 'POST',
            data: dataR,
            //DO NOT FORGET TO CHANGE THE URL!!!!!//
            url: Domain +'calendar/getEventsByGuid.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).success(function (data) {
            var SingleMonthevents = [];
            var multiMonthEvents = [];
           
            for (i = 0; i < data.length; i++) {
                   var ts = moment(data[i].start).toObject();
                    var monthsS = ts.months + 1;
                    var y = ts.years;
                    var m = ts.months;
                    var d = ts.date;
                    var hr = ts.hours;
                    var mi = ts.minutes;
                    var te = moment(data[i].end).toObject();
                    var ye = te.years;
                    var me = te.months;
                    var de = te.date;
                    var hre = te.hours;
                    var mie = te.minutes;
                    GllocalCalendarEvents.push({
                        stick: true,
                        title: data[i].title,
                        description: data[i].description,
                        start: new Date(y, m, d, hr, mi),
                        end: new Date(ye, me, de, hre, mie),
                        username: data[i].username,
                        allDay: data[i].isFullDay,
                        eventId: data[i].eventId,
                        repeatevent: data[i].repeatevent,
                        reminder: data[i].reminder
                    });
        
                var getMonth = data[i].start.replace(/\d\d\d\d-/, "").replace(/-.+/, "");
                var monthAsNumver = Number(getMonth);
                if (monthAsNumver === $scope.month) {
                    SingleMonthevents.push(data[i]);
                    multiMonthEvents.push(data[i]);
      
                }
            }

            $("#calendar").fullCalendar('addEventSource', data);
            var modalBackdrop = $(".modal-backdrop")
            if (modalBackdrop != null) {
                $(".modal-backdrop").remove()
                $scope.hideModal();
            }
        }).error(function (error) {
            console.log(error)
        });

    };
    $scope.changeView = function (view, element) {

        $scope.view = view;
        if (view.name == "agendaWeek") {
            var GetFirstMonth = view.title.replace(/.+\—/, '').replace(/\d\d\d\d/, '');
            var getYear = view.title.match(/\d\d\d\d/, '');
            if (GetFirstMonth.length > 4) {
                var GetSecondMonth = view.title.replace(/\—.+/, '');
                var concatDate = GetFirstMonth + " - " + GetSecondMonth + " " + getYear;
                view.title = concatDate;
            } else {
                var GetFirstDay = view.title.replace(/.+\—/, '').replace(/\d\d\d\d/, '');
                var GetSecondDay = view.title.replace(/\—.+/, '').replace(/\D+/, '');
                var GetMonth = view.title.replace(/\—.+/, '').replace(/\d+/, '');
                var concatDay = GetFirstDay + "-" + GetSecondDay;
                var concatDate = getYear + " " + GetMonth + " " + concatDay
                view.title = concatDate;
            }
        }
        var resetValue = $scope.viewIsActive;
        $scope.view = view;
        $scope.resetValue = resetValue;
        Calendardetails.getEvents(view, resetValue, GLrepeatevent);

        var monuth = moment(view.intervalStart._d).toObject();
        var monuthAsNumber = monuth.months + 1 + monuth.years;
        var viewMonth = moment(view.intervalStart._d).toObject().months + 1;
        var startDate = moment(view.intervalStart._d).toObject();
        var month = startDate.months + 1;
        $scope.month = month;

        //if (resetValue == false) {
        for (i = 0; i < $scope.monthsTrxArray.length; i++) {
            if ($scope.monthsTrxArray[i] == month) {
                return;
            }
        }
        $scope.trxEvent.month = month;
        $scope.setTrxEvents();
        //}

        $scope.monthsTrxArray.push(viewMonth);

        $scope.viewIsActive = false;
    };
    $scope.openNotificationsDialog = function () {
        var url = "";
        if ($scope.guid != null) {
            url = Domain +'calendar/removenotifications.php/?funcname=removeMultiEvent';
            data = {
                guid: $scope.guid
            }
        } else {
            url = Domain +'calendar/removenotifications.php/?funcname=removeSingleEvent';
            data = {
                title: $scope.eventSelectedTitle,
                start: $scope.eventSelectedStartDoBeDelete
            }
        }
        $http({
            method: 'POST',
            data: data,
            //DO NOT FORGET TO CHANGE THE URL!!!!!//
            url: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).success(function (respond) {
            var ale = $mdDialog.alert({})
                .title('Email alert canceled')
                .ok('OK')
                .parent(angular.element(document.querySelector('#event-header')));
            $mdDialog.show(ale).finally(function () {
                $scope.formData.selected = '';
                ale = undefined;
            });
            $scope.reminderNotifications = false;
        });
        for (i = 0; i < GllocalCalendarEvents.length; i++) {
            var eventId = GllocalCalendarEvents[i].eventId;
            if ($scope.eventId == eventId) {
                GllocalCalendarEvents[i].reminder = 0
                var index = GllocalCalendarEvents.indexOf(GllocalCalendarEvents[i])
                break;
            }
        }
        $scope.isNotificationRemove = true;
    };
    $('#calendar').fullCalendar({
        lang: 'he',
        height: 650,
        editable: false,
        displatEventTime: false,
        header: {
            left: 'month agendaWeek agendaDay',
            center: 'title',
            right: 'today next,prev'
        },
        columnFormat: {
            month: 'dddd'
        },
        titleFormat: {
            week: "MMMM D YYYY"
        },
        eventRender: $scope.eventRender,
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize,
        dayClick: $scope.alertEventOnClick,
        viewRender: $scope.changeView,
        eventAfterRender: function (event, element, view) {
            var fullHourChaker = moment(event.start._d).toObject()
            if (fullHourChaker.minutes == 0 && event._end != null) {
                var timeElem = element.find(".fc-time")
                timeElem.text(fullHourChaker.hours + ":" + "00")
            }
            //prevent the hours from display when the reminder is birthday and canter the title
            if (event._end == null && event.type !== "info") {
                var timeElem = element.find(".fc-time")
                timeElem.text("")
                element.css("text-align", "center");
            }
            //set the eventID and Guid to each reminder
            element.attr("repeatGuid", event.repeatevent)
            element.attr("eventId", event.eventId)
            if (event.username == "user1") {
                element.css('background', '#0f7a2a');
            } else if (event.username == "user2") {
                element.css('background', '#6bbc56');
            } else if (event.username == "user3") {
                element.css('background', '#068d9d');
            } else if (event.type == "info") {
                element.css('background', '#473c7f');
            } else {
                element.css('background', '-webkit-linear-gradient(0deg, rgba(0, 168, 222, 1) 0%, rgba(51, 51, 145, 1) 20%, rgba(233, 19, 136, 1) 40%, rgba(235, 45, 46, 1) 60%, rgba(253, 233, 43, 1) 80%, rgba(0, 158, 84, 1) 100%)');
            }
        }
    });
    var singleEvent = [];
    $scope.$on('eventAdded', function (event, data) {
        if (data.update == true) {
            $('#calendar').fullCalendar('removeEvents', function (event) {
                if (event.eventId == data.data.eventId) {
                    return true;
                }
            });
        }
        var value = data.data
        var ts = moment(value.start).toObject()
        var monthsS = ts.months + 1
        var y = ts.years;
        var m = ts.months;
        var d = ts.date;
        var hr = ts.hours;
        var mi = ts.minutes;
        var te = moment(value.end).toObject()
        var ye = te.years;
        var me = te.months;
        var de = te.date;
        var hre = te.hours;
        var mie = te.minutes;
        singleEvent.push({
            stick: true,
            title: value.title,
            description: value.description,
            start: new Date(y, m, d, hr, mi),
            end: new Date(ye, me, de, hre, mie),
            username: value.username,
            allDay: value.isFullDay,
            eventId: value.eventId,
            repeatevent: value.repeatevent
        });
        $("#calendar").fullCalendar("addEventSource", singleEvent);

        singleEvent = [];

    });

    var birthDayArray = [];
    var promise = new Promise(function (resolve, reject) {
        var birthDay = CustomersFactory.getBirthDays();
        if (resolve) {

            resolve(birthDay);
        } else {
            reject(Error("It broke"));
        }
    });
    promise.then(function (result) {
        var birthDayEvents = result.data;
        var d = new Date();
        var currentYear = d.getFullYear();

        console.log(birthDayEvents[i].birth_date);
        if (birthDayEvents[i].birth_date == null){return}

        for (i = 0; i < birthDayEvents.length; i++) {
            var fullName = birthDayEvents[i].first_name + " " + birthDayEvents[i].last_name;
            var date = birthDayEvents[i].birth_date.replace(/\d\d\d\d/, currentYear);

            birthDayArray.push({
                stick: true,
                title: fullName,
                start: new Date(date),
                end: new Date(date)
            });
        }
        $("#calendar").fullCalendar("addEventSource", birthDayArray);
    }, function (err) {
        console.log(err);
    });
    //$scope.setTrxEvents();

    function DialogController($scope, $mdDialog) {
        $scope.hide = function () {
            $mdDialog.hide();
        };
        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
            $mdDialog.hide(answer);
        };
    }
	}]);