const osInfo = require('./utils/osInfo');
const can = require('./utils/can');
const dataModel = require('./utils/dataModel');
const mqtt = require('./utils/mqtt');
const scheduler = require('./utils/scheduler');
const mongo = require('./src/mongodb.js');

// Print os info
osInfo();
// Initialize dataModel
dataModel.init();
// Initialize mqtt
mqtt.init(dataModel);
// Initialize scheduler
scheduler.init(mqtt, mongo);
// Initialize can
can.init(scheduler, dataModel);