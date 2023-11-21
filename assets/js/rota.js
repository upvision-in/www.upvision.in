document.addEventListener('DOMContentLoaded', function() {
  initCalender();
  initTimezoneSelectList();
  initMemberCheckboxes();
});

var calendarStart = new Date("2023-11-1");
var calendarEnd = new Date("2024-12-31");
var currentCalendarView = 'timelineMonthly';
var initialTimeZone = 'Asia/Kolkata';
var calendar = null;

function initCalender() {
  var calendarElement = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarElement, {
    initialView: currentCalendarView,
    timeZone: initialTimeZone,
    eventTimeFormat: { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' },
    navLinks: true, // can click day/week names to navigate views
    dayMaxEvents: true, // allow "more" link when too many events
    headerToolbar: {
      left: 'title',
      center: '',
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
            let csvContent = "data:text/csv;charset=utf-8,"
                             + "Shift,Member,Start,End,OnLeave\n"
                             + events.map(e => e.shift + "," + e.member + "," + e.start + "," + e.end + "," + (e.onLeave ? "Yes" : "")).join("\n");
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
      calendarYearly: {
        type: 'multiMonthYear',
        buttonText: 'Calendar (Year)'
      },
      calendarMonthly: {
        type: 'dayGridMonth',
        buttonText: 'Calendar (Month)'
      },
      calendarWeekly: {
        type: 'dayGridWeek',
        buttonText: 'Calendar (Week)'
      },
      calendarDaily: {
        type: 'timeGridDay',
        buttonText: 'Calendar (Day)'
      },
      timelineYearly: {
        type: 'resourceTimelineYear',
        buttonText: 'Timeline (Year)'
      },
      timelineMonthly: {
        type: 'resourceTimelineMonth',
        buttonText: 'Timeline (Month)'
      },
      timelineWeekly: {
        type: 'resourceTimelineWeek',
        buttonText: 'Timeline (Week)'
      },
      timelineWeeklyVertical: {
        type: 'resourceTimeGrid',
        duration: { days: 7 },
        buttonText: 'Timeline (Week) Vertical'
      },
      timelineDaily: {
        type: 'resourceTimelineDay',
        buttonText: 'Timeline (Day)'
      },
      listYearly: {
        type: 'listYear',
        buttonText: 'List (Year)'
      },
      listMonthly: {
        type: 'listMonth',
        buttonText: 'List (Month)'
      },
      listWeekly: {
        type: 'listWeek',
        buttonText: 'List (Week)'
      },
      listDaily: {
        type: 'listDay',
        buttonText: 'List (Today)'
      }
    },
    eventDidMount: function(info) {
      tippy(info.el, {
        content: info.event.extendedProps.member + ' (' + info.event.extendedProps.shift + ')' + (info.event.extendedProps.onLeave ? ' - On Leave' : ''),
        placement: 'top'
      });
    }
  });
  calendar.render();
}

function initTimezoneSelectList() {
  var timeZoneSelectorEl = document.getElementById('time-zone-selector');
  timeZoneSelectorEl.addEventListener('change', function() {
    //console.log('changing the calendar timezone to ' + this.value);
    calendar.setOption('timeZone', this.value);
  });
}

function initMemberCheckboxes() {
  var membersElement= document.getElementById('members');
  var members = getMembers();
  members.forEach((member) => {
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = member.name;
    checkbox.checked = member.active;
    checkbox.addEventListener('click', function(e) {
      //console.log("input id : " + e.target.id + ", checked : " + e.target.checked);
      var members = getMembers();
      members.filter(m => m.name == e.target.id)[0].active = e.target.checked ? 1 : 0;
      initCalender();
    });

    var label = document.createElement('label');
    label.htmlFor = member.name;
    label.innerHTML = member.name;

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
    ]
  }
  return members;
}

function getShifts() {
  return [
    { name: '1-Morning', start: 'T05:00:00', end: 'T14:00:00' },
    { name: '2-Afternoon', start: 'T13:00:00', end: 'T22:00:00' },
    { name: '3-Night', start: 'T21:00:00', end: 'T05:00:00' },
    { name: '4-DayTime', start: 'T10:00:00', end: 'T19:00:00' }
  ];
}

function getWeekends() {
  return [
    { name: 'Fri-Sat', weekend: [5,6] },
    { name: 'Sun-Mon', weekend: [0,1] },
    { name: 'Tue-Wed', weekend: [2,3] },
    { name: 'Sat-Sun', weekend: [6,0] },
    { name: 'Mon-Tue', weekend: [1,2] },
    { name: 'Wed-Thu', weekend: [3,4] },
    { name: 'SunOnly', weekend: [0] }
  ];
}

function getAssignments() {
  return [
    { member: 'Ankit', shift: ['1-Morning'], weekend: ['Sun-Mon', 'Tue-Wed', 'Fri-Sat'], rotateWeeks: 4 },
    { member: 'Jay', shift: ['1-Morning'], weekend: ['Fri-Sat', 'Sun-Mon', 'Tue-Wed'], rotateWeeks: 4 },
    { member: 'Vedant', shift: ['1-Morning'], weekend: ['Tue-Wed', 'Fri-Sat', 'Sun-Mon'], rotateWeeks: 4 },
    { member: 'H Jayesh', shift: ['2-Afternoon'], weekend: ['Tue-Wed', 'Fri-Sat', 'Sun-Mon'], rotateWeeks: 4 },
    { member: 'Shital', shift: ['2-Afternoon'], weekend: ['Fri-Sat', 'Sun-Mon', 'Tue-Wed'], rotateWeeks: 4 },
    { member: 'Priyen', shift: ['2-Afternoon'], weekend: ['Sun-Mon', 'Tue-Wed', 'Fri-Sat'], rotateWeeks: 4 },
    { member: 'P Jayesh', shift: ['3-Night'], weekend: ['Sat-Sun'] },
    { member: 'Viral', shift: ['3-Night'], weekend: ['Mon-Tue'] },
    { member: 'Vivek', shift: ['3-Night'], weekend: ['Wed-Thu'] },
    { member: 'Nilam', shift: ['4-DayTime'], weekend: ['SunOnly', 'Sat-Sun'] },
    { member: 'Raj', shift: ['4-DayTime'], weekend: ['SunOnly', 'Sat-Sun'] },
  ];
}

function getLeaves() {
  return [
    { name: 'Jay', leaveDate: '2023-11-03' },
    { name: 'Jay', leaveDate: '2023-11-04' },
    { name: 'Jay', leaveDate: '2023-11-05' },
    { name: 'Priyen', leaveDate: '2023-11-15' },
    { name: 'Vedant', leaveDate: '2023-11-15' },
  ];
}

function getResources() {
  var resources = [];
  var assignments = getAssignments();
  var shifts = getShifts();
  shifts.forEach((shift) => {
    var members = assignments.filter(a => a.shift.includes(shift.name)).map(b => b.member);
    members.forEach((member) => {
      resources.push({ id: shift.name, member: member});
    });
  });
  return resources;
}

function getEventTemplates() {
  var eventTemplates = [];
  var shifts = getShifts();
  var members = getMembers();
  var leaves = getLeaves();
  var weekends = getWeekends();
  var assignments = getAssignments();
  assignments.forEach((assignment) => {
    var member = members.filter(m => m.name === assignment.member)[0];
    var shift = shifts.filter(s => s.name === assignment.shift[0])[0];
    if (member && member.active === 1) {
      eventTemplates.push({
        member: member,
        shift: shift,
        weekend: assignment.weekend ? assignment.weekend.map(w => weekends.filter(f => f.name == w).map(m => m.weekend).flat()) : null,
        rotateWeeks: assignment.rotateWeeks ? assignment.rotateWeeks : null,
        leaves: leaves.filter(l => l.name === member.name).map(l => l.leaveDate)
      });
    }
  });
  return eventTemplates;
}

var events = null;
function getEvents()
{
  events = [];
  var eventTemplates = getEventTemplates();
  //console.log(eventTemplates);

  eventTemplates.forEach((template) => {
    // console.log(template);

    var daysCounter = 1;
    var loop = new Date(calendarStart);
    while (loop <= calendarEnd) {
      var onLeave = template.leaves.includes(loop.getFullYear() + '-' + ("0" + (loop.getMonth() + 1)).slice(-2) + '-' + ("0" + loop.getDate()).slice(-2));

      if (template.rotateWeeks && template.weekend && template.weekend.length > 1) {
        if ((daysCounter % (template.rotateWeeks * 7)) == 0) {
          //console.log('rotated the weekend... old weekend : ' + template.weekend[0] + ", new weekend : " + template.weekend[1]);
          template.weekend.push(template.weekend.shift());
        }
      }

      if (template.shift.name == '4-DayTime') {
        // rotate weekend such that first Saturday of the month is working...
        var first_week = loop.getDate();
        var the_day = loop.getDay();
        if(the_day == 6)  // is this Saturday?
        {
          if (first_week <= 7) {  // first Saturday of the month
            //console.log('first saturday of the month...');
            template.weekend = [[0],[6,0]];
          }
          else {  // second/third/fourth/fifth Saturday of the month
            template.weekend.push(template.weekend.shift());
          }
        }
      }

      if (!template.weekend[0].includes(loop.getDay())) {
        //console.log("loop : " + loop + ", daysCounter : " + daysCounter);
        events.push({
          resourceId: template.shift.name,
          member: template.member.name,
          shift: template.shift.name,
          onLeave: onLeave,
          title: template.member.name + " (" + (onLeave ? "On Leave" : template.shift.name) + ")",
          start: loop.getFullYear() + '-' + ("0" + (loop.getMonth() + 1)).slice(-2) + '-' + ("0" + loop.getDate()).slice(-2) + template.shift.start,
          end: loop.getFullYear() + '-' + ("0" + (loop.getMonth() + 1)).slice(-2) + '-' + ("0" + (loop.getDate().valueOf() + (template.shift.name === '3-Night' ? 1 : 0))).slice(-2) + template.shift.end,
          backgroundColor: onLeave ? "#555555" : template.member.backgroundColor,
          textColor: onLeave ? "#ffffff" : template.member.textColor
        });
      }

      var newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
      daysCounter++;
    }
  });

  return events;
}
