module.exports = {
    mqtt: {
        host: 'localhost',
        port: 1883,
        protocol: 'mqtt',
        sendBson: true,
        topic: {
            data: 'chimera',
            config: 'chimera/config'
        }
    },
    mongodb: {
        insert: true,
        address: 'localhost',
        port: 27017,
        dbName: 'telemetria',
        collections: ['chimera', 'fenice']
    },
    scheduler: {
        interval: 500,
        insertDatabase: true,
        publishMqtt: true
    },
    dataModel: {
        path: 'data-model/dataModel.json'
    }
};