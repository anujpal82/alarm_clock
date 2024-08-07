const readline = require('readline');
const AlarmClock = require('./AlarmClock');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const clock = new AlarmClock();

const question = (query) => {
    return new Promise(resolve => rl.question(query, resolve));
};

const showMenu = async () => {
    console.log('\nAlarm Clock Menu:');
    console.log('1. Display current time');
    console.log('2. Add Alarm');
    console.log('3. View Alarms');
    console.log('4. Delete Alarm');
    console.log('5. Exit');

    const option = await question('Choose an option: ');
    await handleInput(option);
};

const handleInput = async (option) => {
    switch (option) {
        case  '1':
            clock.displayCurrentTime();
            showMenu()
            break;
        case '2':
            const time = await question('Enter alarm time (dd-mm-yyyy hh:mm): ');
            const alertMessage = await question('Enter alert message: ');
            clock.addAlarm(time, alertMessage);
            break;
        case '3':
            clock.viewAllAlarms();
            showMenu()
            break;
        case '4':
            console.log('Exiting Alarm Clock...');
            clock.viewAllAlarms();
            if (!clock.isAlarms()) {
                return showMenu()
            }
            const index = await question('Enter the index of the alarm you want to delete: ');
            clock.deleteAlarm(index);
            rl.close();
            showMenu()
            return;
        case '5':
            clock.stop();
            rl.close();
            showMenu()
            return;
        default:
            console.log('Invalid option. Please try again.');
            showMenu()
            break;
    }
};

console.log('Starting Alarm Clock...');
clock.start(rl, showMenu);
showMenu();
