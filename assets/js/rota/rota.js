document.addEventListener('DOMContentLoaded', function() {
  initCalender();
  initTimezoneSelectList();
  initMemberCheckboxes();
});

var currentCalendarView = 'timelineMonthly';
var initialTimeZone = 'Asia/Kolkata';
var calendar = null;
var events = null;

function initCalender() {
  var calendarElement = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarElement, {
    initialView: currentCalendarView,
    timeZone: initialTimeZone,
    //eventTimeFormat: { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' },
    navLinks: true, // can click day/week names to navigate views
    dayMaxEvents: true, // allow "more" link when too many events
    headerToolbar: {
      left: 'title',
      center: 'exportButton',
      right: 'prev,next today calendarMonthly,calendarWeekly timelineYearly,timelineMonthly,timelineWeekly,timelineWeeklyVertical listMonthly,listWeekly,listDaily'
    },
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    resourceAreaWidth: '5%',
    resourceAreaHeaderContent: 'Schedule',
    resourceGroupField: 'id',
    resources: getResources(),
    events: getEvents(),
    datesAboveResources: true,
    customButtons: {
      exportButton: {
        text: 'Export',
        click: function() {
          //console.log('export data to csv...!');
          if (events != null) {
            let csvContent = 'data:text/csv;charset=utf-8,'
             + 'Shift,Member,Start,End,OnLeave,PublicHoliday\n'
             + events.map((e) => e.shift + ',' + e.member + ',' + e.start + ',' + e.end + ',' + (e.onLeave ? 'Yes' : '') + ',' + (e.onHoliday ? 'Yes' : '')).join('\n');
            data = encodeURI(csvContent);
            link = document.createElement('a');
            link.setAttribute('href', data);
            link.setAttribute('download', 'export.csv');
            link.click();
            link.remove();
          }
        }
      }
    },
    datesSet: function (dateInfo) {
      //console.log(dateInfo);
      currentCalendarView = dateInfo.view.type;
    },
    views: {
      calendarYearly: { type: 'multiMonthYear', buttonText: 'Calendar (Year)' },
      calendarMonthly: { type: 'dayGridMonth', buttonText: 'Calendar (Month)' },
      calendarWeekly: { type: 'dayGridWeek', buttonText: 'Calendar (Week)' },
      calendarDaily: { type: 'timeGridDay', buttonText: 'Calendar (Day)' },
      timelineYearly: { type: 'resourceTimelineYear', buttonText: 'Timeline (Year)' },
      timelineMonthly: { type: 'resourceTimelineMonth', buttonText: 'Timeline (Month)' },
      timelineWeekly: { type: 'resourceTimelineWeek', buttonText: 'Timeline (Week)' },
      timelineWeeklyVertical: { type: 'resourceTimeGrid', duration: { days: 7 }, buttonText: 'Timeline (Week) Vertical' },
      timelineDaily: { type: 'resourceTimelineDay', buttonText: 'Timeline (Day)' },
      listYearly: { type: 'listYear', buttonText: 'List (Year)' },
      listMonthly: { type: 'listMonth', buttonText: 'List (Month)' },
      listWeekly: { type: 'listWeek', buttonText: 'List (Week)' },
      listDaily: { type: 'listDay', buttonText: 'List (Today)' }
    },
    eventDidMount: function(info) {
      tippy(info.el, {
        content: info.event.extendedProps.onHoliday ? 'On Public Holiday' : info.event.extendedProps.member + ' (' + info.event.extendedProps.shift + ')' + (info.event.extendedProps.onLeave ? ' - On Leave' : '') + (info.event.extendedProps.onAlternateWorkShift ? ' - On Alternate Shift' : info.event.extendedProps.onAlternateWorkday ? ' - On Alternate Workday' : ''),
        placement: 'top',
      });
    },
  });
  calendar.render();
}

function initTimezoneSelectList() {
  var timeZoneSelectorEl = document.getElementById('time-zone-selector');
  timeZoneSelectorEl.addEventListener('change', function () {
    //console.log('changing the calendar timezone to ' + this.value);
    calendar.setOption('timeZone', this.value);
  });
}

function toggleMemberCheckboxes(selection) {
  // true = select all, false = unselect all
  $('#members input[type="checkbox"]').prop('checked', selection);
  var members = getMembers();
  members.forEach((m) => (m.active = selection ? 1 : 0));
  initCalender();
}

function initMemberCheckboxes() {
  var membersElement = document.getElementById('members');
  var members = getMembers();
  members.forEach((member) => {
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = member.name;
    checkbox.checked = member.active;
    checkbox.addEventListener('click', function (e) {
      //console.log("input id : " + e.target.id + ", checked : " + e.target.checked);
      var members = getMembers();
      members.filter((m) => m.name == e.target.id)[0].active = e.target.checked
        ? 1
        : 0;
      initCalender();
    });

    var label = document.createElement('label');
    label.htmlFor = member.name;
    label.innerHTML = member.name;
    label.style.backgroundColor = member.backgroundColor;
    label.style.color = member.textColor;

    var li = document.createElement('li');
    li.appendChild(checkbox);
    li.appendChild(label);

    membersElement.appendChild(li);
  });
}

var members = null;
function getMembers() {
  if (members == null) {
    members = [
      { active: 1, name: 'Ankit', backgroundColor: '#b5e2fa', textColor: '#000000' },
      { active: 1, name: 'Jay', backgroundColor: '#eddea4', textColor: '#000000' },
      { active: 1, name: 'Vedant', backgroundColor: '#f7a072', textColor: '#000000' },
      { active: 1, name: 'Priyen', backgroundColor: '#f28482', textColor: '#000000' },
      { active: 1, name: 'Shital', backgroundColor: '#f6bd60', textColor: '#000000' },
      { active: 1, name: 'H Jayesh', backgroundColor: '#f5cac3', textColor: '#000000' },
      { active: 1, name: 'P Jayesh', backgroundColor: '#9eb7e5', textColor: '#000000' },
      { active: 1, name: 'Viral', backgroundColor: '#e8e5da', textColor: '#000000' },
      { active: 1, name: 'Vivek', backgroundColor: '#cdc392', textColor: '#000000' },
    ];
  }
  return members;
}

function getShifts() {
  return [
    { name: '1-Morning', start: 'T05:00:00', end: 'T14:00:00' },
    { name: '2-Afternoon', start: 'T13:00:00', end: 'T22:00:00' },
    { name: '3-Night', start: 'T21:00:00', end: 'T05:00:00' },
    //{ name: '4-DayTime', start: 'T10:00:00', end: 'T19:00:00' },
  ];
}

function getWeekends() {
  return [
    { name: 'Fri-Sat', weekend: [5, 6] },
    { name: 'Sun-Mon', weekend: [0, 1] },
    { name: 'Tue-Wed', weekend: [2, 3] },
    { name: 'Sat-Sun', weekend: [6, 0] },
    { name: 'Mon-Tue', weekend: [1, 2] },
    { name: 'Wed-Thu', weekend: [3, 4] },
    { name: 'SunOnly', weekend: [0] },
  ];
}

function getMemberDetails() {
  var memberDetails = [];
  var memberNames = getMemberNames();
  var leaves = getLeaves();
  var alternateWorkdays = getAlternateWorkdays();
  var members = getMembers();

  memberNames.forEach ((memberName) => {
    var member = members.filter((m) => m.name === memberName)[0];
    if (member.active) {
      memberDetails.push({
        name: memberName,
        backgroundColor: member.backgroundColor,
        textColor: member.textColor,
        events: window['getCalendarEventsFor' + memberName.replace(/\s/g, '')](),  // remove space in the memberName
        leaves: leaves.filter(l => l.name === memberName).map(l => new Date(l.leaveDate).getTime()),
        alternateWorkdays: alternateWorkdays.filter(a => a.name === memberName),
      });
    }
  });
  
  return memberDetails;
}

function getResources() {
  var resources = [];
  var shifts = getShifts();
  var memberDetails = getMemberDetails();

  memberDetails.forEach((member) => {
    var memberShifts = [...new Set(member.events.map((event) => event.shift))];
    memberShifts.forEach((ms) => {
      resources.push({ id: ms, member: member.name });
    })
  });

  return resources;
}

function getEvents() {
  events = [];
  var holidays = getHolidays();
  var shifts = getShifts();
  var memberDetails = getMemberDetails();

  memberDetails.forEach((member) => {
    member.events.forEach((event) => {
      var eventDate = new Date(event.date);
      var eventDateTime = eventDate.getTime();  // get total milliseconds...  // Milliseconds since Jan 1, 1970, 00:00:00.000 GMT
      var shift = shifts.filter((s) => s.name === event.shift)[0];
      var onHoliday = holidays.map((h) => new Date(h.date).getTime()).includes(eventDateTime);
      var holiday = onHoliday ? holidays.filter((h) => new Date(h.date).getTime() === eventDateTime)[0] : '';
      var onLeave = member.leaves.includes(eventDateTime);
      var alternateWorkdayDetails = member.alternateWorkdays.filter((a) => new Date(a.workDate).getTime() === eventDateTime);
      var onAlternateWorkday = alternateWorkdayDetails.length > 0;
      var onAlternateWorkShift = alternateWorkdayDetails.length > 0 && alternateWorkdayDetails[0].shift != null && alternateWorkdayDetails[0].shift != shift.name;
      var alternateShift = onAlternateWorkShift ? shifts.filter((s) => s.name === alternateWorkdayDetails[0].shift)[0] : null;

      //console.log("loop : " + loop + ", daysCounter : " + daysCounter + ", onLeave : " + onLeave + ", onAlternateWorkday : " + onAlternateWorkday + ", onAlternateWorkShift : " + onAlternateWorkShift);
      events.push({
        resourceId: onAlternateWorkShift ? alternateShift.name : shift.name,
        member: member.name,
        shift: onAlternateWorkShift ? alternateShift.name : shift.name,
        onHoliday: onHoliday,
        onLeave: onLeave,
        onAlternateWorkday: onAlternateWorkday,
        onAlternateWorkShift: onAlternateWorkShift,
        title: member.name + ' (' + (onHoliday ? 'On Holiday - ' + holiday.name : onLeave ? 'On Leave' : onAlternateWorkday ? onAlternateWorkShift ? 'On Alternate Shift' : 'On Alternate Workday' : shift.name) + ')',
        start: eventDate.getFullYear() + '-' + ('0' + (eventDate.getMonth() + 1)).slice(-2) + '-' + ('0' + eventDate.getDate()).slice(-2) + (onAlternateWorkShift ? alternateShift.start : shift.start),
        end: eventDate.getFullYear() + '-' + ('0' + (eventDate.getMonth() + 1)).slice(-2) + '-' + ('0' + (eventDate.getDate().valueOf() + (onAlternateWorkShift ? alternateShift.name === '3-Night' : shift.name === '3-Night' ? 1 : 0))).slice(-2) + (onAlternateWorkShift ? alternateShift.end : shift.end),
        backgroundColor: onHoliday ? '#333333' : onLeave ? '#555555' : onAlternateWorkday ? '#888888' : member.backgroundColor,
        textColor: onHoliday ? '#ffffff' : onLeave ? '#ffffff' : member.textColor,
      });
    });
  });

  return events;
}
