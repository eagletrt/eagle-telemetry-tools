const mqtt = require('mqtt');
const bson = require('bson');
const log = require('../utils/logger')({ 
    serviceName: 'MQTT',
    serviceColor: 'green',
    showTimestamp: true
});

class Mqtt {

    _getUri() {
        const { protocol, host, port } = this.config;
        return `${protocol}://${host}:${port}`;
    }

    _connect() {
        log.log('Connecting to mqtt...');
        const uri = this._getUri();
        log.debug('Uri is ' + uri);
        this.client = mqtt.connect(uri);
        this.client.on('connect', () => {
            log.success('Connected to mqtt');
            this.connected = true;
            this._subscribeToConfig();
            this._onConfigMessage();
        });
    }

    _subscribeToConfig() {
        log.log('Subscribing to config topic...');
        log.debug('Config Topic is ' + this.config.topic.config);
        this.client.subscribe(this.config.topic.config, error => {
            if (error) {
                log.error('Error in connecting to ' + this.config.topic.config, error);
            } else {
                log.success('Subscribed to config topic');
            }
        });
    }

    _onConfigMessage() {
        log.log('Adding listener to Config Topic...');
        this.client.on('message', (topic, message) => {
            switch (topic) {
                case this.config.topic.config:
                    this.dataModel.update(JSON.parse(message.toString()));
                    break;
            }
        });
        log.success('Listener added to Config Topic');
    }


    publish(data) {
        if (this.connected) {
            if (this.config.sendBson) {
                data = bson.serialize(data);
            } else {
                data = JSON.stringify(data);
            }
            this.client.publish(this.config.topic.data, data);
        }
    }

    constructor(config, dataModel) {
        this.config = config;
        this.dataModel = dataModel;

        this.connected = false;
        this._connect();
    }

}

module.exports = Mqtt;