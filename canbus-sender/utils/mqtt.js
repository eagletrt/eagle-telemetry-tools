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
    console.log('Add listener to Config Topic');
    client.on('message', function(t, message) {
        if (t == configTopic) {
            //console.log('message', message)
            //console.log('messagetostring', message.toString())
            dataModel.update(JSON.parse(message.toString()));
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
            else {
                data = JSON.stringify(data);
            }
            client.publish(topic, data);
        }
    }
};