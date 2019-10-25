const mqtt = require('mqtt');
const bson = require('bson');

class Mqtt {

    _getUri() {
        const { protocol, host, port } = this.config;
        return `${protocol}://${host}:${port}`;
    }

    _connect() {
        console.debug('Mqtt: connecting to mqtt...');
        const uri = this._getUri();
        console.debug('Mqtt: uri is ' + uri);
        this.client = mqtt.connect(uri);
        this.client.on('connect', () => {
            console.debug('Mqtt: connected to mqtt');
            this.connected = true;
            this._subscribeToConfig();
            this._onConfigMessage();
        });
    }

    _subscribeToConfig() {
        console.debug('Mqtt: subscribing to mqtt config...');
        this.client.subscribe(this.config.topic.config, error => {
            if (error) {
                console.error('Error in connecting to ' + this.config.topic.config, error);
            } else {
                console.debug('Mqtt: subscribed to mqtt config');
            }
        });
    }

    _onConfigMessage() {
        console.debug('Mqtt: adding listener to Config Topic...');
        this.client.on('message', (topic, message) => {
            switch (topic) {
                case this.config.topic.config:
                    this.dataModel.update(JSON.parse(message.toString()));
                    break;
            }
        });
        console.debug('Mqtt: listener added to Config Topic...');
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