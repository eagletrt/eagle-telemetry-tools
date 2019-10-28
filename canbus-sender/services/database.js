const { MongoClient } = require('mongodb');
const log = require('../utils/logger')({ 
    serviceName: 'DB',
    serviceColor: 'yellow'
});

class Database {

    _getUri() {
        const { host, port, dbName } = this.config;
        return `mongodb://${host}:${port}/${dbName}`;
    }

    _connect() {
        log.log('Connecting to mongodb...');
        const uri = this._getUri();
        log.log('MongoDB: uri is ' + uri);
        this.collection = `${this.config.collection}-${(new Date()).toLocaleString().replace(/\s/g,'-')}`
        log.log('MongoDB: collection is ' + this.collection);
        MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (error, database) => {
            if (error) {
                log.error('Error in connecting to MongoDB ', error);
            } else {
                log.success('Connected to mongodb');
                this.database = database;
            }
        });
    }

    insert(data) {
        log.debug('Inserting data 1');
        if (this.database) {
            log.debug('Inserting data 2', data);
            this.database
                .db(this.config.dbName)
                .collection(this.collection)
                .insertOne(data, (error, _res) => {
                    if (error) {
                        log.error('Error in inserting data to mongodb ', error);
                    }
                });
        }
    }

    constructor(config) {
        this.config = config;

        this._connect();
    }

}

module.exports = Database;