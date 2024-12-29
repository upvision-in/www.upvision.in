## The following commands are executed to build the team calendar

### Command Options

| Option              | Description                                                                                                                  | Choices                         |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| -n / --name         | Name of the team member                                                                                                      |                                 |
| -o / --operation    | Operation to perform. Add/Remove days to/from the team member                                                                | add, remove                     |
| -i / --shift        | Shift working on                                                                                                             | 1-Morning, 2-Afternoon, 3-Night |
| -l / --algorithm    | Algorithm to use to (1-Basic will add 5 days and then skip 2 days for weekend, 2-Rotation will use shift rotation mechanism) | 1-Basic, 2-Rotation             |
| -r / --rotateWeeks  | Weeks to work before rotating the weekends (Weekends to rotate : Fri-Sat, Sun-Mon, Tue-Wed), type=int, default=4             |                                 |
| -w / --firstWeekend | First weekend to begin with (Weekends : Fri-Sat, Sun-Mon, Tue-Wed)                                                           | fri-sat, sun-mon, tue-wed       |
| -s / --start        | Start date for the operation                                                                                                 |                                 |
| -f / --finish       | Finish date for the operation                                                                                                |                                 |
| -c / --cleanHistory | Clean records from the past. The flag prevents accidental removal of historical records                                      |                                 |
| -v / --verbose      | Show verbose logs                                                                                                            |                                 |

<br />

### Initial Schedule Setup - setup on 1-Nov-2023

```
python .\assets\js\rota\team\_helper.py -o add -l 2-Rotation -r 4 -w sun-mon -s 2023-11-1 -f 2024-12-31 -i 1-Morning -n Ankit
python .\assets\js\rota\team\_helper.py -o add -l 2-Rotation -r 4 -w fri-sat -s 2023-11-1 -f 2024-12-31 -i 1-Morning -n Jay
python .\assets\js\rota\team\_helper.py -o add -l 2-Rotation -r 4 -w tue-wed -s 2023-11-1 -f 2024-12-31 -i 1-Morning -n Vedant
python .\assets\js\rota\team\_helper.py -o add -l 2-Rotation -r 4 -w sun-mon -s 2023-11-1 -f 2024-12-31 -i 2-Afternoon -n Priyen
python .\assets\js\rota\team\_helper.py -o add -l 2-Rotation -r 4 -w fri-sat -s 2023-11-1 -f 2024-12-31 -i 2-Afternoon -n Shital
python .\assets\js\rota\team\_helper.py -o add -l 2-Rotation -r 4 -w tue-wed -s 2023-11-1 -f 2024-12-31 -i 2-Afternoon -n "Jayesh H"
python .\assets\js\rota\team\_helper.py -o add -i 3-Night -l 1-Basic -s 2023-10-30 -f 2024-12-31 -n "Jayesh P"
python .\assets\js\rota\team\_helper.py -o add -i 3-Night -l 1-Basic -s 2023-11-1 -f 2024-12-31 -n Viral
python .\assets\js\rota\team\_helper.py -o add -i 3-Night -l 1-Basic -s 2023-11-3 -f 2024-12-31 -n Vivek
```

<br />

**Notes**
- For night shift team, we manually adjusted the start date so that we don't have to specify the weekends for `1-Basic` algorithm
- Manually remove the entries for Jayesh P for 2023-10-30 and 2023-10-31 to keep the calendar start from 2023-11-1

<br />

### Rescheduled on 21-Apr-2024

Rescheduled for the following members
- Jay Bamaniya - switched from Morning to Night
- Jayesh Patel - switched from Night to Afternoon
- Jayesh Hadiya - switched from Afternoon to Morning

```
python .\assets\js\rota\team\_helper.py -o remove -s 2024-4-21 -f 2024-12-31 -c -n Jay
python .\assets\js\rota\team\_helper.py -o remove -s 2024-4-21 -f 2024-12-31 -c -n "Jayesh P"
python .\assets\js\rota\team\_helper.py -o remove -s 2024-4-21 -f 2024-12-31 -c -n "Jayesh H"

python .\assets\js\rota\team\_helper.py -o add -i 3-Night -l 1-Basic -s 2024-4-22 -f 2024-12-31 -n Jay
python .\assets\js\rota\team\_helper.py -o add -l 2-Rotation -r 4 -w fri-sat -s 2024-4-21 -f 2024-12-31 -i 1-Morning -n "Jayesh H"
python .\assets\js\rota\team\_helper.py -o add -l 2-Rotation -r 4 -w tue-wed -s 2024-4-21 -f 2024-12-31 -i 2-Afternoon -n "Jayesh P"
```

<br />

### Remove everything for a person

```
python .\assets\js\rota\team\_helper.py -o remove -s 2023-1-1 -f 2030-12-31 -c -n Ankit
python .\assets\js\rota\team\_helper.py -o remove -s 2023-1-1 -f 2030-12-31 -c -n Jay
python .\assets\js\rota\team\_helper.py -o remove -s 2023-1-1 -f 2030-12-31 -c -n Vedant
python .\assets\js\rota\team\_helper.py -o remove -s 2023-1-1 -f 2030-12-31 -c -n Priyen
python .\assets\js\rota\team\_helper.py -o remove -s 2023-1-1 -f 2030-12-31 -c -n Shital
python .\assets\js\rota\team\_helper.py -o remove -s 2023-1-1 -f 2030-12-31 -c -n "Jayesh H"
python .\assets\js\rota\team\_helper.py -o remove -s 2023-1-1 -f 2030-12-31 -c -n "Jayesh P"
python .\assets\js\rota\team\_helper.py -o remove -s 2023-1-1 -f 2030-12-31 -c -n Viral
python .\assets\js\rota\team\_helper.py -o remove -s 2023-1-1 -f 2030-12-31 -c -n Vivek
```

<br />

### Scheduled for year 2025

```
python .\assets\js\rota\team\_helper.py -n Ankit -o add -i 1-Morning -l 2-Rotation -w 'sun-mon' -r 4 -s 2024-12-25 -f 2025-12-31
python .\assets\js\rota\team\_helper.py -n Priyen -o add -i 1-Morning -l 2-Rotation -w 'fri-sat' -r 4 -s 2024-12-25 -f 2025-12-31
python .\assets\js\rota\team\_helper.py -n Jay -o add -i 2-Afternoon -l 2-Rotation -w 'sun-mon' -r 4 -s 2024-12-25 -f 2025-12-31
python .\assets\js\rota\team\_helper.py -n Shital -o add -i 2-Afternoon -l 2-Rotation -w 'fri-sat' -r 4 -s 2024-12-25 -f 2025-12-31
python .\assets\js\rota\team\_helper.py -n "P Jayesh" -o add -i 2-Afternoon -l 2-Rotation -w 'tue-wed' -r 4 -s 2024-12-24 -f 2025-12-31

python .\assets\js\rota\team\_helper.py -o add -i 2-Afternoon -l 1-Basic -s 2024-12-30 -f 2025-12-31 -n Vedant

python .\assets\js\rota\team\_helper.py -o add -i 3-Night -l 1-Basic -s 2024-12-30 -f 2025-12-31 -n Viral
python .\assets\js\rota\team\_helper.py -o add -i 3-Night -l 1-Basic -s 2024-12-27 -f 2025-12-31 -n Vivek
python .\assets\js\rota\team\_helper.py -o add -i 3-Night -l 1-Basic -s 2024-12-25 -f 2025-12-31 -n "H Jayesh"
```
