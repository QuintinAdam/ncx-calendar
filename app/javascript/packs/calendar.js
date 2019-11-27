import moment from 'moment/moment'
import Rails from '@rails/ujs'

var CalendarList = [];

function CalendarInfo() {
    this.id = null;
    this.name = null;
    this.checked = true;
    this.color = null;
    this.bgColor = null;
    this.borderColor = null;
    this.dragBgColor = null;
}

function addCalendar(calendar) {
    CalendarList.push(calendar);
}

function findCalendar(id) {
    var found;

    CalendarList.forEach(function(calendar) {
        if (calendar.id === id) {
            found = calendar;
        }
    });

    return found || CalendarList[0];
}

function hexToRGBA(hex) {
    var radix = 16;
    var r = parseInt(hex.slice(1, 3), radix),
        g = parseInt(hex.slice(3, 5), radix),
        b = parseInt(hex.slice(5, 7), radix),
        a = parseInt(hex.slice(7, 9), radix) / 255 || 1;
    var rgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';

    return rgba;
}

(function() {
    var calendar;
    // var id = 0;

    calendar = new CalendarInfo();
    // id += 1;
    calendar.id = 'general';
    calendar.name = 'General';
    calendar.color = '#ffffff';
    calendar.bgColor = '#9D9D9D';
    calendar.dragBgColor = '#9D9D9D';
    calendar.borderColor = '#9D9D9D';
    addCalendar(calendar);

    calendar = new CalendarInfo();
    // id += 1;
    calendar.id = 'official';
    calendar.name = 'Official';
    calendar.color = '#ffffff';
    calendar.bgColor = '#044162';
    calendar.dragBgColor = '#044162';
    calendar.borderColor = '#044162';
    addCalendar(calendar);

    calendar = new CalendarInfo();
    // id += 1;
    calendar.id = 'workshop';
    calendar.name = 'Workshop';
    calendar.color = '#ffffff';
    calendar.bgColor = '#28A9FF';
    calendar.dragBgColor = '#28A9FF';
    calendar.borderColor = '#28A9FF';
    addCalendar(calendar);

    calendar = new CalendarInfo();
    // id += 1;
    calendar.id = 'fitness';
    calendar.name = 'Fitness';
    calendar.color = '#ffffff';
    calendar.bgColor = '#FF5583';
    calendar.dragBgColor = '#FF5583';
    calendar.borderColor = '#FF5583';
    addCalendar(calendar);

    calendar = new CalendarInfo();
    // id += 1;
    calendar.id = 'meetup';
    calendar.name = 'Meetup';
    calendar.color = '#ffffff';
    calendar.bgColor = '#03BD9E';
    calendar.dragBgColor = '#03BD9E';
    calendar.borderColor = '#03BD9E';
    addCalendar(calendar);

    calendar = new CalendarInfo();
    // id += 1;
    calendar.id = 'birthday';
    calendar.name = 'Birthday';
    calendar.color = '#ffffff';
    calendar.bgColor = '#FFBB3B';
    calendar.dragBgColor = '#FFBB3B';
    calendar.borderColor = '#FFBB3B';
    addCalendar(calendar);

    calendar = new CalendarInfo();
    // id += 1;
    calendar.id = 'party';
    calendar.name = 'Party';
    calendar.color = '#ffffff';
    calendar.bgColor = '#FF4040';
    calendar.dragBgColor = '#FF4040';
    calendar.borderColor = '#00FF00';
    addCalendar(calendar);

    // calendar = new CalendarInfo();
    // // id += 1;
    // calendar.id = String(id);
    // calendar.name = 'National Holidays';
    // calendar.color = '#ffffff';
    // calendar.bgColor = '#ff4040';
    // calendar.dragBgColor = '#ff4040';
    // calendar.borderColor = '#ff4040';
    // addCalendar(calendar);
})();


// ########################

var ScheduleList = [];

function ScheduleInfo() {
    this.id = null;
    this.calendarId = null;

    this.title = null;
    this.body = 'Info: ';
    this.isAllday = false;
    this.start = null;
    this.end = null;
    this.category = '';
    this.dueDateClass = '';

    this.color = null;
    this.bgColor = null;
    this.dragBgColor = null;
    this.borderColor = null;
    this.customStyle = '';

    this.isFocused = false;
    this.isPending = false;
    this.isVisible = true;
    this.isReadOnly = false;
    this.goingDuration = 0;
    this.comingDuration = 0;
    this.recurrenceRule = '';
    this.state = '';

    this.raw = {
        memo: '',
        hasToOrCc: false,
        hasRecurrenceRule: false,
        location: null,
        class: 'public', // or 'private'
        creator: {
            name: '',
            avatar: '',
            company: '',
            email: '',
            phone: ''
        }
    };
}


// ########################


window.calendarInit = function(window, Calendar) {
    var cal, resizeThrottled;
    var useCreationPopup = true;
    var useDetailPopup = true;
    var datePicker, selectedCalendar;

    cal = new Calendar('#calendar', {
        defaultView: 'day',
        taskView: false,
        usageStatistics: false,
        disableClick: true,
        disableDblClick: false,
        isReadOnly: !document.getElementById("signed_in"),
        useCreationPopup: useCreationPopup,
        useDetailPopup: useDetailPopup,
        calendars: CalendarList,
        template: {
            allday: function(schedule) {
                return getTimeTemplate(schedule, true);
            },
            time: function(schedule) {
                return getTimeTemplate(schedule, false);
            },
            popupDetailBody: function(schedule) {
                return 'Info : ' + schedule.body;
            },
        }
    });

    // event handlers
    cal.on({
        'clickMore': function(e) {
            console.log('clickMore', e);
        },
        'clickSchedule': function(e) {
            console.log('clickSchedule', e);
        },
        'clickDayname': function(date) {
            console.log('clickDayname', date);
        },
        'beforeCreateSchedule': function(e) {
            console.log('beforeCreateSchedule', e);
            saveNewSchedule(e);
        },
        'beforeUpdateSchedule': function(e) {
            var schedule = e.schedule;
            var changes = e.changes;
            // console.log('beforeUpdateSchedule', e);
            saveUpdateSchedule(schedule.id, changes);
            cal.updateSchedule(schedule.id, schedule.calendarId, changes);
            refreshScheduleVisibility();
        },
        'beforeDeleteSchedule': function(e) {
            console.log('beforeDeleteSchedule', e);
            appDeleteSchedule(e.schedule.id);
            cal.deleteSchedule(e.schedule.id, e.schedule.calendarId);
        },
        'afterRenderSchedule': function(e) {
            var schedule = e.schedule;
            var element = cal.getElement(schedule.id, schedule.calendarId);
            console.log('afterRenderSchedule', element);
        },
        'clickTimezonesCollapseBtn': function(timezonesCollapsed) {
            console.log('timezonesCollapsed', timezonesCollapsed);

            if (timezonesCollapsed) {
                cal.setTheme({
                    'week.daygridLeft.width': '77px',
                    'week.timegridLeft.width': '77px'
                });
            } else {
                cal.setTheme({
                    'week.daygridLeft.width': '60px',
                    'week.timegridLeft.width': '60px'
                });
            }

            return true;
        }
    });

    /**
     * Get time template for time and all-day
     * @param {Schedule} schedule - schedule
     * @param {boolean} isAllDay - isAllDay or hasMultiDates
     * @returns {string}
     */
    function getTimeTemplate(schedule, isAllDay) {
        var html = [];
        var start = moment(schedule.start.toUTCString());
        if (!isAllDay) {
            html.push('<strong>' + start.format('HH:mm') + '</strong> ');
        }
        if (schedule.isPrivate) {
            html.push('<span class="calendar-font-icon ic-lock-b"></span>');
            html.push(' Private');
        } else {
            if (schedule.isReadOnly) {
                html.push('<span class="calendar-font-icon ic-readonly-b"></span>');
            } else if (schedule.recurrenceRule) {
                html.push('<span class="calendar-font-icon ic-repeat-b"></span>');
            } else if (schedule.attendees.length) {
                html.push('<span class="calendar-font-icon ic-user-b"></span>');
            } else if (schedule.location) {
                html.push('<span class="calendar-font-icon ic-location-b"></span>');
            }
            console.log(schedule)
            if (schedule.raw.host) {
              html.push(' ' + schedule.title + '<br/>Hosted by ' + schedule.raw.host);
            } else {
              html.push(' ' + schedule.title);
            }
        }

        return html.join('');
    }

    /**
     * A listener for click the menu
     * @param {Event} e - click event
     */
    function onClickMenu(e) {
        var target = $(e.target).closest('a[role="menuitem"]')[0];
        var action = getDataAction(target);
        var options = cal.getOptions();
        var viewName = '';

        console.log(target);
        console.log(action);
        switch (action) {
            case 'toggle-daily':
                viewName = 'day';
                break;
            case 'toggle-weekly':
                viewName = 'week';
                break;
            case 'toggle-monthly':
                options.month.visibleWeeksCount = 0;
                viewName = 'month';
                break;
            case 'toggle-weeks2':
                options.month.visibleWeeksCount = 2;
                viewName = 'month';
                break;
            case 'toggle-weeks3':
                options.month.visibleWeeksCount = 3;
                viewName = 'month';
                break;
            case 'toggle-narrow-weekend':
                options.month.narrowWeekend = !options.month.narrowWeekend;
                options.week.narrowWeekend = !options.week.narrowWeekend;
                viewName = cal.getViewName();

                target.querySelector('input').checked = options.month.narrowWeekend;
                break;
            case 'toggle-start-day-1':
                options.month.startDayOfWeek = options.month.startDayOfWeek ? 0 : 1;
                options.week.startDayOfWeek = options.week.startDayOfWeek ? 0 : 1;
                viewName = cal.getViewName();

                target.querySelector('input').checked = options.month.startDayOfWeek;
                break;
            case 'toggle-workweek':
                options.month.workweek = !options.month.workweek;
                options.week.workweek = !options.week.workweek;
                viewName = cal.getViewName();

                target.querySelector('input').checked = !options.month.workweek;
                break;
            default:
                break;
        }

        cal.setOptions(options, true);
        cal.changeView(viewName, true);

        setDropdownCalendarType();
        setRenderRangeText();
        setSchedules();
    }

    function onClickNavi(e) {
        var action = getDataAction(e.target);

        switch (action) {
            case 'move-prev':
                cal.prev();
                break;
            case 'move-next':
                cal.next();
                break;
            case 'move-today':
                cal.today();
                break;
            default:
                return;
        }

        setRenderRangeText();
        setSchedules();
    }

    function onNewSchedule() {
        var title = $('#new-schedule-title').val();
        var location = $('#new-schedule-location').val();
        var isAllDay = document.getElementById('new-schedule-allday').checked;
        var start = datePicker.getStartDate();
        var end = datePicker.getEndDate();
        var calendar = selectedCalendar ? selectedCalendar : CalendarList[0];

        if (!title) {
            return;
        }

        cal.createSchedules([{
            id: String(chance.guid()),
            calendarId: calendar.id,
            title: title,
            isAllDay: isAllDay,
            start: start,
            end: end,
            category: isAllDay ? 'allday' : 'time',
            dueDateClass: '',
            color: calendar.color,
            bgColor: calendar.bgColor,
            dragBgColor: calendar.bgColor,
            borderColor: calendar.borderColor,
            raw: {
                location: location
            },
            state: 'Busy'
        }]);

        $('#modal-new-schedule').modal('hide');
    }

    function onChangeNewScheduleCalendar(e) {
        var target = $(e.target).closest('a[role="menuitem"]')[0];
        var calendarId = getDataAction(target);
        changeNewScheduleCalendar(calendarId);
    }

    function changeNewScheduleCalendar(calendarId) {
        var calendarNameElement = document.getElementById('calendarName');
        var calendar = findCalendar(calendarId);
        var html = [];

        html.push('<span class="calendar-bar" style="background-color: ' + calendar.bgColor + '; border-color:' + calendar.borderColor + ';"></span>');
        html.push('<span class="calendar-name">' + calendar.name + '</span>');

        calendarNameElement.innerHTML = html.join('');

        selectedCalendar = calendar;
    }

    function createNewSchedule(event) {
        var start = event.start ? new Date(event.start.getTime()) : new Date();
        var end = event.end ? new Date(event.end.getTime()) : moment().add(1, 'hours').toDate();

        if (useCreationPopup) {
            cal.openCreationPopup({
                start: start,
                end: end
            });
        }
    }
    function saveNewSchedule(scheduleData) {
        var calendar = scheduleData.calendar || findCalendar(scheduleData.calendarId);
        console.log('scheduleData')
        console.log(scheduleData)
        var schedule = {
            id: scheduleData.id,
            title: scheduleData.title,
            isAllDay: scheduleData.isAllDay,
            start: scheduleData.start,
            end: scheduleData.end,
            category: scheduleData.isAllDay ? 'allday' : 'time',
            dueDateClass: '',
            color: calendar.color,
            bgColor: calendar.bgColor,
            dragBgColor: calendar.bgColor,
            borderColor: calendar.borderColor,
            location: scheduleData.location,
            raw: {
                class: scheduleData.raw['class']
            },
            state: scheduleData.state
        };
        if (calendar) {
            schedule.calendarId = calendar.id;
            schedule.color = calendar.color;
            schedule.bgColor = calendar.bgColor;
            schedule.borderColor = calendar.borderColor;
        }
        console.log(schedule);
        var fd = new FormData();
        fd.append("event", JSON.stringify(schedule));
        var user_id = document.getElementById("signed_in").dataset.uid;

        Rails.ajax({
          type: "POST",
          url: "/events.json?user_id=" + user_id,
          data: fd,
          success: function(data) {console.log('success')},
          error: function(data) {console.log('error')}
        });
        cal.createSchedules([schedule]);
        refreshScheduleVisibility();
    }

    function saveUpdateSchedule(schedule_id, changes) {
        var fd = new FormData();
        fd.append("event", JSON.stringify(changes));
        var user_id = document.getElementById("signed_in").dataset.uid;
        Rails.ajax({
          type: "PATCH",
          url: "/events/" + schedule_id +".json?user_id=" + user_id,
          data: fd,
          success: function(data) {console.log('success')},
          error: function(data) {console.log('error')}
        });
        // cal.createSchedules([schedule]);
        // refreshScheduleVisibility();
    }

    function appDeleteSchedule(schedule_id) {
      var user_id = document.getElementById("signed_in").dataset.uid;
      Rails.ajax({
        type: "DELETE",
        url: "/events/" + schedule_id +".json?user_id=" + user_id,
        success: function(data) {console.log('success')},
        error: function(data) {console.log('error')}
      });
    }

    function onChangeCalendars(e) {
        var calendarId = e.target.value;
        var checked = e.target.checked;
        var viewAll = document.querySelector('.lnb-calendars-item input');
        var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));
        var allCheckedCalendars = true;

        if (calendarId === 'all') {
            allCheckedCalendars = checked;

            calendarElements.forEach(function(input) {
                var span = input.parentNode;
                input.checked = checked;
                span.style.backgroundColor = checked ? span.style.borderColor : 'transparent';
            });

            CalendarList.forEach(function(calendar) {
                calendar.checked = checked;
            });
        } else {
            findCalendar(calendarId).checked = checked;

            allCheckedCalendars = calendarElements.every(function(input) {
                return input.checked;
            });

            if (allCheckedCalendars) {
                viewAll.checked = true;
            } else {
                viewAll.checked = false;
            }
        }

        refreshScheduleVisibility();
    }

    function refreshScheduleVisibility() {
        var calendarElements = Array.prototype.slice.call(document.querySelectorAll('#calendarList input'));

        CalendarList.forEach(function(calendar) {
            cal.toggleSchedules(calendar.id, !calendar.checked, false);
        });

        cal.render(true);

        calendarElements.forEach(function(input) {
            var span = input.nextElementSibling;
            span.style.backgroundColor = input.checked ? span.style.borderColor : 'transparent';
        });
    }

    function setDropdownCalendarType() {
        var calendarTypeName = document.getElementById('calendarTypeName');
        var calendarTypeIcon = document.getElementById('calendarTypeIcon');
        var options = cal.getOptions();
        var type = cal.getViewName();
        var iconClassName;

        if (type === 'day') {
            type = 'Daily';
            iconClassName = 'calendar-icon ic_view_day';
        } else if (type === 'week') {
            type = 'Weekly';
            iconClassName = 'calendar-icon ic_view_week';
        } else if (options.month.visibleWeeksCount === 2) {
            type = '2 weeks';
            iconClassName = 'calendar-icon ic_view_week';
        }
        // else if (options.month.visibleWeeksCount === 3) {
        //     type = '3 weeks';
        //     iconClassName = 'calendar-icon ic_view_week';
        // } else {
        //     type = 'Monthly';
        //     iconClassName = 'calendar-icon ic_view_month';
        // }

        calendarTypeName.innerHTML = type;
        calendarTypeIcon.className = iconClassName;
    }

    function setRenderRangeText() {
        var renderRange = document.getElementById('renderRange');
        var options = cal.getOptions();
        var viewName = cal.getViewName();
        var html = [];
        if (viewName === 'day') {
            html.push(moment(cal.getDate().getTime()).format('MM.DD'));
        } else if (viewName === 'month' &&
            (!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)) {
            html.push(moment(cal.getDate().getTime()).format('MM'));
        } else {
            html.push(moment(cal.getDateRangeStart().getTime()).format('MM.DD'));
            html.push(' ~ ');
            html.push(moment(cal.getDateRangeEnd().getTime()).format(' MM.DD'));
        }
        renderRange.innerHTML = html.join('');
    }

    function setSchedules() {
        cal.clear();
        // generateSchedule(cal.getViewName(), cal.getDateRangeStart(), cal.getDateRangeEnd());
        // cal.createSchedules(ScheduleList);
        var schedules = []
        $.ajax({
          url: '/events.json',
          type: 'GET',
          dataType: 'json',
        })
        .done(function(data) {
          console.log(data);
          console.log("success");
          var schedules = data;
          console.log(schedules);
          cal.createSchedules(schedules);
          refreshScheduleVisibility();
        })
        .fail(function(data) {
          console.log("error");
        })
        .always(function() {
          console.log("complete");
        });
        // var schedules = [
        //     {id: 489273, title: 'Workout for 2019-04-05', isAllDay: false, start: '2018-02-01T11:30:00+09:00', end: '2018-02-01T12:00:00+09:00', goingDuration: 30, comingDuration: 30, color: '#ffffff', isVisible: true, bgColor: '#69BB2D', dragBgColor: '#69BB2D', borderColor: '#69BB2D', calendarId: 'logged-workout', category: 'time', dueDateClass: '', customStyle: 'cursor: default;', isPending: false, isFocused: false, isReadOnly: true, isPrivate: false, location: '', attendees: '', recurrenceRule: '', state: ''},
        //     // {id: 18073, title: 'completed with blocks', isAllDay: false, start: '2018-11-17T09:00:00+09:00', end: '2018-11-17T10:00:00+09:00', color: '#ffffff', isVisible: true, bgColor: '#54B8CC', dragBgColor: '#54B8CC', borderColor: '#54B8CC', calendarId: 'workout', category: 'time', dueDateClass: '', customStyle: '', isPending: false, isFocused: false, isReadOnly: false, isPrivate: false, location: '', attendees: '', recurrenceRule: '', state: ''}
        // ];

    }

    function setEventListener() {
        $('#menu-navi').on('click', onClickNavi);
        $('.dropdown-menu a[role="menuitem"]').on('click', onClickMenu);
        $('#lnb-calendars').on('change', onChangeCalendars);

        $('#btn-save-schedule').on('click', onNewSchedule);
        $('#btn-new-schedule').on('click', createNewSchedule);

        $('#dropdownMenu-calendars-list').on('click', onChangeNewScheduleCalendar);

        window.addEventListener('resize', resizeThrottled);
    }

    function getDataAction(target) {
        return target.dataset ? target.dataset.action : target.getAttribute('data-action');
    }

    // resizeThrottled = tui.util.throttle(function() {
    //     cal.render();
    // }, 50);

    window.cal = cal;

    setDropdownCalendarType();
    setRenderRangeText();
    setSchedules();
    setEventListener();
};

// set calendars

window.setCalendar = function() {
  var calendarList = document.getElementById('calendarList');
  var html = [];
  CalendarList.forEach(function(calendar) {
      html.push('<div class="lnb-calendars-item"><label>' +
          '<input type="checkbox" class="tui-full-calendar-checkbox-round" value="' + calendar.id + '" checked>' +
          '<span style="border-color: ' + calendar.borderColor + '; background-color: ' + calendar.borderColor + ';"></span>' +
          '<span>' + calendar.name + '</span>' +
          '</label></div>'
      );
  });
  calendarList.innerHTML = html.join('\n');
};
