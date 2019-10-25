const config = require('./config/config');

const osInfo = require('./utils/osInfo');
const Can = require('./services/can');
const Scheduler = require('./services/scheduler');
const DataModel = require('./services/dataModel');
const Mqtt = require('./services/mqtt');
const Database = require('./services/database');

// Print os info
osInfo();
// Initialize dataModel
const dataModel = new DataModel(config.dataModel);
// Initialize database
const database = new Database(config.database);
// Initialize mqtt
const mqtt = new Mqtt(config.mqtt, dataModel);
// Initialize scheduler
const scheduler = new Scheduler(config.scheduler, mqtt, database);
// Initialize can
const can = new Can(scheduler, dataModel);