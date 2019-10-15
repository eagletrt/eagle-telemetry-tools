const mqtt = require('mqtt');
const os = require('os');
const { deserialize } = require('bson');

const mongo = require('./mongodb.js');
const config = require('./config/config.json');

const topic = config.mqtt.topic[0];
const hostname = config.mqtt.hostname;
const port = config.mqtt.port;
const mqttUri = 'mqtt://' + hostname + ':' + port;

const client = mqtt.connect(mqttUri);

console.log(" OS: " + os.type() + " " + os.release() + " (" + os.arch() + ")");
console.log("RAM: " + os.totalmem() / 1048576 + " MB (total), " + os.freemem() / 1048576 + " MB (free)");
console.log("CPU: " + os.cpus()[0].speed + " MHz " + os.cpus()[0].model + "\n");

client.on('connect', () => {
    console.log('Connecting to ' + topic + '...')
    client.subscribe(topic, function(err) {
        if (err) {
            console.error('Error in connecting ', err);
        } else {
            console.log('Connected!');
        }
    });

});

client.on('offline', () => {
    client.unsubscribe(topic);
    console.log('Disconnected from /' + topic + '.');
});

client.on('message', function(_topic, message) {
    try {
        var data = deserialize(message);
        mongo.insertData(data);
    } catch (error) {
        console.log('json bad format', error, message)
    }
});