const { updateCanData, defaultCanData, purgeCanData } = require('../utils/can-data-utils');
const log = require('../utils/logger')({ 
    serviceName: 'SCHEDULER',
    serviceColor: 'cyan'
});

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
        log.log('Starting time interval...');
        this.intervalRef = setInterval(() => {
            if (this.canData) {
                this._insert();
                this._publish();
                this.canData = defaultCanData();
            }
        }, this.config.interval);
        log.success('Time interval started');
    }

    update(message, timestamp) {
        if (this.canData) {
            updateCanData(this.canData, message, timestamp);
            purgeCanData(this.canData, this.model);
        }
    }

    stop() {
        console.debug('Scheduler: Stopping timeinterval...');
        clearInterval(this.intervalRef);
        console.debug('Scheduler: timeinterval stopped...');
    }

    constructor(config, mqtt, database, dataModel) {
        this.config = config;
        this.mqtt = mqtt;
        this.database = database;
        this.model = dataModel.subscribe({ 
            name: 'scheduler', 
            handler: model => this.model = model 
        });

        this.canData = defaultCanData();
        this._startInterval();
    }

}

module.exports = Scheduler;