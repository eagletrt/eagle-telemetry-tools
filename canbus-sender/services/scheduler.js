const { updateCanData, defaultCanData } = require('../utils/canDataUtils');

class Scheduler {

    _insert() {
        if (this.config.insertDatabase) {
            this.database.insert(this.canData);
        }
    }

    _publish() {
        if (this.config.publishMqtt) {
            this.mqtt.publish(this.canData);
        }
    }

    _startInterval() {
        console.debug('Scheduler: starting time interval...');
        this.intervalRef = setInterval(() => {
            this._insert();
            this._publish();
            this.canData = defaultCanData();
        }, this.config.interval);
        console.debug('Scheduler: time interval started...');
    }

    update(message) {
        this.canData = updateCanData(canData, message);
    }

    stop() {
        console.debug('Scheduler: Stopping timeinterval...');
        clearInterval(this.intervalRef);
        console.debug('Scheduler: timeinterval stopped...');
    }

    constructor(config, mqtt, database) {
        this.config = config;
        this.mqtt = mqtt;
        this.database = database;

        this.canData = defaultCanData();
        this._startInterval();
    }

}

module.exports = Scheduler;