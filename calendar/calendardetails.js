app.factory('Calendardetails', ['$http', '$rootScope', '$q','Domain', function ($http, $rootScope, $q,Domain) {

    var dateList = [];
    var monthEvent = [];
    var weekEvent = [];
    var dayEvent = [];
    var time = [];
    var data = [];
    var eventIdArray = [];
    var monthInLocalArray = [];
    var weekEventToRemove = [];
    var dayEventToRemove = [];
    var respondCounter = 0;
    var newMounthCounter = "firstTime";
    var milEndPrev;
    var milStartPrev;
    var date;
    var localRepeatEvent = "no";
    var getDate = new Date();
    var currentMonth = getDate.getMonth() + 1;
    var currentTimeInMiliSecond = getDate.getTime();
    var getEvents = function (view, resetValue, repeatevent) {
        if (repeatevent !== undefined) {
            localRepeatEvent = repeatevent;

        }
        respondCounter = 0;
        if (view !== undefined) {
            if (view.name == "agendaWeek") {
                document.getElementsByClassName("fc-next-button")[0].style.pointerEvents = 'none';
                document.getElementsByClassName("fc-prev-button")[0].style.pointerEvents = 'none';
                agendaWeek(view);
                return;
            } else if (view.name == "month") {

                month(view, resetValue);
                return;
            } else {
                document.getElementsByClassName("fc-next-button")[0].style.pointerEvents = 'none';
                document.getElementsByClassName("fc-prev-button")[0].style.pointerEvents = 'none';
                agendaDay(view);
                return;
            }
        }
    };

    var compareViewDateToCurrantDate = function (value, miliSecondStart, miliSecondEnd, view) {
        checkVeventId(value.eventId);
        var currentDate = new Date().getTime();
        var currentViewDate = new Date(view.end._d).getTime();
        var viewMonth = moment(view.intervalStart).format("MM");
        var viewTimeInMiliSecond = new Date(view.intervalStart._d).getTime();
        var tsMili = "";
        if (currentDate > currentViewDate || (viewMonth < currentMonth && currentTimeInMiliSecond > viewTimeInMiliSecond)) {
            tsMili = new Date(value.start).getTime();
            if (tsMili < milStartPrev) {
                putEventInCalendar(value, "month");
            }
        } else {
            tsMili = new Date(value.start).getTime();
            if (tsMili > milEndPrev || newMounthCounter == "firstTime") {
                putEventInCalendar(value, "month");
            }
        }
    };
    var putEventInCalendar = function (value, viewMode) {
        if (value.username == "TRX") {
            return;
        }
        var ts = moment(value.start).toObject();
        var monthsS = ts.months + 1;
        var y = ts.years;
        var m = ts.months;
        var d = ts.date;
        var hr = ts.hours;
        var mi = ts.minutes;
        var te = moment(value.end).toObject();
        var ye = te.years;
        var me = te.months;
        var de = te.date;
        var hre = te.hours;
        var mie = te.minutes;
        
        for (i = 0; i < localRepeatEvent.length; i++) {
            if (localRepeatEvent[i] == value.repeatevent) {
                return;
            }
        }
        if (viewMode == "month") {
            monthEvent.push({
                stick: true,
                title: value.title,
                description: value.description,
                start: new Date(y, m, d, hr, mi),
                end: new Date(ye, me, de, hre, mie),
                username: value.username,
                allDay: value.isFullDay,
                eventId: value.eventId,
                repeatevent: value.repeatevent,
                reminder: value.reminder
            });
            GllocalCalendarEvents.push({
                stick: true,
                title: value.title,
                description: value.description,
                start: new Date(y, m, d, hr, mi),
                end: new Date(ye, me, de, hre, mie),
                username: value.username,
                allDay: value.isFullDay,
                eventId: value.eventId,
                repeatevent: value.repeatevent,
                reminder: value.reminder
            });
        } else if (viewMode == "week") {
            weekEvent.push({
                stick: true,
                title: value.title,
                description: value.description,
                start: new Date(y, m, d, hr, mi),
                end: new Date(ye, me, de, hre, mie),
                username: value.username,
                allDay: value.isFullDay,
                eventId: value.eventId,
                repeatevent: value.repeatevent,
                reminder: value.reminder
            });
        } else {
            dayEvent.push({
                stick: true,
                title: value.title,
                description: value.description,
                start: new Date(y, m, d, hr, mi),
                end: new Date(ye, me, de, hre, mie),
                username: value.username,
                allDay: value.isFullDay,
                eventId: value.eventId,
                repeatevent: value.repeatevent,
                reminder: value.reminder
            });
        }
    };
    var month = function (view, resetValue) {
        var checkIfEventsInLocalArray;
        document.getElementsByClassName("fc-next-button")[0].style.pointerEvents = 'none';
        document.getElementsByClassName("fc-prev-button")[0].style.pointerEvents = 'none';
        var view = $('#calendar').fullCalendar('getView');
        var ds = new Date(view.start._d);
        var miliStart = ds.getTime();
        var de = new Date(view.end._d);
        var miliEnd = de.getTime();
        var mileArray = [{
            miliStart, miliEnd
			}];
        if (resetValue === true) {
            if (GllocalCalendarEvents.length > 0) {
                setTimeout(function () {
                    $("#calendar").fullCalendar("addEventSource", GllocalCalendarEvents);
                }, 1);
                document.getElementsByClassName("fc-next-button")[0].style.pointerEvents = 'auto';
                return;
            }
        }
        checkIfEventsInLocalArray = checkIfMounthIsAlreadyInArray(mileArray);
        if (checkIfEventsInLocalArray === true) {
            var addNumber = [];
            var addEvent = [];
            for (i = 0; i < GllocalCalendarEvents.length; i++) {
                for (j = 0; j < eventIdArray.length; j++) {
                    if (GllocalCalendarEvents[i].eventId == eventIdArray[j]) {
                        addNumber.push(GllocalCalendarEvents[i].eventId);
                    }
                }
            }
            var sorted_arr = addNumber.slice().sort();
            for (var z = 0; z < addNumber.length - 1; z++) {
                if (sorted_arr[z + 1] == sorted_arr[z]) {
                    addEvent.pop();
                } else {
                    addEvent.push(GllocalCalendarEvents[z]);
                }
            }
            var arr = Array.from(new Set(addEvent));
            arr.pop();
            // $("#calendar").fullCalendar("addEventSource", arr);
            document.getElementsByClassName("fc-next-button")[0].style.pointerEvents = 'auto';
            document.getElementsByClassName("fc-prev-button")[0].style.pointerEvents = 'auto';
            var miliSecondEnd = new Date(view.end._d).getTime();
            var miliSecondStart = new Date(view.start._d).getTime();
            milEndPrev = miliSecondEnd;
            milStartPrev = miliSecondStart;
        } else {
            var startDate = moment(view.start._d).format("YYYY-MM-DD");
            var endDate = moment(view.end._d).format("YYYY-MM-DD");
            data = {
                startDate: startDate,
                endDate: endDate
            };
            return $http({
                method: 'POST',
                data: data,
                //DO NOT FORGET TO CHANGE THE URL!!!!!//
                url: Domain +'calendar/calendar.php',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).success(function (data) {
                var index="";
                 var miliSecondEnd="";
                var miliSecondStart ="";
                if (respondCounter === 0) {
                    respondCounter++;
                    if (data.errors) {} else {
                         miliSecondEnd = new Date(view.end._d).getTime();
                         miliSecondStart = new Date(view.start._d).getTime();
                        angular.forEach(data, function (value) {
                            compareViewDateToCurrantDate(value, milStartPrev, milEndPrev, view);
                        });
                        newMounthCounter = "not_First_time";
                    }
                    if (weekEventToRemove.length > 0) {
                        var monthEventLength = monthEvent.length;
                        var weekEventToRemoveLength = weekEventToRemove.length;
                        var dayEventToRemoveLength = dayEventToRemove.length;
                        angular.forEach(monthEvent, function (event) {
                            angular.forEach(weekEventToRemove, function (eventId) {
                                if (monthEventLength == weekEventToRemoveLength) {
                                     index = monthEvent.indexOf(event);
                                    monthEvent.splice(index, 1);
                                } else {
                                    if (eventId == event.eventId) {
                                         index = monthEvent.indexOf(event);
                                        monthEvent.splice(index, 1);
                                    }
                                }
                            });
                        });
                    }
                    if (dayEventToRemove.length > 0) {
                        angular.forEach(monthEvent, function (event) {
                            angular.forEach(dayEventToRemove, function (eventId) {
                                if (monthEventLength == dayEventToRemoveLength) {
                                    index = monthEvent.indexOf(event);
                                    monthEvent.splice(index, 1);
                                } else {
                                    if (eventId == event.eventId) {
                                        index = monthEvent.indexOf(event);
                                        monthEvent.splice(index, 1);
                                    }
                                }
                            });
                        });
                    }
                    $("#calendar").fullCalendar("addEventSource", monthEvent);
                    monthEvent = [];
                    milEndPrev = miliSecondEnd;
                    milStartPrev = miliSecondStart;
                }
                var fcNextButton = document.getElementsByClassName("fc-next-button");
                if (fcNextButton !== undefined) {
                    document.getElementsByClassName("fc-next-button")[0].style.pointerEvents = 'auto';
                    document.getElementsByClassName("fc-prev-button")[0].style.pointerEvents = 'auto';
                }
                weekEventToRemove = [];
                dayEventToRemove = [];
            }).error(function (error) {});
        }
    };
    var agendaDay = function (view) {
        var startDate = moment(view.start._d).format("YYYY-MM-DD");
        var endDate = moment(view.end._d).format("YYYY-MM-DD");
        data = {
            startDate: startDate,
            endDate: endDate
        };
        return $http({
            method: 'POST',
            data: data,
            //DO NOT FORGET TO CHANGE THE URL!!!!!//
            url: Domain +'calendar/calendar.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).success(function (data) {
            if (respondCounter === 0) {
                respondCounter++;
                if (data.errors) {} else {
                    document.getElementsByClassName("fc-next-button")[0].style.pointerEvents = 'auto';
                    document.getElementsByClassName("fc-prev-button")[0].style.pointerEvents = 'auto';
                    for (i = 0; i < eventIdArray.length; i++) {
                        for (j = 0; j < data.length; j++) {
                            if (eventIdArray[i] == data[j].eventId) {
                                return;
                            }
                        }
                    }
                    angular.forEach(data, function (value) {
                        checkVeventId(value.eventId);
                        var tsMiliWeek = new Date(value.start).getTime();
                        var currentDate = new Date().getTime();
                        var currentViewDate = new Date(view.end._d).getTime();
                        if (currentViewDate < currentDate) {
                        dayEventToRemove.push(value.eventId);
                        } else {
                            dayEventToRemove = [];
                        }
                        putEventInCalendar(value, "day");
                       });
                }
                $("#calendar").fullCalendar("addEventSource", dayEvent);
                dayEvent = [];
            }
        }).error(function (error) {});
    };
    var agendaWeek = function (view) {
        var startDate = moment(view.start._d).format("YYYY-MM-DD");
        var endDate = moment(view.end._d).format("YYYY-MM-DD");
        data = {
            startDate: startDate,
            endDate: endDate
        };
        return $http({
            method: 'POST',
            data: data,
            //DO NOT FORGET TO CHANGE THE URL!!!!!//
            url: Domain +'calendar/calendar.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).success(function (data) {

            document.getElementsByClassName("fc-next-button")[0].style.pointerEvents = 'auto';
            document.getElementsByClassName("fc-prev-button")[0].style.pointerEvents = 'auto';
            if (respondCounter === 0) {
                 var miliEnd="";
                respondCounter++;
                if (data.errors) {} else {
                    var endDayOfView = view.end._d;
                     miliEnd = new Date(endDayOfView).getTime();
                    document.getElementsByClassName("fc-next-button")[0].style.pointerEvents = 'auto';
                    for (i = 0; i < eventIdArray.length; i++) {
                        for (j = 0; j < data.length; j++) {
                            if (eventIdArray[i] == data[j].eventId) {
                                return;
                            }
                        }
                    }
                    angular.forEach(data, function (value) {
                        checkVeventId(value.eventId);
                        var currentDate = new Date().getTime();
                        var currentViewDate = new Date(view.end._d).getTime();
                        if (currentViewDate < currentDate) {
                            weekEventToRemove.push(value.eventId);
                        } else {
                            weekEventToRemove = [];
                        }
                        var tsMiliWeek = new Date(value.start).getTime();
                        putEventInCalendar(value, "week");
                     });
                }
                $("#calendar").fullCalendar("addEventSource", weekEvent);
                weekEvent = [];
                milEndPrev = miliEnd;
            }
        }).error(function (error) {});
    };
    var checkVeventId = function (newValue) {
        eventIdArray.push(newValue);
        return eventIdArray;
    };
    var checkIfMounthIsAlreadyInArray = function (mileArray) {

        if (monthInLocalArray.length !== 0) {
            for (i = 0; i < monthInLocalArray.length; i++) {
                for (j = 0; j < mileArray.length; j++) {
                    if (monthInLocalArray[i][0].miliStart == mileArray[j].miliStart) {
                        return true;
                    }
                }
            }
        }
        if (monthInLocalArray.length === 0) {
            monthInLocalArray.push(mileArray);
            return "firstTime";
        }
        monthInLocalArray.push(mileArray);
        return false;
    };
    var addDate = function (date) {
        dateList = [];
        dateList.push(date);
    };
    var getDate = function () {
        return dateList;
    };
    var getbreakStartTime = function () {
        return time;
    };
    var breakStartTime = function (startTime, endTime) {
        var endHour;
        var startHour;
        var startMinutes;
        var endMinutes;
        time = [];
        startHour = startTime.replace(/:.+/, "");
            startMinutes = startTime.replace(/.+:/, "");
        endHour = endTime.replace(/:.+/, "");
            endMinutes = endTime.replace(/.+:/, "");
        time.push(startHour, startMinutes, endHour, endMinutes);
    };
    return {
        addDate: addDate,
        getDate: getDate,
        getEvents: getEvents,
        breakStartTime: breakStartTime,
        getbreakStartTime: getbreakStartTime
    };

}]);