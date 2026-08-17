/* =============================================================================
   Veritone team schedule — the single source of truth for who works when.

   Everything about people and their shifts is declared once in SCHEDULE_DATA
   below; every question the page asks is answered by a helper function
   underneath it. Onboarding someone, moving them between shifts, introducing a
   new shift type or recording a leave is a change to SCHEDULE_DATA and nothing
   else — no page markup, no rendering code.

   What deliberately does NOT live here:
     - Which timezones the page compares against. That list is about the
       audience, not the team (the team is entirely in India), so it stays in
       pages/veritone-schedule.html alongside the rest of the view.
     - Status wording, day/night band colours, layout, sizing. Presentation.
       This file answers questions; the page draws pictures.

   Depends on: moment + moment-timezone, and getHolidays() from
   assets/js/rota/holidays.js. Holidays are company-wide and shared with the
   public-holidays pages, so they keep their own file.
   ============================================================================= */

var SCHEDULE_DATA = {

    /* The zone every shift time below is expressed in. It travels with the
       times because '06:00' means nothing without it. */
    timezone: 'Asia/Kolkata',

    /* ---------------------------------------------------------------------
       The team, and the only thing that changes week to week. One row per
       person, no dates anywhere:

         joins    → add a row with their shift and weekly-off
         rotates  → change shiftId / weeklyOffId in place
         leaves   → delete the row

       There is deliberately no history. The board reads as though everyone has
       always been on their current shift, so the days either side of a change
       are drawn with the new one. That is the intended behaviour for a
       visualizer of who works when — not a scheduling record.

       `id` is what leaves reference; it never changes, so renaming someone is a
       one-field edit. Omit shiftId/weeklyOffId for someone who has joined but
       whose shift isn't agreed yet — they group under "Not scheduled".
       --------------------------------------------------------------------- */
    members: [
        { id: 'shital', name: 'Shital', shiftId: 'afternoon', weeklyOffId: 'sat-sun', team: 'NOC' },
        { id: 'priyen', name: 'Priyen', shiftId: 'afternoon', weeklyOffId: 'sat-sun', team: 'SwDevOps' },
        { id: 'ankit', name: 'Ankit', shiftId: 'morning', weeklyOffId: 'sun-mon', team: 'SwDevOps' },
        { id: 'vedant', name: 'Vedant', shiftId: 'night', weeklyOffId: 'sat-sun', team: 'CloudOps' },
        { id: 'viral', name: 'Viral', shiftId: 'morning', weeklyOffId: 'fri-sat', team: 'CloudOps' },
        { id: 'parag', name: 'Parag', shiftId: 'afternoon', weeklyOffId: 'fri-sat', team: 'CloudOps, NOC' },
        { id: 'h-jayesh', name: 'H Jayesh', shiftId: 'night', weeklyOffId: 'sun-mon', team: 'NOC' },
        { id: 'vivek', name: 'Vivek', shiftId: 'night', weeklyOffId: 'tue-wed', team: 'NOC' },
        { id: 'mayur', name: 'Mayur', shiftId: 'night', weeklyOffId: 'fri-sat', team: 'NOC' },
        { id: 'khush', name: 'Khush', shiftId: 'morning', weeklyOffId: 'sun-mon', team: 'NOC' },
        { id: 'hardik', name: 'Hardik', shiftId: 'afternoon', weeklyOffId: 'sat-sun', team: 'NOC' },
        { id: 'het', name: 'Het', shiftId: 'afternoon', weeklyOffId: 'sat-sun', team: 'NOC' },
        { id: 'ayush', name: 'Ayush', shiftId: 'afternoon', weeklyOffId: 'sun-mon', team: 'NOC' },
        { id: 'dhruvi', name: 'Dhruvi', shiftId: 'afternoon', weeklyOffId: 'sat-sun', team: 'OCI' },
        { id: 'yogin', name: 'Yogin', shiftId: 'afternoon', weeklyOffId: 'sat-sun', team: 'OCI' },
    ],

    /* ---------------------------------------------------------------------
       Display order for teams, wherever members are listed. Anything not named
       here sorts last, then alphabetically by its own team name. A member on
       several teams ranks by their highest-priority one — Parag on
       "CloudOps, NOC" sorts with CloudOps.
       --------------------------------------------------------------------- */
    teamOrder: ['SwDevOps', 'CloudOps', 'NOC'],

    /* ---------------------------------------------------------------------
       Shift catalog. Times are in SCHEDULE_DATA.timezone. `endTime` earlier
       than `startTime` means the shift crosses midnight.

       Order here is the order the legend lists them in — it's a key, so it reads
       however you find most natural. The boards ignore it: getShifts() sorts by
       start time, so lanes and timeline bars always run in clock order and a new
       shift slots itself into the right place automatically.

       A shift with nobody assigned to it costs nothing: it renders nowhere
       until an assignment row puts someone on it.
       --------------------------------------------------------------------- */
    shifts: [
        { id: 'morning', label: 'Morning shift', color: '#7FAF8A', startTime: '06:00', endTime: '15:00' },
        { id: 'regular', label: 'Regular shift', color: '#C9A227', startTime: '10:00', endTime: '19:00' },
        { id: 'afternoon', label: 'Afternoon shift', color: '#D97A5E', startTime: '12:30', endTime: '21:30' },
        { id: 'night', label: 'Night shift', color: '#4A5C9A', startTime: '21:30', endTime: '06:00' },
        { id: 'late-night', label: 'Late Night shift', color: '#6B4C6E', startTime: '15:00', endTime: '00:00' },
    ],

    /* ---------------------------------------------------------------------
       Weekly-off catalog. daysOff uses moment's day numbering: Sun=0 … Sat=6.
       --------------------------------------------------------------------- */
    weeklyOffPatterns: [
        { id: 'sat-sun', name: 'Saturday-Sunday', daysOff: [6, 0] },
        { id: 'fri-sat', name: 'Friday-Saturday', daysOff: [5, 6] },
        { id: 'sun-mon', name: 'Sunday-Monday', daysOff: [0, 1] },
        { id: 'tue-wed', name: 'Tuesday-Wednesday', daysOff: [2, 3] },
    ],

    /* ---------------------------------------------------------------------
       Leaves. `to` is optional and inclusive — omit it for a single day.
       `reason` is optional and unused by the board today.

         { memberId: 'ankit', from: '2026-08-20' }
         { memberId: 'ankit', from: '2026-08-20', to: '2026-08-22' }

       Rows belonging to someone who has since left are inert — nothing matches
       them — so there is no need to prune them when you delete a member.

       Company-wide holidays are NOT listed here — those come from
       holidays.js and apply to everyone automatically.
       --------------------------------------------------------------------- */
    leaves: [
    ],
};


/* =============================================================================
   Lookups over the catalogs
   ============================================================================= */

function getScheduleTimezone() {
    return SCHEDULE_DATA.timezone;
}

function getScheduleToday() {
    return moment.tz(SCHEDULE_DATA.timezone).format('YYYY-MM-DD');
}

// Everyone currently on the team, in declaration order. Someone who has left is
// simply not in the array.
function getMembers() {
    return SCHEDULE_DATA.members.slice();
}

function getMember(memberId) {
    return SCHEDULE_DATA.members.filter(function (m) { return m.id === memberId; })[0] || null;
}

// `team` is written as a plain string, comma-separated when someone sits on
// more than one ("CloudOps, NOC"). Handed to the page as an array so it can
// decide whether that's two pills or one line.
function parseTeams(team) {
    if (!team) { return []; }
    return team.split(',').map(function (name) { return name.trim(); })
        .filter(function (name) { return name.length; });
}

// Shifts in the order a day actually runs, not catalog order.
function getShifts() {
    return SCHEDULE_DATA.shifts.slice().sort(function (a, b) {
        return a.startTime < b.startTime ? -1 : (a.startTime > b.startTime ? 1 : 0);
    });
}

function getShift(shiftId) {
    return SCHEDULE_DATA.shifts.filter(function (s) { return s.id === shiftId; })[0] || null;
}

// A member's shift, or null when they have none OR when the id they carry
// doesn't resolve. The second case matters: a single mistyped shiftId used to
// reach getShiftInstantsOn() with a null shift and take the whole page down with
// a TypeError. Treating it as "not scheduled" degrades to one visibly-wrong row
// instead, and validateScheduleData() still names the typo in the console.
function getMemberShift(member) {
    return member && member.shiftId ? getShift(member.shiftId) : null;
}

function getWeeklyOffPattern(patternId) {
    return SCHEDULE_DATA.weeklyOffPatterns.filter(function (p) { return p.id === patternId; })[0] || null;
}

// Only the shifts somebody is actually on, in day order. Everything driven off
// this — the roster lanes and the shift bars in the timezone chart — stays
// quiet until someone is put on a shift, so an unused catalog entry costs no
// space.
function getShiftsInUse() {
    var inUse = {};
    SCHEDULE_DATA.members.forEach(function (member) {
        if (member.shiftId) { inUse[member.shiftId] = true; }
    });
    return getShifts().filter(function (shift) { return inUse[shift.id]; });
}

// The team a member is listed under: their highest-priority one, so somebody on
// two teams sits with the more senior of them rather than forming a run of one.
function getPrimaryTeam(teams) {
    if (!teams || !teams.length) { return ''; }

    var order = SCHEDULE_DATA.teamOrder || [];
    var best = teams[0];
    var bestRank = Infinity;

    teams.forEach(function (team) {
        var rank = order.indexOf(team);
        if (rank === -1) { rank = order.length; }
        if (rank < bestRank) { bestRank = rank; best = team; }
    });

    return best;
}

function getTeamRank(teams) {
    var order = SCHEDULE_DATA.teamOrder || [];
    var rank = order.indexOf(getPrimaryTeam(teams));
    return rank === -1 ? order.length : rank;
}

// Every team in display order: the ones named in teamOrder, then any others
// found on members, alphabetically. Gives the page a stable index per team to
// hang a colour off, so a new team gets one without being registered anywhere.
function getAllTeams() {
    var order = SCHEDULE_DATA.teamOrder || [];
    var extras = [];

    SCHEDULE_DATA.members.forEach(function (member) {
        parseTeams(member.team).forEach(function (team) {
            if (order.indexOf(team) === -1 && extras.indexOf(team) === -1) { extras.push(team); }
        });
    });

    return order.concat(extras.sort());
}

// Whoever is working right now first, then by team. Used wherever members are
// listed together, so "who is on" survives the team grouping.
function compareByStatusThenTeam(a, b) {
    var aActive = a.status === 'active';
    var bActive = b.status === 'active';
    if (aActive !== bActive) { return aActive ? -1 : 1; }
    return compareByTeam(a, b);
}

// Sort comparator for anywhere members are listed together: teamOrder first,
// then unlisted teams alphabetically among themselves, then name.
function compareByTeam(a, b) {
    var rankDiff = getTeamRank(a.teams) - getTeamRank(b.teams);
    if (rankDiff !== 0) { return rankDiff; }

    var teamDiff = getPrimaryTeam(a.teams).localeCompare(getPrimaryTeam(b.teams));
    if (teamDiff !== 0) { return teamDiff; }

    return a.name.localeCompare(b.name);
}

// The longest anyone normally waits for a shift to begin: the biggest gap
// between consecutive start times among the shifts in use, wrapping midnight.
// Today's three shifts (06:00 / 12:30 / 21:30) give 9h; add late-night at 15:00
// and it becomes 8.5h on its own. Derived rather than hand-picked so it stays
// honest when the rotation changes.
function getLongestGapBetweenShiftStarts() {
    var DAY = 24 * 60 * 60 * 1000;
    var starts = getShiftsInUse()
        .map(function (shift) { return timeOfDayMs(shift.startTime); })
        .sort(function (a, b) { return a - b; });

    if (starts.length < 2) { return DAY; }

    var longest = DAY - starts[starts.length - 1] + starts[0];
    for (var i = 1; i < starts.length; i++) {
        longest = Math.max(longest, starts[i] - starts[i - 1]);
    }
    return longest;
}

function timeOfDayMs(timeStr) {
    var parts = timeStr.split(':');
    return (Number(parts[0]) * 60 + Number(parts[1])) * 60 * 1000;
}

// Compact hour label for a shift: "6a–3p", "12:30p–9:30p", "3p–12a". Derived
// rather than stored — a hand-written copy is the one field in this whole file
// that could silently disagree with the times above it. An en dash rather than
// "to": it is the correct form for a range, and it buys back the width that
// keeps the legend on one line.
function formatShiftHours(shiftId) {
    var shift = getShift(shiftId);
    if (!shift) { return ''; }
    return formatShiftClock(shift.startTime) + '\u2013' + formatShiftClock(shift.endTime);
}

function formatShiftClock(timeStr) {
    var at = moment(timeStr, 'HH:mm');
    var meridiem = at.format('a').charAt(0);
    return (at.minutes() === 0 ? at.format('h') : at.format('h:mm')) + meridiem;
}


/* =============================================================================
   Resolution — what a given calendar day looks like for someone
   ============================================================================= */

function getHolidayOn(dateStr) {
    return getHolidays().filter(function (h) { return h.date === dateStr; })[0] || null;
}

function isOnLeave(memberId, dateStr) {
    return SCHEDULE_DATA.leaves.some(function (leave) {
        return leave.memberId === memberId
            && leave.from <= dateStr
            && dateStr <= (leave.to || leave.from);
    });
}

// What one calendar day is for one member, as raw facts:
//   { key: 'working' | 'off' | 'leave' | 'holiday' | 'not-scheduled',
//     shiftId: string | null, holidayName: string | null }
// The page turns that into colours and wording — this function never does.
function getDayState(memberId, dateStr) {
    var member = getMember(memberId);
    if (!getMemberShift(member)) { return { key: 'not-scheduled', shiftId: null, holidayName: null }; }

    var holiday = getHolidayOn(dateStr);
    if (holiday) { return { key: 'holiday', shiftId: null, holidayName: holiday.name }; }
    if (isOnLeave(memberId, dateStr)) { return { key: 'leave', shiftId: null, holidayName: null }; }

    // A member with no weeklyOffId works all seven days. That's a data error
    // rather than a rendering decision, so it's drawn faithfully and left for
    // validateScheduleData() to call out.
    var dayOfWeek = moment.tz(dateStr, 'YYYY-MM-DD', SCHEDULE_DATA.timezone).day();
    var pattern = getWeeklyOffPattern(member.weeklyOffId);
    if (pattern && pattern.daysOff.indexOf(dayOfWeek) !== -1) {
        return { key: 'off', shiftId: null, holidayName: null };
    }

    return { key: 'working', shiftId: member.shiftId, holidayName: null };
}

// The start/end instants of one shift on one calendar date. `dateStr` is the
// date the shift BELONGS to — an overnight shift ends on the following day.
function getShiftInstantsOn(shiftId, dateStr) {
    var shift = getShift(shiftId);
    var tz = SCHEDULE_DATA.timezone;
    var start = moment.tz(dateStr + ' ' + shift.startTime, 'YYYY-MM-DD HH:mm', tz);
    var end = moment.tz(dateStr + ' ' + shift.endTime, 'YYYY-MM-DD HH:mm', tz);
    if (!end.isAfter(start)) { end.add(1, 'day'); }
    return { start: start, end: end, dateStr: dateStr };
}

// Which occurrence of a repeating shift counts as the "current" one: the one
// containing `now`, or failing that the soonest upcoming. Needed because an
// overnight shift that started yesterday is still the current one for the first
// few hours after midnight.
function resolveShiftDate(shiftId, now) {
    var tz = SCHEDULE_DATA.timezone;
    var candidates = [-1, 0, 1].map(function (offset) {
        return getShiftInstantsOn(shiftId, now.clone().tz(tz).add(offset, 'days').format('YYYY-MM-DD'));
    });

    var active = candidates.filter(function (c) { return now.isBetween(c.start, c.end, null, '[)'); })[0];
    if (active) { return active.dateStr; }

    var upcoming = candidates
        .filter(function (c) { return c.start.isAfter(now); })
        .sort(function (a, b) { return a.start.valueOf() - b.start.valueOf(); })[0];
    return (upcoming || candidates[1]).dateStr;
}


/* =============================================================================
   Lookahead / lookbehind
   ============================================================================= */

var SCHEDULE_SEARCH_DAYS = 14;

// This member's next real shift start, skipping weekly offs, leaves and
// holidays. Null if nothing turns up inside the search horizon.
function findNextShiftStart(memberId, now) {
    var tz = SCHEDULE_DATA.timezone;
    for (var offset = 0; offset <= SCHEDULE_SEARCH_DAYS; offset++) {
        var dateStr = now.clone().tz(tz).add(offset, 'days').format('YYYY-MM-DD');
        var state = getDayState(memberId, dateStr);
        if (state.key !== 'working') { continue; }

        var instants = getShiftInstantsOn(state.shiftId, dateStr);
        if (instants.start.isAfter(now)) { return instants.start; }
    }
    return null;
}

// The mirror, walking backwards: the most recent shift this member finished.
// Returns the end instant plus the date the shift BELONGS to — for an overnight
// shift those differ, and it's the start date that identifies the shift.
function findLastShift(memberId, now) {
    var tz = SCHEDULE_DATA.timezone;
    for (var offset = 0; offset <= SCHEDULE_SEARCH_DAYS; offset++) {
        var dateStr = now.clone().tz(tz).subtract(offset, 'days').format('YYYY-MM-DD');
        var state = getDayState(memberId, dateStr);
        if (state.key !== 'working') { continue; }

        var instants = getShiftInstantsOn(state.shiftId, dateStr);
        if (instants.end.isSameOrBefore(now)) { return { end: instants.end, dateStr: dateStr }; }
    }
    return null;
}


/* =============================================================================
   The roster — one call the page makes to get everything it renders
   ============================================================================= */

/*
 * getRoster(now) returns:
 * {
 *   asOf: "<ISO 8601 UTC timestamp>",
 *   timezone: "<IANA zone the shift times are defined in>",
 *   members: [
 *     {
 *       id, name,
 *       shiftId:    "matches a shifts[] id, or null when not scheduled",
 *       weeklyOffId:"matches a weeklyOffPatterns[] id, or null",
 *       shiftDate:  "YYYY-MM-DD — the occurrence that counts as current, or null",
 *       shift:      { start, end, dateStr } moments for that occurrence, or null,
 *       status:     "active|upcoming|off|weekend|leave|holiday|not-scheduled",
 *       lastShift:  { end, dateStr } | null,
 *       nextStart:  moment | null
 *     }
 *   ]
 * }
 *
 * Members come back sorted: whoever is working right now first, then by how
 * soon they are next on, then alphabetically. Grouping the result by shiftId
 * preserves that order inside each group.
 *
 * Swap the body for a fetch() against a real endpoint later — same shape.
 */
function getRoster(now) {
    var reference = now || moment();

    var members = getMembers().map(function (member) {
        var entry = {
            id: member.id,
            name: member.name,
            teams: parseTeams(member.team),
            shiftId: member.shiftId || null,
            weeklyOffId: member.weeklyOffId || null,
            shiftDate: null,
            shift: null,
            status: 'not-scheduled',
            lastShift: findLastShift(member.id, reference),
            nextStart: findNextShiftStart(member.id, reference),
        };

        if (getMemberShift(member)) {
            entry.shiftDate = resolveShiftDate(member.shiftId, reference);
            entry.shift = getShiftInstantsOn(member.shiftId, entry.shiftDate);
            entry.status = resolveMemberStatus(member, entry, reference);
        }

        return entry;
    });

    members.sort(function (a, b) {
        var aActive = a.status === 'active';
        var bActive = b.status === 'active';
        if (aActive !== bActive) { return aActive ? -1 : 1; }
        if (!aActive) {
            if (a.nextStart && b.nextStart) {
                var diff = a.nextStart.valueOf() - b.nextStart.valueOf();
                if (diff !== 0) { return diff; }
            } else if (a.nextStart) {
                return -1;
            } else if (b.nextStart) {
                return 1;
            }
        }
        return a.name.localeCompare(b.name);
    });

    return {
        asOf: moment.utc().toISOString(),
        timezone: SCHEDULE_DATA.timezone,
        members: members,
    };
}

// Which calendar day "are they off?" is a question about depends on whether the
// person is actually mid-shift:
//
//   mid-shift  → the day the shift BELONGS to. An overnight shift that began on
//                a working day must not flip to "weekend" when the clock crosses
//                midnight into a non-working one.
//   otherwise  → simply today. Once a shift has ended, whether someone is off is
//                a question about the day they are standing in, not about their
//                next occurrence — resolveShiftDate() has by then rolled forward
//                to tomorrow, and judging them by tomorrow reported an afternoon
//                person as "off shift" on the very Sunday they were off.
function resolveMemberStatus(member, entry, now) {
    var midShift = now.isBetween(entry.shift.start, entry.shift.end, null, '[)');
    var dateStr = midShift
        ? entry.shiftDate
        : now.clone().tz(SCHEDULE_DATA.timezone).format('YYYY-MM-DD');

    if (getHolidayOn(dateStr)) { return 'holiday'; }
    if (isOnLeave(member.id, dateStr)) { return 'leave'; }

    var dayOfWeek = moment.tz(dateStr, 'YYYY-MM-DD', SCHEDULE_DATA.timezone).day();
    var pattern = getWeeklyOffPattern(member.weeklyOffId);
    if (pattern && pattern.daysOff.indexOf(dayOfWeek) !== -1) { return 'weekend'; }

    if (midShift) { return 'active'; }

    // Compare in seconds, not moment's truncated-to-integer minutes — otherwise
    // the last under-a-minute stretch before a shift starts rounds down to 0,
    // fails the "> 0" check and incorrectly falls through to 'off'.
    var secondsToStart = entry.shift.start.diff(now, 'seconds');
    if (secondsToStart > 0 && secondsToStart <= 3600) { return 'upcoming'; }

    return 'off';
}


/* =============================================================================
   Holidays — sourced from holidays.js, which stays shared with the
   public-holidays pages. Returned raw; the page decides how to format them.
   ============================================================================= */

// `fromDateStr` defaults to today, but the page passes the instant it is
// currently showing — viewing December and being told about August's holidays
// would be the one part of the board still answering for real now.
function getUpcomingHolidays(count, fromDateStr) {
    var from = fromDateStr || getScheduleToday();
    return getHolidays()
        .filter(function (h) { return h.date >= from; })
        .sort(function (a, b) { return a.date < b.date ? -1 : 1; })
        .slice(0, count);
}


/* =============================================================================
   Validation

   Hand-edited data fails silently: a mistyped shiftId doesn't throw, it just
   quietly drops someone into "Not scheduled" and nobody notices for a week.
   Call this once on page load and read the console. Returns an array of problem
   strings (empty means clean).

   The board always renders exactly what the data says — this reports, it never
   corrects. A member missing weeklyOffId genuinely works seven days on screen;
   that's the signal to come and fix the data.
   ============================================================================= */

function validateScheduleData() {
    var problems = [];
    var seenMemberIds = {};

    SCHEDULE_DATA.members.forEach(function (member, i) {
        var where = 'members[' + i + '] (' + (member.id || '?') + ')';

        if (!member.id) { problems.push(where + ' has no id'); }
        if (seenMemberIds[member.id]) { problems.push('Duplicate member id: ' + member.id); }
        seenMemberIds[member.id] = true;

        if (member.shiftId && !getShift(member.shiftId)) {
            problems.push(where + ' references unknown shiftId: ' + member.shiftId);
        }
        if (member.weeklyOffId && !getWeeklyOffPattern(member.weeklyOffId)) {
            problems.push(where + ' references unknown weeklyOffId: ' + member.weeklyOffId);
        }
        // Half-filled row: on a shift but with no days off, so they render as
        // working all seven days.
        if (member.shiftId && !member.weeklyOffId) {
            problems.push(where + ' is on a shift but has no weeklyOffId — will show as working every day');
        }
    });

    SCHEDULE_DATA.leaves.forEach(function (leave, i) {
        var where = 'leaves[' + i + ']';
        if (!leave.from) { problems.push(where + ' has no `from` date'); }
        if (leave.to && leave.to < leave.from) { problems.push(where + ' ends before it starts'); }
        // memberId isn't checked: leaves belonging to someone who has left are
        // inert and don't need pruning.
    });

    if (problems.length && window.console) {
        console.warn('[veritone-schedule] ' + problems.length + ' data problem(s):\n  ' + problems.join('\n  '));
    }
    return problems;
}
