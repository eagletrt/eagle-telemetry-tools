const osInfo = require('./utils/osInfo');
const can = require('./utils/can');
const dataModel = require('./utils/dataModel');
const mqtt = require('./utils/mqtt');
const scheduler = require('./utils/scheduler');
const database = require('./utils/database');

// Print os info
osInfo();
// Initialize dataModel
dataModel.init();
// Initialize mqtt
mqtt.init(dataModel);
// Initialize scheduler
scheduler.init(mqtt, database);
// Initialize can
can.init(scheduler, dataModel);