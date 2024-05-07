import argparse
import datetime
import enum
import json
import os
import re
import sys
import string
import types


def getExecutingAssemblyPath():
    absolute_path = os.path.abspath(__file__)  # get the absolute path of the executing code    
    return os.path.dirname(absolute_path) + '\\'


DATE_FORMAT = '%Y-%m-%d'
PATH_TO_TEAM_DIRECTORY = getExecutingAssemblyPath()
PATH_TO_TEAM_MEMBER_TEMPLATE = getExecutingAssemblyPath() + '_member.template'
PATH_TO_TEAM_MEMBERS_DIRECTORY = getExecutingAssemblyPath() + 'members\\'

MEMBERS_JS_FILENAME = 'members.js'
PATH_TO_TEAM_MEMBERS_JAVASCRIPT = getExecutingAssemblyPath() + MEMBERS_JS_FILENAME


class CalendarEvent:
    def __init__(self, date, shift):
        self.date = date
        self.shift = shift

    def toString(self):
        return 'Caledar Event - date: {}, shift: {}'\
               .format(self.date, self.shift)


class LogLevel(enum.Enum):
    Info = 1
    Warning = 2
    Error = 3
    Verbose = 4


def setupArgParse():
    parser = argparse.ArgumentParser(prog='rota-helper',
                                     formatter_class=argparse.ArgumentDefaultsHelpFormatter,
                                     description='Generate Team Calendar.',
                                     epilog='Use the program to manage fullcalendar events for the team!')
    parser.add_argument('-n', '--name', nargs=1, metavar=('Name'), required=True, default=argparse.SUPPRESS, help='Name of the team member')
    parser.add_argument('-o', '--operation', choices=['add', 'remove'], default='add', required=True, help='Operation to perform. Add/Remove days to/from the team member')
    parser.add_argument('-i', '--shift', choices=['1-Morning', '2-Afternoon', '3-Night'], help='Shift working on')
    parser.add_argument('-l', '--algorithm', choices=['1-Basic', '2-Rotation'], help='Algorithm to use to (1-Basic will add 5 days and then skip 2 days for weekend, 2-Rotation will use shift rotation mechanism)')
    parser.add_argument('-r', '--rotateWeeks', type=int, default=4, help='Weeks to work before rotating the weekends (Weekends to rotate : Fri-Sat, Sun-Mon, Tue-Wed)')
    parser.add_argument('-w', '--firstWeekend', choices=['fri-sat', 'sun-mon', 'tue-wed'], help='First weekend to begin with (Weekends : Fri-Sat, Sun-Mon, Tue-Wed)')
    parser.add_argument('-s', '--start', required=True, help='Start date for the operation')
    parser.add_argument('-f', '--finish', required=True, help='Finish date for the operation')
    parser.add_argument('-c', '--cleanHistory', action='store_true', help='Clean records from the past')  # the flag prevents accidental removal of historical records
    parser.add_argument('-v', '--verbose', action='store_true')  # on/off flag
    args = parser.parse_args()
    if args.operation == 'add':
        if not args.shift:
            parser.error('the following arguments are required: -i/--shift')
        elif not args.algorithm:
            parser.error('the following arguments are required: -l/--algorithm')
        else:
            if args.algorithm == '2-Rotation':
                if not args.rotateWeeks:
                    parser.error('the following arguments are required: -r/--rotateWeeks')
                if not args.firstWeekend:
                    parser.error('the following arguments are required: -w/--firstWeekend')
                else:
                    return args
            else:
                return args
    else:
        return args


def howToUse():
    print('examples:')

    print('\tSee all the available options...')
    print('\t\tpython .\\assets\\js\\rota\\team\\_helper.py -h')

    print('\n\tAdd dates to Employee\'s calendar...')
    print('\t\tpython .\\assets\\js\\rota\\team\\_helper.py -n Employee -o add -i 1-Morning -l 1-Basic -s 2024-1-31 -f 2024-3-31')

    print('\n\tAdd dates to Employee\'s calendar...')
    print('\t\tpython .\\assets\\js\\rota\\team\\_helper.py -n Employee -o add -i 1-Morning -l 2-Rotation -r 4 -s 2024-1-31 -f 2024-3-31')

    print('\n\tRemove dates from Employee\'s calendar...')
    print('\t\tpython .\\assets\\js\\rota\\team\\_helper.py -n Employee -o remove -s 2024-3-1 -f 2024-3-31')

    print('\n\tRemove dates from Employee\'s calendar including older than today...')
    print('\t\tpython .\\assets\\js\\rota\\team\\_helper.py -n Employee -o remove -s 2024-3-1 -f 2024-3-31 -c')


def logMessage(args, logLevel, message):
    printMessage = False
    if logLevel == LogLevel.Verbose:
        if args != None and args.verbose == True:
            printMessage = True
    else:
        printMessage = True
    if printMessage == True:
        print('{} : {}'.format(logLevel, message))


def readCalendarEvents(args):
    memberName = args.name[0].replace(" ", "")  # remove spaces from the name
    filePathTeamMember = PATH_TO_TEAM_MEMBERS_DIRECTORY + memberName + '.js'
    if os.path.exists(filePathTeamMember):
        with open(filePathTeamMember, 'r') as f:
            fileContents = f.read()
            indexListStart = fileContents.index('[')
            indexListEnd = fileContents.index(']') + 1
            listContents = fileContents[indexListStart:indexListEnd].strip()
            listContents = formatStringForJsToJson(listContents)
            list = json.loads(listContents, object_hook=lambda d: types.SimpleNamespace(**d))
            calendarEventList = []
            for item in list:
                calendarEventList.append(CalendarEvent(item.date, item.shift))
            logMessage(args, LogLevel.Verbose, 'Read Calendar Events. Total : {}'.format(len(calendarEventList)))
            return calendarEventList
    return []


def formatStringForJsToJson(input):
    output = input.replace('\'', '"')  # replace singlequotes with doublequotes
    # wrap the key with doublequote
    matches = list(re.finditer(r'(\w+):', output))
    matches.reverse()
    for match in matches:
        output = output[:match.end()-1] + '"' + output[match.end()-1:]
        output = output[:match.start()] + '"' + output[match.start():]
    # remove the last comma...
    needToRemoveLastComma = re.findall('},]', re.sub(r'[\n\t\s]*', '', output))
    if len(needToRemoveLastComma) > 0:
        matches = list(re.finditer(r'},', output))
        matches.reverse()
        output = output[:matches[0].end()-1] + output[matches[0].end()+1:]
    return output


def writeCalendarEvents(args, calendarEventList):
    memberName = args.name[0].replace(" ", "")  # remove spaces from the name
    filePathTeamMember = PATH_TO_TEAM_MEMBERS_DIRECTORY + memberName + '.js'
    d = {
        'functionName': 'getCalendarEventsFor' + memberName,
        'calendarEventList': json.dumps([event.__dict__ for event in calendarEventList])
    }
    with open(PATH_TO_TEAM_MEMBER_TEMPLATE, 'r') as f:
        src = string.Template(f.read())
        result = src.substitute(d)
        formatResult(result)
        with open(filePathTeamMember, 'w') as w:
            w.write(formatResult(result))
            logMessage(args, LogLevel.Verbose, 'Wrote Calendar Events. Total : {}'.format(len(calendarEventList)))
    refreshMembersJS(args)


def formatResult(result):
    formattedResult = result.replace('"', '\'')  # replace doublequotes with singlequotes
    # remove singlequotes from the keys
    matches = list(re.finditer(r'([\w\']+):', formattedResult))
    matches.reverse()
    for match in matches:
        formattedResult = formattedResult[:match.end()-2] + formattedResult[match.end()-1:]
        formattedResult = formattedResult[:match.start()] + formattedResult[match.start()+1:]
    # apply newlines where needed
    formattedResult = formattedResult.replace('[{', '[\n    { ')
    formattedResult = formattedResult.replace('}, {', ' },\n    { ')
    formattedResult = formattedResult.replace('}];', ' },\n  ];')
    return formattedResult


def addEvents(args, list):
    resultList = list.copy()
    startDate = datetime.datetime.strptime(args.start, DATE_FORMAT)
    finishDate = datetime.datetime.strptime(args.finish, DATE_FORMAT)

    if args.algorithm == '1-Basic':
        currentDate = startDate
        daysInThisWeek = 0
        while currentDate <= finishDate:
            if (isDateAdded(currentDate, list)) == False:
                #if currentDate.weekday() < 5:  # not a Saturday and Sunday
                if daysInThisWeek < 5:
                    newEvent = CalendarEvent(currentDate.strftime(DATE_FORMAT), args.shift)
                    logMessage(args, LogLevel.Verbose, 'adding event : {}'.format(newEvent.toString()))
                    resultList.append(newEvent)
                elif daysInThisWeek > 5:
                    daysInThisWeek = -1  # -1 so it gets reset to 0 for new week to start...
            currentDate += datetime.timedelta(days=1)
            daysInThisWeek += 1
    elif args.algorithm == '2-Rotation':
        weekends = []  # 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
        if args.firstWeekend == 'fri-sat':
            weekends = [[4,5],[6,0],[1,2]]
        elif args.firstWeekend == 'sun-mon':
            weekends = [[6,0],[1,2],[4,5]]
        elif args.firstWeekend == 'tue-wed':
            weekends = [[1,2],[4,5],[6,0]]
        
        if len(weekends) > 0:  # don't process if the input is not appropriate...
            currentDate = startDate
            daysCounter = calculateDaysCounter(args, startDate, weekends[0])
            while currentDate <= finishDate:
                #if (daysCounter % (args.rotateWeeks * 7) == 0):
                if currentDate.weekday() == 1 and (daysCounter % (args.rotateWeeks * 7) == 0):  # Today is the 4th+1 Tuesday - time to rotate weekends
                    weekends.append(weekends.pop(0))  # rotate weekends

                if (isDateAdded(currentDate, list)) == False:
                    if not currentDate.weekday() in weekends[0]:
                        newEvent = CalendarEvent(currentDate.strftime(DATE_FORMAT), args.shift)
                        logMessage(args, LogLevel.Verbose, 'adding event : {}'.format(newEvent.toString()))
                        resultList.append(newEvent)

                currentDate += datetime.timedelta(days=1)
                daysCounter += 1
    
    logMessage(args, LogLevel.Info, 'Add Events - Total {} events added'.format(len(resultList) - len(list)))
    writeCalendarEvents(args, resultList)


def calculateDaysCounter(args, startDate, startWeekend):
    # 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri, 5=Sat, 6=Sun
    # Critical : Our week starts on Tuesday and ends on Monday
    # Weekend Tue-Wed : Tue(O)-Wed(O)-Thu-Fri-Sat-Sun-Mon
    # Weekend Fri-Sat : Tue-Wed-Thu-Fri(O)-Sat(O)-Sun-Mon
    # Weekend Sun-Mon : Tue-Wed-Thu-Fri-Sat-Sun(O)-Mon(O)
    startDate_index = startDate.weekday()
    startWeekend_index = startWeekend[0]

    if startDate_index == 0:  # Mon - last day of the week
        return 6  # we will jump the counter to 6 as this is the last day of our work week
    else:
        return startDate_index - 1  # subtracted 1 to move our zero based week index to Tuesday instead of Monday


def isDateAdded(date, list):
    for event in list:
        eventDate = datetime.datetime.strptime(event.date, DATE_FORMAT)
        if date == eventDate:
            return True
    return False


def removeEvents(args, list):
    resultList = []
    startDate = datetime.datetime.strptime(args.start, DATE_FORMAT)
    finishDate = datetime.datetime.strptime(args.finish, DATE_FORMAT)
    for event in list:
        if isInDateRange(args, event.date, startDate, finishDate) == False:
            resultList.append(event)
        elif preserveDateFromPast(args, event.date) == True:
            resultList.append(event)
        else:
            logMessage(args, LogLevel.Verbose, 'removing event : {}'.format(event.toString()))
    logMessage(args, LogLevel.Info, 'Remove Events - Total {} events removed'.format(len(list) - len(resultList)))
    writeCalendarEvents(args, resultList)


def isInDateRange(args, date, startDate, finishDate):
    inputDate = datetime.datetime.strptime(date, DATE_FORMAT)
    return startDate <= inputDate <= finishDate


def preserveDateFromPast(args, date):
    if args.cleanHistory:
        return False
    else:
        today = datetime.datetime.today().date()
        eventDate = datetime.datetime.strptime(date, DATE_FORMAT).date()
        return today > eventDate


def refreshMembersJS(args):
    with open(PATH_TO_TEAM_MEMBERS_JAVASCRIPT, 'w') as w:
        files = ['\'' + f + '\'' for f in os.listdir(PATH_TO_TEAM_MEMBERS_DIRECTORY) if os.path.isfile(PATH_TO_TEAM_MEMBERS_DIRECTORY + '/' + f) and f.endswith('.js') and f != MEMBERS_JS_FILENAME]
        w.write('function getMemberNames() {{ return [{}]; }}\n'.format(', '.join(files).replace('.js','')))
        for f in files:
            with open(PATH_TO_TEAM_MEMBERS_DIRECTORY + f.replace('\'', ''), 'r') as r:
                w.write('\n\n' + r.read())
        logMessage(args, LogLevel.Verbose, 'Wrote MembersJS.')


# Generate calendar events based on the parameters supplied...
def main():
    args = None
    try:
        args = setupArgParse()
        logMessage(args, LogLevel.Verbose, 'Arguments : {}'.format(args))
        list = readCalendarEvents(args)
        if args.operation == 'add':
            addEvents(args, list)
        elif args.operation == 'remove':
            removeEvents(args, list)
    except:
        exc_type, exc_value, exc_traceback = sys.exc_info()
        if not (exc_type == SystemExit and exc_value.code == 0):
            logMessage(args, LogLevel.Error, "An exception occurred. Exception Type : {}, Value : {}\nTraceback : {}".format(exc_type, exc_value, exc_traceback))
        howToUse();
    finally:
        logMessage(args, LogLevel.Verbose, '------------------- done -------------------')


# Finally... Run the program...
main()
