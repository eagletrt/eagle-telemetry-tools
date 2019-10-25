// Module dependencies
const os = require('os');
const shell = require('shelljs');
const can = require('socketcan');

// Module class
class Can {

    // Private methods
    _startShell() {
        // TODO: only if needed
        console.debug('Starting can shell...');
        if (os.arch() == "arm") {
            shell.exec('./tools/can.sh')
            this.interface = "can0"
        } else {
            shell.exec('./tools/can.sh vcan0');
            this.interface = "vcan0"
        }
        console.debug('Can shell started...');
    }

    _startChannel() {
        console.debug('Starting can channel...');
        this.channel = can.createRawChannel(this.interface, true);
        this.channel.start();
        console.debug('Can channel started');
    }

    _addListener() {
        console.log('Adding can onMessage listener...');
        this.channel.addListener("onMessage",
            message => {
                this.scheduler.update(message);
            }
        );
        console.log('Can onMessage listener created');
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