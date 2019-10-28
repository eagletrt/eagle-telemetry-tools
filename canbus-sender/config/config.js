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
    database: {
        host: 'localhost',
        port: 27017,
        dbName: 'telemetria',
        collection: 'chimera'
    },
    scheduler: {
        interval: 500,
        insertDatabase: true,
        publishMqtt: true
    },
    dataModel: {
        path: 'data-model/dataModel.json'
    },
    logger: {
        timestamp: true,
        debug: false || (process.argv.slice(2).indexOf('debug') !== -1)
    }
};