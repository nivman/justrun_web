app.factory("CalendarFactory", ['$http', '$mdDialog', 'toaster', '$filter', '$state', '$stateParams', '$rootScope', '$q','Domain', function ($http, $mdDialog, toaster, $filter, $state, $stateParams, $rootScope, $q,Domain) {
	var self = {
		shared_scope: {},
		'formdata': {},
		'fullEndDate': {},
		'mounthArrayStart': {},
		'mounthArrayEnd': {},
		'approveMode': {},
		'clickedeventguid': "",
		'repeatform': function () {
			var entity = angular.copy(self.formdata);
			var repeatEventEntity = angular.copy(self.formRepeatEvent);
			self.shared_scope.show();
			if (!repeatEventEntity) {
				self.checkFromFill();
				return;
			}
			var currentTime = new Date();
			var currentYear = currentTime.getFullYear();
			var currentMonth = currentTime.getMonth() + 1;
			guid = self.guid();
			allday = entity.allday;
			title = entity.eventtitle;
			description = entity.eventdescription;
			username = entity.username;
			formatStartHour = moment(entity.eventstarthour).format("HH:mm:00");
			formatEndHour = moment(entity.eventendhour).format("HH:mm:00");
			selectedRepeatDays = repeatEventEntity.selected;
			repeatsEvery = repeatEventEntity.repeatsEvery;
			fullStartDate = moment(entity.eventstartdate).format("YYYY-MM-DD");
			yearStart = moment(entity.eventstartdate).toObject().years;
			yearEnd = moment(repeatEventEntity.endEventRepeat).toObject().years;
			dayEnd = moment(repeatEventEntity.endEventRepeat).toObject().date;
			mailtoreminder = entity.targetmail;
			reminder = entity.selecetreminder;
			fullEndDate = moment(repeatEventEntity.endEventRepeat).format("YYYY-MM-DD");
			dayToRepeat = [];
			var countGeneralRespond = 0;
			var countKey = 0;
			if (allday === undefined || allday === false) {
				allday = false;
			} else {
				formatStartHour = '00:01';
				formatEndHour = '23:59';
				allday = true;
			}
			eventId = entity.eventId;
			if (eventId === undefined) {
				eventId = "";
			}
			if (repeatEventEntity.repeats == 1) {
				if (repeatsEvery === undefined || repeatEventEntity.endEventRepeat === undefined) {
					self.checkFromFill();
					return;
				}
				repeatDate = {
					guid: guid,
					repeatsEvery: repeatsEvery,
					username: username,
					title: title,
					description: description,
					formatStartHour: formatStartHour,
					formatEndHour: formatEndHour,
					start: fullStartDate,
					end: fullEndDate,
					yearStart: yearStart,
					yearEnd: yearEnd,
					dayToRepeat: dayToRepeat,
					stick: true,
					allday: allday,
					eventId: eventId,
					reminder: reminder,
					mailtoreminder: mailtoreminder
				};
				$http({
					method: 'POST',
					url: Domain +'calendar/checkoverlapping.php/?funcname=checkforoverlappingdays',
					data: repeatDate,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					}
				}).success(function (response) {
					var overLappingDetails = {};
					if (response !== "") {
						$("#duplication-panel").show();
						self.createPanelForDuplictionList();
						self.fadeEffect();
						var array = response.split(',');
						if (array.length > 6) {
							var i, j, temparray, chunk = 5;
							for (i = 0, j = array.length; i < j; i += chunk) {
								temparray = array.slice(i, i + chunk);
								if (temparray.length != 1) {
									overLappingDetails = self.createOverLappingDetailsArr(temparray);
									self.createOverLappingPanel(overLappingDetails);
								}
							}
						} else {
							overLappingDetails = self.createOverLappingDetailsArr(array);
							self.createOverLappingPanel(overLappingDetails);
						}
					} else {
						self.addMultipleDaysEvents("day");
						document.getElementById("check_overlaping").style.display = "none";
					}
					countGeneralRespond++;
					self.approveMode = "insert_day";
				}).error(function (error) {

				});
			} else if (repeatEventEntity.repeats == 2) {
				if (selectedRepeatDays === undefined || repeatEventEntity.endEventRepeat === undefined) {
					self.checkFromFill();
					return;
				}
				var respondCounter = 0;
				countGeneralRespond = 0;
				countKey = 0;
				for (var key in selectedRepeatDays) {
					if (selectedRepeatDays[key] === true) {
						key = [key];
						countKey++;
						repeatDate = {
							formatStartHour: formatStartHour,
							formatEndHour: formatEndHour,
							start: fullStartDate,
							end: fullEndDate,
							yearStart: yearStart,
							yearEnd: yearEnd,
							dayToRepeat: key,
						};
						$http({
							method: 'POST',
							//DO NOT FORGET TO CHANGE THE URL!!!!!//
							url: Domain +'calendar/checkoverlapping.php/?funcname=checkforoverlappingweeks',
							data: repeatDate,
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
							}
						}).success(function (response) {
							if (response !== "") {
								$("#duplication-panel").show();
								if (respondCounter === 0) {
									self.createPanelForDuplictionList();
									self.fadeEffect();
								}
								respondCounter++;
								var multi = "multi";
								var schedule = "repeatupdate";
								var insertMode = "insert";
								self.dispatchInsertAlertsUpdate(response, insertMode, multi, schedule);
							} else {
								if (countGeneralRespond + 1 == countKey && respondCounter === 0) {
									self.addMultipleDaysEvents("week");
									document.getElementById("check_overlaping").style.display = "none";
								}
							}
							countGeneralRespond++;
							self.approveMode = "insert_week";
						}).error(function (error) {});
					} else {}
				}
			} else if (repeatEventEntity.repeats == 3) {
				if (repeatEventEntity.repeatsYearEvery === undefined || repeatsEvery === undefined) {
					self.checkFromFill();
					return;
				}
				countGeneralRespond = 0;
				countKey = 0;
				var respondConter = 0;
				mounthArrayStart = [];
				mounthArrayEnd = [];
				var addZeroTomounth;
				var addZeroToDay;
				var remainMounthToTheEndOfTheCurrentYear = 12 - currentMonth;
				var sumTheMounthOfTheTotelYears = repeatEventEntity.repeatsYearEvery * 12;
				if (repeatsEvery < 10) {
					addZeroToDay = "0" + repeatsEvery;
				} else {
					addZeroToDay = repeatsEvery;
				}
				if (currentMonth < 10) {
					addZeroTomounth = "0" + currentMonth;
				} else {
					addZeroTomounth = currentMonth;
				}
				mounthArrayStart = [currentYear + "-" + addZeroTomounth + "-" + addZeroToDay + " " + formatStartHour];
				mounthArrayEnd = [currentYear + "-" + addZeroTomounth + "-" + addZeroToDay + " " + formatEndHour];
				var j = 1;
				for (j = 0; j < repeatEventEntity.repeatsYearEvery; j++) {
					var year = currentYear + j;
					if (currentYear == year) {
						for (i = 1; i < remainMounthToTheEndOfTheCurrentYear + 1; i++) {
							if (i < remainMounthToTheEndOfTheCurrentYear + 1) {
								var mounth = currentMonth + i;
								if (mounth < 10) {
									addZeroTomounth = "0" + mounth;
								} else {
									addZeroTomounth = mounth;
								}
								mounthArrayStart.push(currentYear + "-" + addZeroTomounth + "-" + addZeroToDay + " " + formatStartHour);
								mounthArrayEnd.push(currentYear + "-" + addZeroTomounth + "-" + addZeroToDay + " " + formatEndHour);
							}
						}
					} else {
						for (n = 1; n < sumTheMounthOfTheTotelYears; n++) {
							var month = n;
							if (n < 13) {
								if (n < 10) {
									month = "0" + n;
								} else {
									month = n;
								}
								mounthArrayStart.push(year + "-" + month + "-" + addZeroToDay + " " + formatStartHour);
								mounthArrayEnd.push(year + "-" + month + "-" + addZeroToDay + " " + formatEndHour);
							} else {
								continue;
							}
						}
					}
				}
				self.mounthArrayStart = mounthArrayStart;
				for (z = 0; z < mounthArrayStart.length; z++) {
					repeatDate = {
						formatStartHour: formatStartHour,
						formatEndHour: formatEndHour,
						start: mounthArrayStart[z],
						end: mounthArrayEnd[z],
						yearStart: yearStart,
						yearEnd: yearEnd,
						dayToRepeat: 0,
					};
					$http({
						method: 'POST',
						//DO NOT FORGET TO CHANGE THE URL!!!!!//
						url: Domain +'calendar/checkoverlapping.php/?funcname=checkforoverlappingmonth',
						data: repeatDate,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
						}
					}).success(function (response) {
						if (response !== "") {
							$("#duplication-panel").show();
							if (respondConter === 0) {
								self.createPanelForDuplictionList();
								self.fadeEffect();
							}
							respondConter++;
							var multi = "multi";
							var schedule = "repeatupdate";
							var insertMode = "insert";
							self.dispatchInsertAlertsUpdate(response, insertMode, multi, schedule);
						} else {
							if (countGeneralRespond + 1 == mounthArrayStart.length && respondConter === 0) {
								self.addMultipleDaysEvents("mounth");
								document.getElementById("check_overlaping").style.display = "none";
							}
						}
						countGeneralRespond++;
						self.approveMode = "insert_mounth";
					}).error(function (error) {});
				}
			} else {
				if (repeatEventEntity.repeatsYearEvery === undefined || repeatsEvery === undefined || repeatEventEntity.repeatsAtMounth === undefined) {
					self.checkFromFill();
					return;
				}
				countGeneralRespond = 0;
				var respondYearConter = 0;
				eventStartDates = [];
				eventEndDates = [];
				var addZero = "";
				if (repeatsEvery < 10) {
					addZero = "0" + repeatsEvery;
				} else {
					addZero = repeatsEvery;
				}
				for (n = 0; n < repeatEventEntity.repeatsYearEvery; n++) {
					var repeatsYear = currentYear + n;
					eventStartDates.push(repeatsYear + "-" + repeatEventEntity.repeatsAtMounth + "-" + addZero + " " + formatStartHour);
					eventEndDates.push(repeatsYear + "-" + repeatEventEntity.repeatsAtMounth + "-" + addZero + " " + formatEndHour);
				}
				self.mounthArrayStart = eventEndDates;
				for (z = 0; z < eventStartDates.length; z++) {
					repeatDate = {
						formatStartHour: formatStartHour,
						formatEndHour: formatEndHour,
						start: eventStartDates[z],
						end: eventEndDates[z],
						yearStart: yearStart,
						yearEnd: yearEnd,
						dayToRepeat: "",
					};
					$http({
						method: 'POST',
						//DO NOT FORGET TO CHANGE THE URL!!!!!//
						url: Domain +'calendar/checkoverlapping.php/?funcname=checkforoverlappingyear',
						data: repeatDate,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
						}
					}).success(function (response) {
						if (response !== "") {
							$("#duplication-panel").show();

							if (respondYearConter === 0) {
								self.createPanelForDuplictionList();
								self.fadeEffect();
							}
							respondYearConter++;
							var multi = "multi";
							var schedule = "repeatupdate";
							var insertMode = "insert";
							self.dispatchInsertAlertsUpdate(response, insertMode, multi, schedule);
						} else {
							if (countGeneralRespond + 1 == eventStartDates.length && respondYearConter === 0) {
								self.addMultipleDaysEvents("year");
								document.getElementById("check_overlaping").style.display = "none";
							}
						}
						countGeneralRespond++;
						self.approveMode = "insert_year";

					}).error(function (error) {});
				}
			}
			entity.guid = null;
		},
		'createOverLappingDetailsArr': function (temparray) {
			var title = temparray[4].replace(/found.+/, "");
			overLappingDetails = {
				'title': title,
				'start': temparray[1],
				'end': temparray[2]
			};
			return overLappingDetails;
		},
		'createOverLappingPanel': function (overLappingDetails) {
			var formatStartTime = moment(overLappingDetails.start).format("DD-MM-YYYY , HH:mm");
			var formatEndTime = moment(overLappingDetails.end).format("DD-MM-YYYY , HH:mm");
			var panelHtml = '<tr>';
			panelHtml += "<td>" + overLappingDetails.title + "</td>";
			panelHtml += "<td>" + formatStartTime + "</td>";
			panelHtml += "<td>" + formatEndTime + "</td>";
			panelHtml += '</tr>';
			$("#massage-table").append(panelHtml);
		},
		'fadeEffect': function () {
			var fadeEffect = '<md-backdrop id="fade-background" class="md-dialog-backdrop md-opaque ng-scope" aria-hidden="true"></md-backdrop>';
			$("#modal-content-repeat").append(fadeEffect);
			$("#fade-background").show();
		},
		'addMultipleDaysEvents': function (schedule) {

			if (schedule == 'day' || schedule == 'week' || schedule == 'mounth' || schedule == 'year') {
				if (schedule == 'day') {
					$http({
						method: 'POST',
						//DO NOT FORGET TO CHANGE THE URL!!!!!//
						url: Domain +'calendar/repeateventdaily.php',
						data: repeatDate,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
						}
					}).success(function (response) {
						self.reload();
					}).error(function (error) {});
				} else if (schedule == 'week') {
					for (var key in selectedRepeatDays) {
						if (selectedRepeatDays[key] === true) {
							key = [key];
						}
						if (allday === true) {
							formatStartHour = "00:01:00";
							formatEndHour = "23:59:00";
						}

						repeatDate = {
							guid: guid,
							repeatsEvery: "",
							username: username,
							title: title,
							description: description,
							formatStartHour: formatStartHour,
							formatEndHour: formatEndHour,
							start: fullStartDate,
							end: fullEndDate,
							yearStart: yearStart,
							yearEnd: yearEnd,
							dayToRepeat: key,
							stick: true,
							allday: allday,
							reminder: reminder,
							mailtoreminder: mailtoreminder,
							eventId: eventId
						};
						$http({
							method: 'POST',
							url: Domain +'calendar/repeateventsweekly.php',
							data: repeatDate,
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
							}
						}).success(function (response) {}).error(function (error) {
							console.log(error);
						});
					}
				} else if (schedule == 'mounth' || schedule == 'year') {
					for (z = 0; z < self.mounthArrayStart.length; z++) {
						repeatDate = {
							guid: guid,
							repeatsEvery: repeatsEvery,
							username: username,
							title: title,
							description: description,
							formatStartHour: formatStartHour,
							formatEndHour: formatEndHour,
							start: self.mounthArrayStart[z],
							end: self.mounthArrayEnd[z],
							yearStart: yearStart,
							yearEnd: yearEnd,
							dayToRepeat: 0,
							stick: true,
							allday: allday,
							reminder: reminder,
							mailtoreminder: mailtoreminder,
							eventId: eventId
						};
						if (schedule == 'mounth') {
							$http({
								method: 'POST',
								//DO NOT FORGET TO CHANGE THE URL!!!!!//
								url: Domain +'calendar/repeateventsmounthly.php',
								data: repeatDate,
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
								}
							}).success(function (response) {}).error(function (error) {
								console.log(error);
							});
						} else {
							$http({
								method: 'POST',
								//DO NOT FORGET TO CHANGE THE URL!!!!!//
								url: Domain +'calendar/repeateventsyearly.php',
								data: repeatDate,
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
								}
							}).success(function (response) {}).error(function (error) {});
						}
					}
				}

			} else {
				//this is the update multi events
				for (i = 0; i < schedule.length; i++) {
					repeatDate = {
						repeatevent: schedule[i].repeatevent,
						username: schedule[i].username,
						title: schedule[i].title,
						description: schedule[i].description,
						start: schedule[i].start,
						end: schedule[i].end,
						stick: true,
						eventId: schedule[i].eventId,
						reminder: schedule[i].reminder,
						mailtoreminder: schedule[i].mailtoreminder,
						allday: "allday"
					};
					$http({
						method: 'POST',
						//DO NOT FORGET TO CHANGE THE URL!!!!!//
						url: Domain +'calendar/createnewevent.php/?funcname=updaterepeatedevent',
						data: repeatDate,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
						}
					}).success(function (response) {}).error(function (error) {});
				}
			}
			setTimeout(function () {
				if (typeof schedule === "string") {
					self.shared_scope.renderCalendar(guid);
				} else {
					location.reload();
				}
				self.shared_scope.hide();
			}, 2000);
		},
		'popUpDetailsOverLapping': function (insertMode, mode, schedule, overLappingDetails, title, trxData) {

			self.shared_scope.hide();
			var checkOverlapingRepeat = document.getElementById("check_overlaping_repeat");
			if (checkOverlapingRepeat !== null) {
				self.shared_scope.hide();
			}
			$(".input-group-btn").css("z-index", "0");
			var formatStartTime = moment(overLappingDetails.start).format("DD-MM-YYYY , HH:mm");
			var formatEndTime = moment(overLappingDetails.end).format("DD-MM-YYYY , HH:mm");
			var details = "<p>" + "<b>" + ' Reminder Title: ' + "</b>" + overLappingDetails.title + "<br>" + "<b>" + " Start time :" + "</b>" + formatStartTime + "<br>" + "<b>" + "End time  : " + "</b>" + formatEndTime + "</p>";
			var modesStatus = [insertMode, mode, schedule];
			var referToContainer = '';
			if (mode == 'single') {
				referToContainer = '#calender-main-contant';
			} else {
				referToContainer = '#modal-content-repeat';
			}
			if (insertMode != "TRX") {

				document.getElementById("check_overlaping").style.display = "none";
			}
			var confirm = $mdDialog.confirm(insertMode, mode, title)
				.parent(angular.element(document.querySelector(referToContainer)))
				.title(title)
				.htmlContent(details + '<br>Click OK to enter a reminder or cancel to change the hours')
				.ariaLabel(modesStatus)
				.ok('Ok')
				.cancel('Cancel');
			$mdDialog.show(confirm).then(function (modesStatus) {
				$(".input-group-btn").css("z-index", "222");
				var isUpdate = confirm._options.ariaLabel[0];
				var isSingle = confirm._options.ariaLabel[1];
				if (isSingle == 'single') {
					if (insertMode != "TRX") {
						self.addnewevent(isUpdate);
					} else {
						self.addnewevent(isUpdate, "", trxData)
					}
				} else {
					var schedule = confirm._options.ariaLabel[2];
					self.addMultipleDaysEvents(schedule);
				}
			}, function () {
				$(".input-group-btn").css("z-index", "222");
				console.log('Record not added!');
			});
		},
		'reload': function () {
			$rootScope.$broadcast('eventFired', {});
		},
		'dispatchAlerts': function (response, insertMode, multi, schedule, trxData) {
			var title = "";
			var array = response.split(',');
			overLappingDetails = self.createOverLappingDetailsArr(array);
			if (array[0] == 'found_over_lapping_hours_at_start') {
				
				title = 'Found overlapping start time';
				if (insertMode != "update") {
					self.popUpDetailsOverLapping(insertMode, multi, schedule, overLappingDetails, title, trxData);
				} else {
					if (array[6] == self.clickedeventguid) {} else {
						self.popUpDetailsOverLapping(insertMode, multi, schedule, overLappingDetails, title, trxData);
					}
				}
			} else if (array[0] == 'found_over_lapping_hours_at_end') {
				title = 'An overlapping end time was found';
				if (insertMode != "update") {
					self.popUpDetailsOverLapping(insertMode, multi, schedule, overLappingDetails, title, trxData);
				} else {
					if (array[6] == self.clickedeventguid) {} else {
						self.popUpDetailsOverLapping(insertMode, multi, schedule, overLappingDetails, title, trxData);
					}
				}
			} else if (array[0] == 'found_over_lapping_hours_at_middle') {
				title = 'There is an overlap between events times';
				if (insertMode != "update") {
					self.popUpDetailsOverLapping(insertMode, multi, schedule, overLappingDetails, title, trxData);
				} else {
					if (array[6] == self.clickedeventguid) {} else {
						self.popUpDetailsOverLapping(insertMode, multi, schedule, overLappingDetails, title, trxData);
					}
				}
			} else {}
		},
		'dispatchInsertAlertsUpdate': function (response, insertMode, multi, schedule) {
			document.getElementById("check_overlaping").style.display = "none";
			var array = response.split(',');
			var overLapping = {};
			if (array.length > 6) {
				var i, j, temparray, chunk = 5;
				for (i = 0, j = array.length; i < j; i += chunk) {
					temparray = array.slice(i, i + chunk);
					if (temparray.length != 1) {
						overLapping = self.createOverLappingDetailsArr(temparray);
						self.createOverLappingPanel(overLapping);
					}
				}
			} else {
				if (array.length == 1) {
					return;
				}
				overLapping = self.createOverLappingDetailsArr(array);
				self.createOverLappingPanel(overLapping);
			}
		},
		'dispatchAlertsUpdate': function (response, insertMode, multi, schedule) {
			if (response === undefined) {
				return;
			}
			document.getElementById("check_overlaping").style.display = "none";
			var array = response.split(',');
			if (array.length > 6) {
				var i, j, temparray, chunk = 5;
				for (i = 0, j = array.length; i < j; i += chunk) {
					temparray = array.slice(i, i + chunk);
					if (temparray.length != 1) {
						overLappingDetails = self.createOverLappingDetailsArr(temparray);
						self.createOverLappingPanel(overLappingDetails);
					}
				}
			} else {
				overLappingDetails = self.createOverLappingDetailsArr(array);
				self.createOverLappingPanel(overLappingDetails);
			}
		},
		'guid': function () {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16)
					.substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
				s4() + '-' + s4() + s4() + s4();
		},
		'submit': function () {
			var title = "";
			var entity = angular.copy(self.formdata);
			document.getElementById("check_overlaping").style.display = "block";
			var allday = entity.allday;
			if (entity.username === undefined || entity.username === "") {
				title = 'No user name entered';
				self.massageDialogContent(title);
				return;
			} else if (entity.eventstarthour > entity.eventendhour) {
				title = 'Start time is greater than end time';
				self.massageDialogContent(title);
				return;
			} else if ((entity.eventstarthour === undefined || entity.eventendhour === undefined || entity.eventstarthour === "" || entity.eventendhour === "") && (allday === false || allday === undefined)) {
				title = 'Start time or end time has not been entered';
				self.massageDialogContent(title);

				return;
			} else if (String(entity.eventstarthour) == String(entity.eventendhour) && (allday === false || allday === undefined) && String(entity.eventstartdate) == String(entity.eventenddate)) {
				title = 'Start time and end time are the same';
				self.massageDialogContent(title);
				return;
			} else if (String(entity.reminder) == "true" && String(entity.selecetreminder) === "") {
				title = 'No time to send a reminder';
				self.massageDialogContent(title);
				return;
			}
			var eventstarthour;
			var eventendhour;
			if (allday === undefined || allday === false) {
				eventstarthour = moment(entity.eventstarthour).format().replace(/.+T/, "").replace(/:\d+\+.+/, "");
				eventendhour = moment(entity.eventendhour).format().replace(/.+T/, "").replace(/:\d+\+.+/, "");
				allday = false;
			} else {
				eventstarthour = '00:01';
				eventendhour = '23:59';
				allday = true;
			}
			var eventstartdate = moment(entity.eventstartdate).format().replace(/T.+/, "");
			var concatTimeDateStart = eventstartdate + " " + eventstarthour;
			var eventenddate = moment(entity.eventenddate).format().replace(/T.+/, "");
			var concatTimeDateEnd = eventenddate + " " + eventendhour;
			if (entity.eventdescription === undefined) {
				entity.eventdescription = "Event description not specified";
			}
			var eventId = entity.eventId;
			var insertMode = entity.insertMode;
			if (eventId === undefined) {
				eventId = "";
			}
			var reminder = entity.selecetreminder;
			if (reminder === undefined) {
				reminder = 0;
			}
			var guid = entity.guid;
			if (guid === undefined || guid === null) {
				guid = "";
			}
			if (self.clickedeventguid === "") {
				self.clickedeventguid = guid;
			} else {
				self.clickedeventguid = "";
			}
			var mailtoreminder = entity.targetmail;
			if (mailtoreminder === undefined) {
				mailtoreminder = "";
			}
			data = {
				title: entity.eventtitle,
				description: entity.eventdescription,
				start: concatTimeDateStart,
				end: concatTimeDateEnd,
				username: entity.username.name,
				allday: allday,
				stick: true,
				eventId: eventId,
				reminder: reminder,
				repeatevent: guid,
				mailtoreminder: mailtoreminder
			};
			//guid check if the update event is multi or single
			if (self.clickedeventguid === "") {
				self.checkforoverlappinghours(data, insertMode);
			} else {
				self.checkforrepeatedoverlapping(guid, eventId, insertMode, eventstartdate);
			}
			entity.guid = "";
		},
		'massageDialogContent': function (title) {
			document.getElementById("check_overlaping").style.display = "none";
			$mdDialog.show(
				$mdDialog.alert()
				.parent(angular.element(document.querySelector('#calender-main-contant')))
				.clickOutsideToClose(true)
				.title(title)
				.ariaLabel('Alert Dialog Demo')
				.ok('Got it!')

			);
		},
		'checkforrepeatedoverlapping': function (guid, eventId, insertMode, eventstartdate) {
			document.getElementById("check_overlaping").style.display = "none";
			$mdDialog.show({
					templateUrl: './calendar/calendarnewevent/updatedialog.html',
					parent: angular.element(document.querySelector('#dialogContainer')),
					controller: DialogController,
					clickOutsideToClose: true,
					locals: {
						dataToPass: eventstartdate
					}
				})
				.then(function (answer) {
					var dataR = {
						repeatevent: guid
					};
					$http({
						method: 'POST',
						//DO NOT FORGET TO CHANGE THE URL!!!!!//
						url: Domain +'calendar/getEventsByGuid.php',
						data: dataR,
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
						}
					}).success(function (resoond) {
						//respondCounter is count the time that there overlapping event 
						var respondCounter = 0;
						//"var countEventWithGuid " and "var countrespondAnswerWithNoResualt" dealing with the case that there is no overlaping if they equel it mean that there is no overlapiing
						var countEventWithGuid = 0;
						var countrespondAnswerWithNoResualt = 0;
						var collectionOfRepeatedEvent = [];
						document.getElementById("check_overlaping").style.display = "block";
						self.approveMode = "update";
						self.createPanelForDuplictionList();
						var currentDateToStartCheck = data.start;
						var currentDateMili = moment(currentDateToStartCheck).valueOf();
						if (answer == 'multi') {
							var hoursOnly = formatRepeatedDate(data.start, data.end);
							for (i = 0; i < resoond.length; i++) {
								var startFromDate = resoond[i].start;
								var expires = moment(startFromDate).valueOf();
								if (resoond[i].repeatevent == guid && (currentDateMili <= expires || resoond[i].eventId == eventId)) {
									countEventWithGuid++;
									var newData = setNewTimeInrepeatEvents(resoond[i].start, resoond[i].end, hoursOnly);
									data = {
										title: data.title,
										description: data.description,
										start: newData.concatTimeDateStart,
										end: newData.concatTimeDateEnd,
										username: data.username,
										allday: "allday",
										stick: true,
										eventId: resoond[i].eventId,
										reminder: data.reminder,
										repeatevent: guid,
										mailtoreminder: data.mailtoreminder
									};
									collectionOfRepeatedEvent.push(data);
									$http({
										method: 'POST',
										//DO NOT FORGET TO CHANGE THE URL!!!!!//
										url: Domain +'calendar/createnewevent.php/?funcname=checkforoverlappinghours',
										data: data,
										headers: {
											'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
										}
									}).success(function (response) {
										if (response !== "") {
											$("#duplication-panel").show();
											if (respondCounter === 0) {
												self.fadeEffect();
											}
											respondCounter++;
											var multi = "multi";
											var schedule = "repeatupdate";
											self.dispatchAlertsUpdate(response, insertMode, multi, schedule);
										} else {
											if (countEventWithGuid == countrespondAnswerWithNoResualt + 1) {
												self.addMultipleDaysEvents(collectionOfRepeatedEvent);
												document.getElementById("check_overlaping").style.display = "none";
											}
											countrespondAnswerWithNoResualt++;
										}
									}).error(function (error) {});
								}
							}
						} else if (answer == 'single') {
							self.checkforoverlappinghours(data, insertMode);
						} else if (answer == 'cencel') {
							self.clickedeventguid = "";
							document.getElementById("check_overlaping").style.display = "none";
						}
					}).error(function (error) {});
				}, function (answer) {});
			return;
		},
		'checkforoverlappinghours': function (data, insertMode) {
			var trxData = "";
			$http({
				method: 'POST',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: Domain +'calendar/createnewevent.php/?funcname=checkforoverlappinghours',
				data: data,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (response) {
				console.log(response)

				if (response === "" && self.clickedeventguid === null) {
					self.addnewevent(insertMode, guid);
					document.getElementById("check_overlaping").style.display = "none";
				} else if (response !== "") {
					var single = "single";
					var schedule = 'singleEvent';
					if (insertMode != "TRX") {
						self.dispatchAlerts(response, insertMode, single, schedule, trxData);
					} else {
						trxData = data;
						self.dispatchAlerts(response, insertMode, single, schedule, trxData);
					}
				} else {
					if (insertMode != "TRX") {
						self.addnewevent(insertMode, guid, trxData);
					} else {
						trxData = data;
						self.addnewevent(insertMode, guid, trxData);
					}
				}

			}).error(function (error) {});
			guid = "";
		},
		'addnewevent': function (insertMode, guid, trxData) {
			var url;
			if (insertMode == "TRX") {
				data = trxData;
			}
			if (insertMode != "update") {
				url = Domain +'calendar/createnewevent.php/?funcname=setnewevent';
			} else {
				url = Domain +'calendar/createnewevent.php/?funcname=updateevent';
			}

			$http({
				method: 'POST',
				//DO NOT FORGET TO CHANGE THE URL!!!!!//
				url: url,
				data: data,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				}
			}).success(function (response) {
				if (insertMode != "TRX") {
				if (response != "update") {
					data.eventId = response;
					$rootScope.$broadcast('eventAdded', {
						data: data,
						update: false
					});
				GllocalCalendarEvents.push(data);
				} else {
					var getEventId = data.eventId;
					$rootScope.$broadcast('eventAdded', {
						data: data,
						update: true
					});
					for (i = 0; i < GllocalCalendarEvents.length; i++) {
						var localEventId = GllocalCalendarEvents[i].eventId;
						if (localEventId == getEventId) {
						GllocalCalendarEvents[i] = data;
					}
					}
				}
			}
				self.reload();
			}).error(function (error) {});
		},
		'createPanelForDuplictionList': function () {
			var createPanelForDupliction = '<div id="duplication-panel" class="panel panel-default">';
			createPanelForDupliction += '<div class="panel-heading"> Overlapping reminders';
			createPanelForDupliction += '<span id="close-duplication-panel" class="glyphicon glyphicon-remove pull-left" aria-hidden="true"></span>';
			createPanelForDupliction += '</div>';
			createPanelForDupliction += '<div id="massage-body" class="panel-body">';
			createPanelForDupliction += '<table id="massage-table" class="table">';
			createPanelForDupliction += '<tr id="header">';
			createPanelForDupliction += '<th> <div>Reminder title</div></th>';
			createPanelForDupliction += '<th style="text-align: center;"> <div> Start Time </div></th>';
			createPanelForDupliction += '<th style="text-align: center;"> <div>End Time </div></th>';
			createPanelForDupliction += '<tr>';
			createPanelForDupliction += '</table>';
			createPanelForDupliction += '</div>';
			createPanelForDupliction += '<div id="footer">';
			createPanelForDupliction += '<div class="btn-group btn-group-justified" role="group" aria-label="...">';
			createPanelForDupliction += '<div class="btn-group" role="group">';
			createPanelForDupliction += '<button id="approval-button" type="button" class="btn btn-default">Ok</button>';
			createPanelForDupliction += '</div>';
			createPanelForDupliction += '<div class="btn-group" role="group">';
			createPanelForDupliction += '<button id="Cancellation-button" type="button" class="btn btn-default">Cancel</button>';
			createPanelForDupliction += '</div>';
			createPanelForDupliction += '</div>';
			createPanelForDupliction += '</div>';
			createPanelForDupliction += '<div id="update_process">';
			createPanelForDupliction += '<div layout="row" layout-sm="column" layout-align="space-around">';
			createPanelForDupliction += '<div id="myProgress">';
			createPanelForDupliction += '<div id="myBar"></div>';
			createPanelForDupliction += '<h5>Saving a reminder</h5>';
			createPanelForDupliction += '</div>';
			createPanelForDupliction += '</div>';
			createPanelForDupliction += '</div>';
			createPanelForDupliction += '</div>';
			if (self.approveMode == "update") {
				$("#dialogContainer").append(createPanelForDupliction);
			} else {
				$("#modal-content-repeat").append(createPanelForDupliction);
				$("#duplication-panel").css("display", "block");
			}
			var checkOverlapingRepeat = document.getElementById("check_overlaping_repeat");
			if (checkOverlapingRepeat !== undefined) {
				self.shared_scope.hide();
			}
			$("#approval-button").bind("click", function () {
				document.getElementById("update_process").style.display = "block";
				var elem = document.getElementById("myBar");
				var width = 1;
				var id = setInterval(frame, 15);

				function frame() {
					if (width >= 100) {
						clearInterval(id);
					} else {
						width++;
						elem.style.width = width + '%';
					}
				}
				self.sendDataAfterApprove();
				setTimeout(function () {
					if (self.approveMode === "update") {
						location.reload();
					}
					self.shared_scope.hide();
				}, 2000);
			});
			$("#Cancellation-button").click(function () {
				$("#approval-button").unbind("click");
				self.clickedeventguid = "";
				$("#duplication-panel").remove();
				$("#duplication-panel").hide();
				$("#fade-background").hide();
				$("#massage-table").html("");
			});
			$("#close-duplication-panel").click(function () {
				document.getElementsByTagName("body")[0].style.pointerEvents = 'auto';
				$("#approval-button").unbind("click");
				self.clickedeventguid = "";
				$("#duplication-panel").hide();
				$("#duplication-panel").remove();
				$("#fade-background").hide();
				$("#massage-table").html("");
			});
		},
		'sendDataAfterApprove': function () {
			if (self.approveMode == "update") {
				var hoursOnly = formatRepeatedDate(data.start, data.end);
				for (i = 0; i < GllocalCalendarEvents.length; i++) {
					if (GllocalCalendarEvents[i].repeatevent == self.clickedeventguid) {
						var newData = setNewTimeInrepeatEvents(GllocalCalendarEvents[i].start, GllocalCalendarEvents[i].end, hoursOnly);
						data = {
							title: data.title,
							description: data.description,
							start: newData.concatTimeDateStart,
							end: newData.concatTimeDateEnd,
							username: data.username,
							allday: "allday",
							stick: true,
							eventId: GllocalCalendarEvents[i].eventId,
							reminder: 0,
							repeatevent: self.clickedeventguid
						};
						$http({
							method: 'POST',
							url: Domain +'calendar/createnewevent.php/?funcname=updaterepeatedevent',
							data: data,
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
							}
						}).success(function (response) {}).error(function (error) {});
					}
				}
			} else if (self.approveMode == "insert_day") {
				self.addMultipleDaysEvents("day");
			} else if (self.approveMode == "insert_week") {
				self.addMultipleDaysEvents("week");
			} else if (self.approveMode == "insert_mounth") {
				self.addMultipleDaysEvents("mounth");
			} else if (self.approveMode == "insert_year") {
				self.addMultipleDaysEvents("year");
			}
		},
		'daleteTrxEvent':function(event_id){
			data = {
				event_id:event_id
			}
			$http({
			method: 'POST',
			url: Domain +'calendar/deletetrxevent.php/',
			data: data,
			headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
			}
			}).success(function (response) {
			}).error(function (error) {});
		},
		'checkFromFill': function () {
			self.shared_scope.hide();
			document.getElementsByTagName("body")[0].style.pointerEvents = 'auto';
			$mdDialog.show(
				$mdDialog.alert()
				.parent(angular.element(document.querySelector('#modal-content-repeat')))
				.clickOutsideToClose(true)
				.title('No Reminders time entered')
				.textContent('')
				.ariaLabel('Alert Dialog Demo')
				.ok('Got it!')
				.targetEvent("ev")
			);
			return;
		}
	};

	function formatRepeatedDate(start, end) {
		var timeOnly = [];
		var startTime = start.replace(/.+ /, "");
		var endTime = end.replace(/.+ /, "");
		timeOnly = {
			startTime, endTime
		};
		return timeOnly;
	}

	function setNewTimeInrepeatEvents(start, end, hoursOnly) {
		var newTime = [];
		var eventstartdate = moment(start).format().replace(/T.+/, "");
		var concatTimeDateStart = eventstartdate + " " + hoursOnly.startTime;
		var eventenddate = moment(end).format().replace(/T.+/, "");
		var concatTimeDateEnd = eventenddate + " " + hoursOnly.endTime;
		newTime = {
			concatTimeDateStart, concatTimeDateEnd
		};
		return newTime;
	}

	function DialogController($scope, $mdDialog, dataToPass) {
		var date = moment(dataToPass).format("DD-MM-YYYY");
		$scope.eventstartdate = date;
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
	return self;
}]);