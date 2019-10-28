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
            log.debug('Flushing the toilet 2');
            if (this.canData) {
                log.debug('Flushing the toilet 1');
                //purgeCanData(this.canData, this.model);
                this._insert();
                this._publish();
                this.canData = defaultCanData();
            }
        }, this.config.interval);
        log.success('Time interval started');
    }

    update(message, timestamp) {
        if (this.canData) {
            log.debug('Updating can data');
            updateCanData(this.canData, message, timestamp);
            log.debug('Updating candata', this.canData)
        }
    }

    stop() {
        log.log('Stopping timeinterval...');
        clearInterval(this.intervalRef);
        log.success('Timeinterval stopped');
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