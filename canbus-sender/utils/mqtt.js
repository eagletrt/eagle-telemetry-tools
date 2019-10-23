const mqtt = require('mqtt');
const bson = require('bson');

const { configTopic, topic, host, port, useBson } = require('../config/config').mqtt;

const uri = 'mqtt://' + host + ':' + port;
let client, connected = false,
    dataModel

function connect() {
    console.log('connecting to mqtt...');
    client = mqtt.connect(uri);
    client.on('connect', () => {
        connected = true;
        console.log('connected to mqtt');
        subscribeConfig();
        onConfigMessage();
    });
}

function subscribeConfig() {
    console.log('subscribing to mqtt config...');
    client.subscribe(configTopic, error => {
        if (error) {
            console.error('Error in connecting to ' + configTopic, error);
        } else {
            console.log('subscribed to mqtt config');
        }
    });
}

function onConfigMessage() {
    console.log('on config message');
    client.on('message', function(t, message) {
        if (t == configTopic) {
            dataModel.update(JSON.parse(message));
        }
    });
}


module.exports = {
    init: dModel => {
        dataModel = dModel;
        connect();
    },
    publish: data => {
        if (connected) {
            if (useBson) {
                data = bson.serialize(data);
            }
            console.log('Publishing');
            client.publish(topic, data);
        }
    }
};