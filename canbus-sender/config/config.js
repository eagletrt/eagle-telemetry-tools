module.exports = {
    mqtt: {
        topic: 'chimera',
        configTopic: 'chimera/config',
        host: 'localhost',
        port: 1883,
        useBson: true
    },
    mongodb: {
        insert: true,
        address: 'localhost',
        port: 27017,
        dbName: 'telemetria',
        collections: ['chimera', 'fenice']
    },
    can: {
        interface: 'can0'
    },
    scheduler: {
        interval: 500,
        insertDatabase: true,
        publishMqtt: true
    },
    dataModel: require('./dataModel.json')
};