const os = require('os');
const shell = require('shelljs');
const can = require('socketcan');

//const { interface } = require('../config/config').can;

let interface = "vcan0",
    channel;

function startShell() {
    console.log('Starting can shell...');
    // TODO: only if needed
    if (os.arch() == "arm") {
        shell.exec('./tools/can.sh')
        interface = "can0"
    } else {
        shell.exec('./tools/can.sh vcan0');
        interface = "vcan0"
    }
    console.log('Can shell started');
}

function startChannel() {
    console.log('Starting can channel...');
    channel = can.createRawChannel(interface, true);
    channel.start();
    console.log('Can channel started');
}

function addListener(scheduler) {
    channel.addListener("onMessage",
        message => {
            scheduler.update(message);
        }
    );
}

module.exports = {
    init: (scheduler, dataModel) => {
        startShell();
        startChannel();
        addListener(scheduler);
    }
};