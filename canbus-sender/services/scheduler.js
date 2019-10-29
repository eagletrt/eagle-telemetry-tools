const { updateCanData, defaultCanData, purgeCanData, updateMatlabData } = require('../utils/can-data-utils');
const log = require('../utils/logger')({ 
    serviceName: 'SCHEDULER',
    serviceColor: 'cyan'
});

class Scheduler {

    _insertStructured() {
        if (this.config.insertDatabaseStructured) {
            this.database.insertStructured(this.canData);
        }
    }

    _insertMatlab(message, timestamp) {
        const matlabData = updateMatlabData(message, timestamp);
        if (this.config.insertDatabaseMatlab) {
            this.database.insertMatlab(matlabData);
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
                log.debug('Flushing the toilet');
                purgeCanData(this.canData, this.model);
                this._insertStructured();
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
        }
        this._insertMatlab(message, timestamp);
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