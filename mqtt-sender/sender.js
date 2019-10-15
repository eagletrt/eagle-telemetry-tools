var mqtt = require('mqtt');
var os = require('os');
var can = require('socketcan');
var config = require('./config/config.json');
//var helpers = require('./src/functions.js');

var topic = config.mqtt.topic[0];
var hostname = config.mqtt.hostname;
var port = config.mqtt.port;
var canPort = config.can.port;
var mqttUri = 'mqtt://' + hostname + ':' + port;

var client = mqtt.connect(mqttUri);
var channel = can.createRawChannel(canPort, true);

console.log(" OS: " + os.type() + " " + os.release() + " (" + os.arch() + ")");
console.log("RAM: " + os.totalmem() / 1048576 + " MB (total), " + os.freemem() / 1048576 + " MB (free)");
console.log("CPU: " + os.cpus()[0].speed + " MHz " + os.cpus()[0].model + "\n");

client.on('connect', () => {
    console.log('Connecting to topic chimera...')
    client.subscribe(topic)
    console.log('Connected!')

    channel.start()

    //helpers.startStream();
});

// Log any message
channel.addListener("onMessage", function(msg) {
    console.log(msg);
    client.publish(topic, JSON.stringify({
        'id': msg.id,
        'data': msg.data,
    }))
});