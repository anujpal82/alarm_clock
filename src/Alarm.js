const moment = require('moment');

class Alarm {
    constructor(time, alertMessage) {
        this.time = moment(time, 'DD-MM-YYYY HH:mm');
        this.alertMessage = alertMessage;
        this.snoozeEndTime = null;
        this.triggered = false; 
        this.snoozeAttempts = 0;
        this.maxSnoozeAttempts = 3; 
    }

    snooze(minutes) {
        if (this.snoozeAttempts >= this.maxSnoozeAttempts) {
            return false; 
        }
        this.snoozeEndTime = moment().add(minutes, 'minutes');
        this.triggered = false; 
        this.snoozeAttempts++; 
        return true; 
    }

    isTriggered(now) {
        const timeMatches = now.isSameOrAfter(this.time);
        const isAfterSnoozeEndTime = this.snoozeEndTime ? now.isAfter(this.snoozeEndTime) : true;
        const isNotTriggered = !this.triggered;
        return timeMatches && isAfterSnoozeEndTime && isNotTriggered;
    }

    markAsTriggered() {
        this.triggered = true; // Mark the alarm as triggered
    }

    isSnoozeLimitReached() {
        return this.snoozeAttempts >= this.maxSnoozeAttempts;
    }
}

module.exports = Alarm;
