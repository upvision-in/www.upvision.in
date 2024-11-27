function getHolidays() {
  return [
    { date: '2024-01-14', name: 'Uttarayan',        description: 'Kite Flying Festival',       wiki: 'https://en.wikipedia.org/wiki/Uttarayana' },
    { date: '2024-01-26', name: 'Republic Day',                                                wiki: 'https://en.wikipedia.org/wiki/Republic_Day_(India)' },
    { date: '2024-03-25', name: 'Holi Dhuleti',     description: 'Festival of Colors',         wiki: 'https://en.wikipedia.org/wiki/Holi' },
    { date: '2024-08-15', name: 'Independence Day',                                            wiki: 'https://en.wikipedia.org/wiki/Independence_Day_(India)' },
    { date: '2024-08-19', name: 'Rakshabandhan',                                               wiki: 'https://en.wikipedia.org/wiki/Raksha_Bandhan' },
    { date: '2024-08-26', name: 'Janmashtami',                                                 wiki: 'https://en.wikipedia.org/wiki/Krishna_Janmashtami' },
    { date: '2024-10-12', name: 'Dusshera',                                                    wiki: 'https://en.wikipedia.org/wiki/Vijayadashami' },
    { date: '2024-10-31', name: 'Diwali',           description: 'Festival of Lights',         wiki: 'https://en.wikipedia.org/wiki/Diwali' },
    { date: '2024-11-02', name: 'New Year (India)',                                            wiki: 'https://en.wikipedia.org/wiki/Indian_New_Year%27s_days' },
    { date: '2024-11-03', name: 'Bhai Dooj',        description: 'Day after New Year (India)', wiki: 'https://en.wikipedia.org/wiki/Bhai_Dooj' },
    { date: '2025-01-14', name: 'Uttarayan',        description: 'Kite Flying Festival',       wiki: 'https://en.wikipedia.org/wiki/Uttarayana' },
    { date: '2025-01-26', name: 'Republic Day',                                                wiki: 'https://en.wikipedia.org/wiki/Republic_Day_(India)' },
    { date: '2025-03-14', name: 'Holi Dhuleti',     description: 'Festival of Colors',         wiki: 'https://en.wikipedia.org/wiki/Holi' },
    { date: '2025-08-09', name: 'Rakshabandhan',                                               wiki: 'https://en.wikipedia.org/wiki/Raksha_Bandhan' },
    { date: '2025-08-15', name: 'Independence Day',                                            wiki: 'https://en.wikipedia.org/wiki/Independence_Day_(India)' },
    { date: '2025-08-16', name: 'Janmashtami',                                                 wiki: 'https://en.wikipedia.org/wiki/Krishna_Janmashtami' },
    { date: '2025-10-02', name: 'Dusshera',                                                    wiki: 'https://en.wikipedia.org/wiki/Vijayadashami' },
    { date: '2025-10-20', name: 'Diwali',           description: 'Festival of Lights',         wiki: 'https://en.wikipedia.org/wiki/Diwali' },
    { date: '2025-10-22', name: 'New Year (India)',                                            wiki: 'https://en.wikipedia.org/wiki/Indian_New_Year%27s_days' },
    { date: '2025-10-23', name: 'Bhai Dooj',        description: 'Day after New Year (India)', wiki: 'https://en.wikipedia.org/wiki/Bhai_Dooj' },
    { date: '2026-01-14', name: 'Uttarayan',        description: 'Kite Flying Festival',       wiki: 'https://en.wikipedia.org/wiki/Uttarayana' },
    { date: '2026-01-26', name: 'Republic Day',                                                wiki: 'https://en.wikipedia.org/wiki/Republic_Day_(India)' },
  ];
}


// Utility - Find current financial year - Start
function getIndianFinancialYear() {
  const currentDate = new Date();  // Get the current date
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0 for January, so add 1
  const currentYear = currentDate.getFullYear();
  
  let startYear = currentYear;  // Financial year starts in April (Month 4)
  if (currentMonth < 4) {  // If the current month is before April (Jan, Feb, Mar), the financial year started last year
    startYear -= 1; // FY started in the previous year
  }

  let endYear = startYear + 1;  // The end year of the financial year is always the next year
  const endYearShort = endYear.toString().slice(-2);  // Extract the last two digits of the end year for the 'yy' format

  return {
    year: startYear,
    title: `FY ${startYear}-${endYearShort}`
  };
}
function getNextIndianFinancialYear(currentYear) {
  let startYear = currentYear + 1;  // startYear for the next financial year

  let endYear = startYear + 1;  // The end year of the financial year is always the next year
  const endYearShort = endYear.toString().slice(-2);  // Extract the last two digits of the end year for the 'yy' format
  
  return {
      year: startYear,
      title: `FY ${startYear}-${endYearShort}`
  };
}
// Utility - Find current financial year - Finish


// For Public Holidays - Start
function getPublicHolidays(year) {
  const holidays = getHolidays(); // Get all holidays
  return holidays.filter(holiday => {
    const holidayYear = new Date(holiday.date).getFullYear(); // Get the year of the holiday
    return holidayYear === year; // Filter holidays that match the given year
  });
}
// For Public Holidays - Finish


// For Public Holidays Internal - Start
function getPublicHolidaysForFinancialYear(year) {
  const holidays = getHolidays(); // Get all holidays
  const startDate = new Date(year, 3, 1); // 1st April of the given year (financial year start)
  const endDate = new Date(year + 1, 2, 31); // 31st March of the next year (financial year end)

  return holidays.filter(holiday => {
    const holidayDate = new Date(holiday.date); // Convert holiday date to Date object
    return holidayDate >= startDate && holidayDate <= endDate; // Filter holidays within the financial year range
  });
}
// For Public Holidays Internal - Finish


// Generate HTML - Start
function generateHolidaysHtmlTable(holidays) {
  let tableRows = ''; // Initialize an empty string for the table rows
  holidays.forEach(holiday => {
    tableRows += generateHolidayHtmlRow(holiday);
  });
  return `
    <table class="table">
        <thead>
            <tr>
                <th>Month</th>
                <th>Date</th>
                <th>Day</th>
                <th>Holiday</th>
            </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
    </table>
  `;
}

function generateHolidayHtmlRow(holiday) {
  const date = new Date(holiday.date);

  // Format the date in the desired format (e.g., "14-Jan-24")
  const formattedDate = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear().toString().slice(-2)}`;

  // Get the day of the week (e.g., "Sunday")
  const dayOfWeek = date.toLocaleString('default', { weekday: 'long' });

  // Generate the holiday description (if any) and the Wiki link
  const holidayDescription = holiday.description ? ` - ${holiday.description}` : '';
  const holidayLink = `<a class="wiki-link" href="${holiday.wiki}" target="/" data-toggle="tooltip" data-original-title="${holiday.name}">
    <i class="fa-brands fa-wikipedia-w" aria-hidden="true"></i>Read more<i class="fa-solid fa-up-right-from-square"></i></a>`;

  return `
    <tr>
      <td>${date.toLocaleString('default', { month: 'long' })}</td>
      <td>${formattedDate}</td>
      <td>${dayOfWeek}</td>
      <td>${holiday.name}${holidayDescription} &nbsp;&nbsp;&nbsp;&nbsp; ( ${holidayLink} )</td>
    </tr>
  `;
}
// Generate HTML - Finish


function generateYearlyHolidayFullCalendar(elementId, holidays, renderFinancialYear) {
  holidays.forEach(item => {
    item.display = 'background';
    item.backgroundColor = '#F9B633';
  });

  var calendarEl = document.getElementById(elementId);

  var calendar = new FullCalendar.Calendar(calendarEl, {
      headerToolbar: { left: '', center: '', right: '' },
      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
      timeZone: 'Asia/Kolkata',
      initialView: renderFinancialYear ? 'multiMonthFinancialYear' : 'multiMonthYear',
      initialDate: `${new Date(holidays[0].date).getFullYear()}-${renderFinancialYear ? '04' : '01'}-01`,
      multiMonthMinWidth: 225,
      multiMonthMaxColumns: 4,
      views: {
        multiMonthFinancialYear: {
          type: 'multiMonth',
          duration: { months: 12 }
        }
      },
      // datesSet: function(dateInfo) {
      //   console.log('datesSet called');
      //   console.log(dateInfo);
      // },
      // viewDidMount: function (info) {
      //   console.log('viewDidMount called');
      //   console.log(info);
      // },
      eventDidMount: function(info) {
        var options = {
          title: info.event._def.extendedProps.name + (info.event._def.extendedProps.description == undefined ? '' : ' - ' + info.event._def.extendedProps.description),
          placement: 'top',
          trigger: 'hover focus',
          container: 'body'
        };
        new bootstrap.Tooltip(info.el, options);

        // set tooltip on the day text as well...
        var anchorElement = info.el.parentElement.parentElement.parentElement.querySelector('.fc-daygrid-day-number');
        if (anchorElement) {
          new bootstrap.Tooltip(anchorElement, options);
        }
      },
      events: holidays
  });

  return calendar;
}
