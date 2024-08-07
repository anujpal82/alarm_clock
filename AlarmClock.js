const Alarm = require('./Alarm');
const moment = require('moment');

class AlarmClock {
    constructor() {
        this.alarms = [];
        this.interval = null;
        this.rl = null;
        this.showMenu = null
    }

    displayCurrentTime() {
        console.log(`Current time: ${moment().format('DD-MM-YYYY HH:mm:ss')}`);
    }

    addAlarm(time, alertMessage) {
        const alarm = new Alarm(time, alertMessage);
        this.alarms.push(alarm);
        console.log(`Alarm set for ${alarm.time.format('DD-MM-YYYY HH:mm')} with message: ${alertMessage}`);
        this.showMenu()
    }

    deleteAlarm(index) {
        if (this.alarms[index]) {
            this.alarms.splice(index, 1);
            console.log(`Alarm at index ${index + 1} has been deleted.`);
        } else {
            console.log('Alarm not found.');
        }
    }
    isAlarms(){
        this,this.alarms.length>0
    }

    viewAllAlarms() {
        if (this.alarms.length === 0) {
            console.log('No alarms set.');
            return;
        }
        console.log('Current Alarms:');
        this.alarms.forEach((alarm, index) => {
            const time = alarm.time.format('DD-MM-YYYY HH:mm');
            const snoozeEndTime = alarm.snoozeEndTime ? alarm.snoozeEndTime.format('DD-MM-YYYY HH:mm') : 'None';
            console.log(`Alarm ${index + 1}: ${time}, Message: ${alarm.alertMessage}, Snooze End Time: ${snoozeEndTime}`);
        });
    }

    snoozeAlarm(index, snoozeTime) {
        if (this.alarms[index]) {
            const success = this.alarms[index].snooze(snoozeTime);
            if (success) {
                console.log(`Alarm snoozed for ${snoozeTime} minutes.It is now ${this.alarms[index].snoozeEndTime.format('DD-MM-YYYY HH:mm')}`);
            }
            if (!success) {
                console.log('No snooze attempts left for this alarm. Deleting the alarm.');
                this.alarms.splice(index, 1);
            }
        } else {
            console.log('Alarm not found.');
        }
    }

    async checkAlarms() {
        const now = moment();
        for (let i = 0; i < this.alarms.length; i++) {
            const alarm = this.alarms[i];
            if (alarm.isTriggered(now)) {
                console.log(`Alarm triggered => tag : ${alarm.alertMessage}`);
                alarm.markAsTriggered();
                await this.askSnooze(i);
            }
        }
    }

    askSnooze(index) {
        return new Promise(resolve => {
            if (this.rl) {
                this.rl.question('Do you want to snooze this alarm? (yes/no): ', answer => {
                    if (answer.toLowerCase() === 'yes') {
                        this.rl.question('Enter snooze time in minutes: ', minutes => {
                            this.snoozeAlarm(index, parseInt(minutes, 10));
                            resolve();
                        });
                    }
                    else if (answer.toLowerCase() === 'no') {
                        console.log('Alarm dismissed.');
                        this.alarms.splice(index, 1);
                        resolve();
                        this.showMenu()
                    } else {
                        console.log('Invalid option. Please try again.');
                        resolve();
                        this.askSnooze(index);
                    }
                });
            } else {
                resolve();
            }
        });
    }

    start(rl, showMenu) {
        this.rl = rl;
        this.showMenu = showMenu
        this.interval = setInterval(async () => {
            await this.checkAlarms();
        }, 1000);
    }

    stop() {
        clearInterval(this.interval);
    }
}

module.exports = AlarmClock;
