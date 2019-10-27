// Module dependencies
const os = require('os');
const shell = require('shelljs');
const can = require('socketcan');

const updateDataModel = require('../utils/updateDataModel');
const log = require('../utils/logger')({ 
    serviceName: 'CAN',
    serviceColor: 'magenta'
});

// Module class
class Can {

    // Private methods
    _startShell() {
        // TODO: only if needed
        log.log('Starting can shell...');
        if (os.arch() == "arm") {
            shell.exec('./tools/can.sh')
            this.interface = "can0"
        } else {
            shell.exec('./tools/can.sh vcan0');
            this.interface = "vcan0"
        }
        log.success('Can shell started');
    }

    _startChannel() {
        try {
            log.log('Starting can channel...');
            this.channel = can.createRawChannel(this.interface, true);
            this.channel.start();
            log.success('Can channel started');
        }
        catch(error) {
            log.error('Error in starting can channel', error);
        }
    }

    _addListener() {
        try {
            log.log('Adding onMessage listener...');
            this.channel.addListener("onMessage",
                message => {
                    const timestamp = Date.now();
                    this.scheduler.update(message, timestamp);
                    updateDataModel(message, this.dataModel);
                }
            );
            log.success('Can onMessage listener created');
        }
        catch(error) {
            log.error('Error in adding onMessage listener', error);
        }
    }

    // Constructor
    constructor(scheduler, dataModel) {
        this.scheduler = scheduler;
        this.dataModel = dataModel;

        this._startShell();
        this._startChannel();
        this._addListener();
    }

}

// Export the module class
module.exports = Can;